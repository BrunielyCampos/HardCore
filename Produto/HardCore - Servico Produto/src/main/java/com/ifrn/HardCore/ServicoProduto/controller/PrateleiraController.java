package com.ifrn.HardCore.ServicoProduto.controller;

import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraResponseDTO;
import com.ifrn.HardCore.ServicoProduto.rotasController.RotasPrateleira;
import com.ifrn.HardCore.ServicoProduto.service.PrateleiraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RotasPrateleira.PRATELEIRA_BASE)
public class PrateleiraController {
    private final PrateleiraService service;

    public PrateleiraController(PrateleiraService service) {
        this.service = service;
    }

    @PostMapping(RotasPrateleira.CADASTRAR)
    public ResponseEntity<PrateleiraResponseDTO> criarPrateleira(
            @RequestBody PrateleiraRequestDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarPrateleira(dto));
    }

    @GetMapping(RotasPrateleira.LISTAR)
    public ResponseEntity<List<PrateleiraResponseDTO>> listarPrateleira() {

        return ResponseEntity.ok().body(service.listarPrateleira());
    }

    @GetMapping(RotasPrateleira.BUSCAR_POR_PRODUTO)
    public ResponseEntity<PrateleiraResponseDTO> buscarProdutoPrateleira(@PathVariable Long id) {

        return ResponseEntity.ok().body(service.listarProdutosPrateleiraById(id));
    }

    @PostMapping(RotasPrateleira.TRANSFERIR)
    public ResponseEntity<PrateleiraResponseDTO> transferirParaPrateleira(@PathVariable Long produtoId, @RequestParam int quantidade) {

        return ResponseEntity.ok().body(service.transferirParaPrateleira(produtoId, quantidade));
    }

    @DeleteMapping(RotasPrateleira.REMOVER_PRODUTO)
    public ResponseEntity<Void> deletarProdutoPrateleira(@PathVariable Long produtoId) {

        service.deleteProdutoPrateleira(produtoId);

        return ResponseEntity.noContent().build();
    }

}
