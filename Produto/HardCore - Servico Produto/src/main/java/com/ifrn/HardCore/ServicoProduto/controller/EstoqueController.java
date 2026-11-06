package com.ifrn.HardCore.ServicoProduto.controller;

import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueResponseDTO;
import com.ifrn.HardCore.ServicoProduto.rotasController.RotasEstoque;
import com.ifrn.HardCore.ServicoProduto.service.EstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RotasEstoque.ESTOQUE_BASE)
@RequiredArgsConstructor
public class EstoqueController {
    public final EstoqueService service;

    @PostMapping(RotasEstoque.CADASTRAR)
    public ResponseEntity<EstoqueResponseDTO> criar(@Valid @RequestBody EstoqueRequestDTO dto){

        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrarEstoque(dto));
    }

    @GetMapping(RotasEstoque.LISTAR)
    public ResponseEntity<List<EstoqueResponseDTO>> listarEstoque(){
        return ResponseEntity.ok().body(service.listarEstoque());
    }

    @GetMapping(RotasEstoque.LISTAR_POR_ID)
    public ResponseEntity<EstoqueResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok().body(service.buscarPorId(id));
    }

    @PutMapping(RotasEstoque.ATUALIZAR_QUANTIDADE)
    public ResponseEntity<EstoqueResponseDTO> atualizarProduto(@Valid @RequestBody int qtd,
                                                               @PathVariable Long produto_id){
        EstoqueResponseDTO atualizado = service.atualizarQtdProduto(qtd, produto_id);

        return ResponseEntity.ok().body(atualizado);
    }

    @GetMapping(RotasEstoque.MAIOR_QUANTIDADE)
    public ResponseEntity<List<EstoqueResponseDTO>> listarMaiorQtd(int qtd){
        return ResponseEntity.ok().body(service.listarPorMaiorQtdDispinivel(qtd));
    }

    @GetMapping(RotasEstoque.MENOR_QUANTIDADE)
    public ResponseEntity<List<EstoqueResponseDTO>> listarMenorQtd(int qtd){
        return ResponseEntity.ok().body(service.listarPorMenorQtdDispinivel(qtd));
    }






}
