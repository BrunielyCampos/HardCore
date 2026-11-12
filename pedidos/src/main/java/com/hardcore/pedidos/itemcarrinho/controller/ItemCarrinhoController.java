package com.hardcore.pedidos.itemcarrinho.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoRequestDTO;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoResponseDTO;
import com.hardcore.pedidos.itemcarrinho.routes.RotasItemCarrinho;
import com.hardcore.pedidos.itemcarrinho.service.ItemCarrinhoService;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ItemCarrinhoController {

    private final ItemCarrinhoService itemCarrinhoService;

    @PostMapping(RotasItemCarrinho.ADICIONAR)
    public ResponseEntity<ItemCarrinhoResponseDTO> adicionarItem(@RequestBody @Valid ItemCarrinhoRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemCarrinhoService.adicionarItem(requestDTO));
    }

    @GetMapping(RotasItemCarrinho.LISTAR_POR_CARRINHO)
    public ResponseEntity<List<ItemCarrinhoResponseDTO>> listarPorCarrinho(@PathVariable Long idCarrinho) {
        return ResponseEntity.ok(itemCarrinhoService.listarItensPorCarrinho(idCarrinho));
    }

    @DeleteMapping(RotasItemCarrinho.DELETAR)
    public ResponseEntity<Void> removerItem(@PathVariable Long id) {
        itemCarrinhoService.removerItem(id);
        return ResponseEntity.noContent().build();
    }
}