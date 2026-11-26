package com.hardcore.pedidos.pedido.service;

import com.hardcore.pedidos.integracao.UsuarioClient;
import com.hardcore.pedidos.pedido.dto.PedidoRequestDTO;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.exception.PedidoNaoEncontradoException;
import com.hardcore.pedidos.pedido.mapper.PedidoMapper;
import com.hardcore.pedidos.pedido.model.EstadoCompraEnum;
import com.hardcore.pedidos.pedido.model.EstadoPagamentoEnum;
import com.hardcore.pedidos.pedido.model.Pedido;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.hardcore.pedidos.rabbitmq.PedidoPagoEvent;
import com.hardcore.pedidos.rabbitmq.PedidoPagoProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoMapper pedidoMapper;
    private final PedidoRepository pedidoRepository;
    private final UsuarioClient usuarioClient;
    private final PedidoPagoProducer pedidoPagoProducer;

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO requestDTO) {

        Authentication autenticacao =
                SecurityContextHolder.getContext().getAuthentication();

        if (autenticacao == null || !autenticacao.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Autenticação necessária."
            );
        }

        Object usuarioId = autenticacao.getDetails();

        if (!(usuarioId instanceof Long)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Não foi possível identificar o cliente autenticado."
            );
        }

        Long idClienteAutenticado = (Long) usuarioId;

        if (!idClienteAutenticado.equals(requestDTO.getIdCliente())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você só pode criar pedidos em seu próprio nome."
            );
        }

        Pedido pedido = pedidoMapper.toEntity(requestDTO);

        pedido.setId(null);
        pedido.setIdCliente(idClienteAutenticado);
        pedido.setIdEntregador(null);

        Pedido salvo = pedidoRepository.save(pedido);

        return pedidoMapper.toDTO(salvo);
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO buscarPedidoPorId(Long id) {
        Pedido pedido = buscar(id);
        return pedidoMapper.toDTO(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosPorCliente(Long idCliente) {
        return pedidoRepository.findByIdCliente(idCliente).stream()
            .map(pedidoMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void atualizarStatus(Long id, EstadoCompraEnum novoEstado) {
        Pedido pedido = buscar(id);
        pedido.setEstado(novoEstado);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public void cancelarPedido(Long id) {
        Pedido pedido = buscar(id);
        pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public PedidoResponseDTO atribuirEntregador(Long idPedido, Long idEntregador) {

        Pedido pedido = buscar(idPedido);

        boolean ehEntregador = usuarioClient.validarEntregador(idEntregador);

        if (!ehEntregador) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O usuário informado não possui perfil de ENTREGADOR."
            );
        }

        pedido.setIdEntregador(idEntregador);

        Pedido salvo = pedidoRepository.save(pedido);

        if (salvo.getEstadoPagamento() == EstadoPagamentoEnum.PAGO) {
            pedidoPagoProducer.publicar(
                    new PedidoPagoEvent(
                            salvo.getId(),
                            salvo.getIdCliente(),
                            salvo.getIdEntregador()
                    )
            );
        }

        return pedidoMapper.toDTO(salvo);
    }

    private Pedido buscar(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNaoEncontradoException("Pedido não encontrado com o ID: " + id));
    }
}