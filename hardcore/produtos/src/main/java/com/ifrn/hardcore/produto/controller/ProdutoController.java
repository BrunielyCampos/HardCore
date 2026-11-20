package com.ifrn.hardcore.produto.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ifrn.hardcore.produto.DTO.ProdutoRequestDTO;
import com.ifrn.hardcore.produto.DTO.ProdutoResponseDTO;
import com.ifrn.hardcore.produto.rotasController.RotasProduto;
import com.ifrn.hardcore.produto.service.ProdutoService;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;

    @PostMapping(RotasProduto.CADASTRAR)
    public ResponseEntity<ProdutoResponseDTO> cadastroProduto(@Valid @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrarProduto(dto));
    }

    // Exemplo: GET /produtos/ids?ids=1,2,3
    @GetMapping(RotasProduto.LISTAR_POR_IDS)
    public ResponseEntity<List<ProdutoResponseDTO>> listarPorIds(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(service.listarPorIds(ids));
    }

    @GetMapping(RotasProduto.LISTAR_TODOS)
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping(RotasProduto.BUSCAR_POR_ID)
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping(RotasProduto.BUSCAR_POR_CATEGORIA)
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(service.buscarPorCategoria(categoria));
    }

    @GetMapping(RotasProduto.BUSCAR_POR_MARCA)
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorMarca(@PathVariable String marca) {
        return ResponseEntity.ok(service.buscarPorMarca(marca));
    }

    @PutMapping(RotasProduto.ATUALIZAR)
    public ResponseEntity<ProdutoResponseDTO> atualizar(@PathVariable Long id,
            @Valid @RequestBody ProdutoRequestDTO produto) {
        return ResponseEntity.ok(service.atualizar(id, produto));
    }

    @DeleteMapping(RotasProduto.DELETAR)
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
