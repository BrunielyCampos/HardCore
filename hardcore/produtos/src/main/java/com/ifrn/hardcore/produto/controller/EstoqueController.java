package com.ifrn.hardcore.produto.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ifrn.hardcore.produto.DTO.EstoqueRequestDTO;
import com.ifrn.hardcore.produto.DTO.EstoqueResponseDTO;
import com.ifrn.hardcore.produto.rotasController.RotasEstoque;
import com.ifrn.hardcore.produto.service.EstoqueService;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService service;

    @PostMapping(RotasEstoque.CADASTRAR)
    public ResponseEntity<EstoqueResponseDTO> criar(@Valid @RequestBody EstoqueRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrarEstoque(dto));
    }

    @GetMapping(RotasEstoque.LISTAR)
    public ResponseEntity<List<EstoqueResponseDTO>> listarEstoque() {
        return ResponseEntity.ok(service.listarEstoque());
    }

    // O identificador da URL é o ID do produto, não o ID interno do estoque.
    @GetMapping(RotasEstoque.LISTAR_POR_ID)
    public ResponseEntity<EstoqueResponseDTO> buscarPorProduto(@PathVariable("produto_id") Long produtoId) {
        return ResponseEntity.ok(service.buscarPorProdutoId(produtoId));
    }

    @PutMapping(RotasEstoque.ATUALIZAR_QUANTIDADE)
    public ResponseEntity<EstoqueResponseDTO> atualizarQuantidade(
            @RequestBody int quantidade, @PathVariable("produto_id") Long produtoId) {
        return ResponseEntity.ok(service.atualizarQtdProduto(quantidade, produtoId));
    }

    @PostMapping(RotasEstoque.RESERVAR)
    public ResponseEntity<Void> reservar(@PathVariable("produto_id") Long produtoId,
            @RequestParam int quantidade) {
        service.reservarEstoque(produtoId, quantidade);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(RotasEstoque.LIBERAR)
    public ResponseEntity<Void> liberar(@PathVariable("produto_id") Long produtoId,
            @RequestParam int quantidade) {
        service.liberarEstoque(produtoId, quantidade);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(RotasEstoque.MAIOR_QUANTIDADE)
    public ResponseEntity<List<EstoqueResponseDTO>> listarMaiorQtd(@RequestParam int qtd) {
        return ResponseEntity.ok(service.listarPorMaiorQtdDisponivel(qtd));
    }

    @GetMapping(RotasEstoque.MENOR_QUANTIDADE)
    public ResponseEntity<List<EstoqueResponseDTO>> listarMenorQtd(@RequestParam int qtd) {
        return ResponseEntity.ok(service.listarPorMenorQtdDisponivel(qtd));
    }
}
