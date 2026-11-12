package com.hardcore.pedidos.itempedido.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoRequestDTO;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoResponseDTO;
import com.hardcore.pedidos.itempedido.service.ItemPedidoService;
import com.hardcore.pedidos.itempedido.routes.RotasItemPedido;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ItemPedidoController {

    private final ItemPedidoService itemPedidoService;

    @PostMapping(RotasItemPedido.SALVAR)
    public ResponseEntity<ItemPedidoResponseDTO> salvarItem(@RequestBody @Valid ItemPedidoRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemPedidoService.salvarItem(requestDTO));
    }

    @GetMapping(RotasItemPedido.LISTAR_POR_PEDIDO)
    public ResponseEntity<List<ItemPedidoResponseDTO>> listarPorPedido(@PathVariable Long idPedido) {
        return ResponseEntity.ok(itemPedidoService.listarItensPorPedido(idPedido));
    }

    @GetMapping(RotasItemPedido.BUSCAR_POR_ID)
    public ResponseEntity<ItemPedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(itemPedidoService.buscarItemPorId(id));
    }

    @DeleteMapping(RotasItemPedido.DELETAR)
    public ResponseEntity<Void> deletarItem(@PathVariable Long id) {
        itemPedidoService.deletarItem(id);
        return ResponseEntity.noContent().build();
    }
}