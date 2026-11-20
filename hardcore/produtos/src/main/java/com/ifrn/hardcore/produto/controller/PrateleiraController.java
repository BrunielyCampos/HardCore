package com.ifrn.hardcore.produto.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ifrn.hardcore.produto.DTO.PrateleiraRequestDTO;
import com.ifrn.hardcore.produto.DTO.PrateleiraResponseDTO;
import com.ifrn.hardcore.produto.rotasController.RotasPrateleira;
import com.ifrn.hardcore.produto.service.PrateleiraService;
import java.util.List;

@RestController
@RequestMapping(RotasPrateleira.PRATELEIRA_BASE)
public class PrateleiraController {

    private final PrateleiraService service;

    public PrateleiraController(PrateleiraService service) {
        this.service = service;
    }

    @PostMapping(RotasPrateleira.CADASTRAR)
    public ResponseEntity<PrateleiraResponseDTO> criarPrateleira(@Valid @RequestBody PrateleiraRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarPrateleira(dto));
    }

    @GetMapping(RotasPrateleira.LISTAR)
    public ResponseEntity<List<PrateleiraResponseDTO>> listarPrateleira() {
        return ResponseEntity.ok(service.listarPrateleira());
    }

    @GetMapping(RotasPrateleira.BUSCAR_POR_PRODUTO)
    public ResponseEntity<PrateleiraResponseDTO> buscarProdutoPrateleira(@PathVariable("produtoId") Long produtoId) {
        return ResponseEntity.ok(service.listarProdutosPrateleiraById(produtoId));
    }

    @PostMapping(RotasPrateleira.TRANSFERIR)
    public ResponseEntity<PrateleiraResponseDTO> transferirParaPrateleira(
            @PathVariable("produtoId") Long produtoId, @RequestParam int quantidade) {
        return ResponseEntity.ok(service.transferirParaPrateleira(produtoId, quantidade));
    }

    @DeleteMapping(RotasPrateleira.REMOVER_PRODUTO)
    public ResponseEntity<Void> deletarProdutoPrateleira(@PathVariable("produtoId") Long produtoId) {
        service.deleteProdutoPrateleira(produtoId);
        return ResponseEntity.noContent().build();
    }
}