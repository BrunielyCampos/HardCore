package com.hardcore.entrega.entrega.service;

import com.hardcore.entrega.entrega.dto.EntregaRequestDTO;
import com.hardcore.entrega.entrega.dto.EntregaResponseDTO;
import com.hardcore.entrega.entrega.exception.EntregaNaoEncontradaException;
import com.hardcore.entrega.entrega.mapper.EntregaMapper;
import com.hardcore.entrega.entrega.model.Entrega;
import com.hardcore.entrega.entrega.model.EntregaEnum;
import com.hardcore.entrega.entrega.repository.EntregaRepository;
import com.hardcore.entrega.integracao.UsuarioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntregaService {

    private final EntregaMapper entregaMapper;
    private final EntregaRepository entregaRepository;
    private final NotificacaoEntregaProducer notificacaoProducer;
    private final UsuarioClient usuarioClient;
    private final com.hardcore.entrega.rabbitmq.EntregaStatusProducer statusProducer;

   public EntregaResponseDTO atribuirEntrega(EntregaRequestDTO requestDTO) {
    usuarioClient.validarEntregador(requestDTO.getIdEntregador());
    Entrega entrega = entregaMapper.toEntity(requestDTO);
    entrega.setEstadoEntrega(EntregaEnum.EM_ENTREGA);
    Entrega salva = entregaRepository.save(entrega);
    notificacaoProducer.enviarNotificacaoParaEntregador(
        salva.getIdEntregador(), 
        "Nova entrega atribuída para o endereço: " + salva.getEnderecoDestino()
    );

    return entregaMapper.toDTO(salva);
}

    public EntregaResponseDTO criarEntregaDoPedido(EntregaRequestDTO requestDTO, Long idCliente) {
        var cliente = usuarioClient.buscarPorId(idCliente);
        String endereco = cliente.path("endereco").asString(null);
        if (endereco == null || endereco.isBlank()) {
            throw new IllegalStateException("O cliente não possui endereço cadastrado.");
        }
        requestDTO.setEnderecoDestino(endereco);
        if (entregaRepository.findByIdPedido(requestDTO.getIdPedido()).isPresent()) {
            return entregaMapper.toDTO(entregaRepository.findByIdPedido(requestDTO.getIdPedido()).get());
        }
        return atribuirEntrega(requestDTO);
    }

    public EntregaResponseDTO buscarEntregaPorPedido(Long idPedido) {
        Entrega entrega = entregaRepository.findByIdPedido(idPedido)
                .orElseThrow(() -> new EntregaNaoEncontradaException("Entrega não encontrada para o pedido ID: " + idPedido));
        return entregaMapper.toDTO(entrega);
    }

    public List<EntregaResponseDTO> buscarPorEntregador(Long idEntregador) {
        List<Entrega> entregas = entregaRepository.findByIdEntregador(idEntregador);
        return entregas.stream()
                .map(entregaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void notificarEntregaEfetuada(Long idEntrega) {
        Entrega entrega = buscarPorId(idEntrega);
        entrega.setEstadoEntrega(EntregaEnum.ENTREGA_FEITA);
        entregaRepository.save(entrega);
        statusProducer.publicar(entrega);
    }

    public void confirmarRecebimento(Long idEntrega, Boolean recebeu) {
        Entrega entrega = entregaRepository.findById(idEntrega)
                .orElseThrow(() -> new EntregaNaoEncontradaException("Entrega com ID " + idEntrega + " não encontrada."));
        
        entrega.setConfirmacaoCliente(recebeu);
        if (recebeu) {
            entrega.setEstadoEntrega(EntregaEnum.ENTREGA_FEITA);
        } else {
            entrega.setEstadoEntrega(EntregaEnum.EM_ENTREGA);
        }
        entregaRepository.save(entrega);
        statusProducer.publicar(entrega);
    }

    public void cancelarEntrega(Long idEntrega) {
        Entrega entrega = buscarPorId(idEntrega);
        entrega.setEstadoEntrega(EntregaEnum.CANCELADA);
        entregaRepository.save(entrega);
        statusProducer.publicar(entrega);
    }

    private Entrega buscarPorId(Long id) {
        return entregaRepository.findById(id)
                .orElseThrow(() -> new EntregaNaoEncontradaException("Entrega com ID " + id + " não encontrada."));
    }
}