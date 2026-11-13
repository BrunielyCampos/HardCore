package com.hardcore.pedidos.itempedido.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoRequestDTO;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoResponseDTO;
import com.hardcore.pedidos.itempedido.exception.ItemPedidoNaoEncontradoException;
import com.hardcore.pedidos.itempedido.mapper.ItemPedidoMapper;
import com.hardcore.pedidos.itempedido.model.ItemPedido;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemPedidoService {

    private final ItemPedidoMapper itemPedidoMapper;
    private final ItemPedidoRepository itemPedidoRepository;

    @Transactional
    public ItemPedidoResponseDTO salvarItem(ItemPedidoRequestDTO requestDTO) {
        ItemPedido itemPedido = itemPedidoMapper.toEntity(requestDTO);
        itemPedido.setId(null);
        ItemPedido salvo = itemPedidoRepository.save(itemPedido);
        return itemPedidoMapper.toDTO(salvo);
    }

    public List<ItemPedidoResponseDTO> listarItensPorPedido(Long idPedido) {
        List<ItemPedido> itens = itemPedidoRepository.findByIdPedido(idPedido);
        return itens.stream()
                .map(itemPedidoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ItemPedidoResponseDTO buscarItemPorId(Long id) {
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new ItemPedidoNaoEncontradoException("Item do pedido não encontrado com o ID: " + id));
        return itemPedidoMapper.toDTO(item);
    }

    @Transactional
    public void deletarItem(Long id) {
        if (!itemPedidoRepository.existsById(id)) {
            throw new ItemPedidoNaoEncontradoException("Item do pedido não encontrado com o ID: " + id);
        }
        itemPedidoRepository.deleteById(id);
    }
}