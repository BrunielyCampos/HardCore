package com.hardcore.pedidos.itemcarrinho.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<ItemCarrinhoResponseDTO> adicionarItem(@RequestBody @Valid ItemCarrinhoRequestDTO requestDTO, Authentication authentication) {
        Long idUsuario = obterIdUsuario(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itemCarrinhoService.adicionarItem(requestDTO, idUsuario));
    }

    @GetMapping(RotasItemCarrinho.LISTAR_POR_CARRINHO)
    public ResponseEntity<List<ItemCarrinhoResponseDTO>> listarPorCarrinho(
            @PathVariable Long idCarrinho,
            Authentication authentication
    ) {
        Long idUsuario = obterIdUsuario(authentication);

        return ResponseEntity.ok(
                itemCarrinhoService.listarItensPorCarrinho(idCarrinho, idUsuario)
        );
    }

    @DeleteMapping(RotasItemCarrinho.DELETAR)
    public ResponseEntity<Void> removerItem(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long idUsuario = obterIdUsuario(authentication);

        itemCarrinhoService.removerItem(id, idUsuario);

        return ResponseEntity.noContent().build();
    }

    private Long obterIdUsuario(Authentication authentication) {

        Object details = authentication.getDetails();

        if (details instanceof Long) {
            return (Long) details;
        }

        throw new AccessDeniedException(
                "Não foi possível identificar o usuário autenticado."
        );
    }
}