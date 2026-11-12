package com.hardcore.pedidos.pedido.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hardcore.pedidos.pedido.dto.PedidoRequestDTO;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.exception.PedidoNaoEncontradoException;
import com.hardcore.pedidos.pedido.mapper.PedidoMapper;
import com.hardcore.pedidos.pedido.model.EstadoCompraEnum;
import com.hardcore.pedidos.pedido.model.Pedido;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoMapper pedidoMapper;
    private final PedidoRepository pedidoRepository;

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO requestDTO) {
        Pedido pedido = pedidoMapper.toEntity(requestDTO);
        pedido.setId(null);
        Pedido salvo = pedidoRepository.save(pedido);
        return pedidoMapper.toDTO(salvo);
    }

    public PedidoResponseDTO buscarPedidoPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNaoEncontradoException("Pedido não encontrado com o ID: " + id));
        return pedidoMapper.toDTO(pedido);
    }

    public List<PedidoResponseDTO> listarPedidosPorCliente(Long idCliente) {
        List<Pedido> pedidos = pedidoRepository.findByIdCliente(idCliente);
        return pedidos.stream()
                .map(pedidoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void atualizarStatus(Long id, EstadoCompraEnum novoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNaoEncontradoException("Pedido não encontrado com o ID: " + id));
        
        pedido.setEstado(novoEstado);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public void cancelarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNaoEncontradoException("Pedido não encontrado com o ID: " + id));
        
        pedido.setEstado(EstadoCompraEnum.COMPRA_CANCELADA);
        pedidoRepository.save(pedido);
    }
}