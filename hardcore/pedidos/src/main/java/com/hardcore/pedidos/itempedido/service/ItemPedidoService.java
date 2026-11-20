package com.hardcore.pedidos.itempedido.service;

import com.hardcore.pedidos.itempedido.dto.ItemPedidoRequestDTO;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoResponseDTO;
import com.hardcore.pedidos.itempedido.exception.ItemPedidoNaoEncontradoException;
import com.hardcore.pedidos.itempedido.mapper.ItemPedidoMapper;
import com.hardcore.pedidos.itempedido.model.ItemPedido;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import com.hardcore.pedidos.pedido.exception.PedidoNaoEncontradoException;
import com.hardcore.pedidos.pedido.model.Pedido;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemPedidoService {

    private final ItemPedidoMapper itemPedidoMapper;
    private final ItemPedidoRepository itemPedidoRepository;
    private final PedidoRepository pedidoRepository;

    @Transactional
    public ItemPedidoResponseDTO salvarItem(ItemPedidoRequestDTO requestDTO) {
        validarAcessoAoPedido(requestDTO.getIdPedido());
        ItemPedido itemPedido = itemPedidoMapper.toEntity(requestDTO);
        itemPedido.setId(null);
        ItemPedido salvo = itemPedidoRepository.save(itemPedido);
        return itemPedidoMapper.toDTO(salvo);
    }

    public List<ItemPedidoResponseDTO> listarItensPorPedido(Long idPedido) {

        validarAcessoAoPedido(idPedido);

        List<ItemPedido> itens =
                itemPedidoRepository.findByIdPedido(idPedido);

        return itens.stream()
                .map(itemPedidoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ItemPedidoResponseDTO buscarItemPorId(Long id) {

        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new ItemPedidoNaoEncontradoException(
                        "Item do pedido não encontrado com o ID: " + id));

        validarAcessoAoPedido(item.getIdPedido());

        return itemPedidoMapper.toDTO(item);
    }

    @Transactional
    public void deletarItem(Long id) {
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new ItemPedidoNaoEncontradoException(
                        "Item do pedido não encontrado com o ID: " + id));
        validarAcessoAoPedido(item.getIdPedido());
        itemPedidoRepository.delete(item);
    }

    private void validarAcessoAoPedido(Long idPedido) {

        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new PedidoNaoEncontradoException(
                        "Pedido não encontrado com o ID: " + idPedido));

        Authentication autenticacao =
                SecurityContextHolder.getContext().getAuthentication();

        if (autenticacao == null || !autenticacao.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Autenticação necessária."
            );
        }

        boolean gerenteOuAdmin = autenticacao.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_GERENTE")
                        || authority.getAuthority().equals("ROLE_ADMIN"));

        if (gerenteOuAdmin) {
            return;
        }

        Object usuarioId = autenticacao.getDetails();

        if (!(usuarioId instanceof Long)
                || !((Long) usuarioId).equals(pedido.getIdCliente())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para consultar os itens deste pedido."
            );
        }
    }
}