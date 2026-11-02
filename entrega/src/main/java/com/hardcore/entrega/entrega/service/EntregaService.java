package com.hardcore.entrega.entrega.service;

import com.hardcore.entrega.entrega.dto.EntregaRequestDTO;
import com.hardcore.entrega.entrega.dto.EntregaResponseDTO;
import com.hardcore.entrega.entrega.exception.EntregaNaoEncontradaException;
import com.hardcore.entrega.entrega.mapper.EntregaMapper;
import com.hardcore.entrega.entrega.model.Entrega;
import com.hardcore.entrega.entrega.model.EntregaEnum;
import com.hardcore.entrega.entrega.repository.EntregaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntregaService {

    @Autowired
    private final EntregaMapper entregaMapper;
    private final EntregaRepository entregaRepository;
    private final NotificacaoEntregaProducer notificacaoProducer;

    public EntregaResponseDTO atribuirEntrega(EntregaRequestDTO requestDTO) {
        Entrega entrega = entregaMapper.toEntity(requestDTO);
        Entrega salva = entregaRepository.save(entrega);

        // Comunicação Assíncrona: Notifica o entregador via RabbitMQ sem bloquear a resposta
        notificacaoProducer.enviarNotificacaoParaEntregador(
            salva.getIdEntregador(), 
            "Nova entrega atribuída para o endereço: " + salva.getEnderecoDestino()
        );

        return entregaMapper.toDTO(salva);
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
    }

    public void confirmarRecebimento(Long idEntrega, Boolean recebeu) {
        Entrega entrega = entregaRepository.findById(idEntrega)
                .orElseThrow(() -> new EntregaNaoEncontradaException("Entrega com ID " + idEntrega + " não encontrada."));
        
        entrega.setConfirmacaoCliente(recebeu);
        if (recebeu) {
            entrega.setEstadoEntrega(EntregaEnum.ENTREGA_FEITA);
        }
        entregaRepository.save(entrega);
    }

    public void cancelarEntrega(Long idEntrega) {
        Entrega entrega = buscarPorId(idEntrega);
        entrega.setEstadoEntrega(EntregaEnum.CANCELADA);
        entregaRepository.save(entrega);
    }

    private Entrega buscarPorId(Long id) {
        return entregaRepository.findById(id)
                .orElseThrow(() -> new EntregaNaoEncontradaException("Entrega com ID " + id + " não encontrada."));
    }
}