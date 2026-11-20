package com.ifrn.hardcore.produto.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ifrn.hardcore.produto.DTO.AvaliacaoClienteRequestDTO;
import com.ifrn.hardcore.produto.DTO.AvaliacaoClienteResponseDTO;
import com.ifrn.hardcore.produto.rotasController.RotasAvaliacaoCliente;
import com.ifrn.hardcore.produto.security.AutorAutenticado;
import com.ifrn.hardcore.produto.service.AvaliacaoClienteService;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping(RotasAvaliacaoCliente.AVALIACAO_BASE)
@RequiredArgsConstructor
public class AvaliacaoClienteController {

    private final AvaliacaoClienteService service;

    @PostMapping(RotasAvaliacaoCliente.CADASTRAR)
    public ResponseEntity<AvaliacaoClienteResponseDTO> criarAvaliacao(
            @Valid @RequestBody AvaliacaoClienteRequestDTO dto,
            Authentication authentication) {
            
        AutorAutenticado autor =
                (AutorAutenticado) authentication.getDetails();
            
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.criarAvaliacao(
                        dto,
                        autor.id(),
                        autor.tipo()
                ));
    }

    @GetMapping(RotasAvaliacaoCliente.BUSCAR_POR_ID)
    public ResponseEntity<AvaliacaoClienteResponseDTO> listarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.buscarAvaliacaoPorId(id));
    }

    @GetMapping(RotasAvaliacaoCliente.LISTAR_POR_IDS)
    public ResponseEntity<List<AvaliacaoClienteResponseDTO>> listarAvaliacoes(
            @RequestParam List<Long> ids) {

        return ResponseEntity.ok(service.listarAvaliacao(ids));
    }

    @GetMapping(RotasAvaliacaoCliente.BUSCAR_POR_PRODUTO)
    public ResponseEntity<List<AvaliacaoClienteResponseDTO>>
            listarAvaliacoesDoProduto(
                    @PathVariable("produtoId") Long produtoId) {

        return ResponseEntity.ok(
                service.buscarPorIdProduto(produtoId)
        );
    }

    @DeleteMapping(RotasAvaliacaoCliente.DELETAR)
    public ResponseEntity<Void> deletarAvaliacao(
            @PathVariable Long id) {

        service.deletePorId(id);
        return ResponseEntity.noContent().build();
    }
}