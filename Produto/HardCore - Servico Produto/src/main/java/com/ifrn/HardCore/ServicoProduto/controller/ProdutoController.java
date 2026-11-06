package com.ifrn.HardCore.ServicoProduto.controller;

import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoResponseDTO;
import com.ifrn.HardCore.ServicoProduto.rotasController.RotasProduto;
import com.ifrn.HardCore.ServicoProduto.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RotasProduto.PRODUTO_BASE)
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;

    @PostMapping(RotasProduto.CADASTRAR)
    public ResponseEntity<ProdutoResponseDTO> cadastroProduto(@Valid @RequestBody ProdutoRequestDTO dto){

        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrarProduto(dto));
    }

    @GetMapping(RotasProduto.LISTAR_POR_IDS)
    public ResponseEntity<List<ProdutoResponseDTO>> listarPorIds(@PathVariable List<Long> ids){
        return ResponseEntity.ok().body(service.ListarPorIds(ids));
    }

    @GetMapping(RotasProduto.LISTAR_TODOS)
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos(){
        return ResponseEntity.ok().body(service.listarTodos());
    }

    @GetMapping(RotasProduto.BUSCAR_POR_ID)
    public ResponseEntity<ProdutoResponseDTO> listarTodosPorId(@PathVariable Long id){
        return ResponseEntity.ok().body(service.buscarPorId(id));
    }

    @GetMapping(RotasProduto.BUSCAR_POR_CATEGORIA)
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok().body(service.BuscarPorCategoria(categoria));
    }

    @GetMapping(RotasProduto.BUSCAR_POR_MARCA)
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorMarca(@PathVariable String marca){
        return ResponseEntity.ok().body(service.BuscarPorMarca(marca));
    }

    @PutMapping(RotasProduto.ATUALIZAR)
    public ResponseEntity<ProdutoResponseDTO> atualizar(@PathVariable Long id,
                                                        @Valid @RequestBody ProdutoRequestDTO produto){
        ProdutoResponseDTO atualizado = service.atualizar(id, produto);

        return ResponseEntity.ok().body(atualizado);
    }

    @DeleteMapping(RotasProduto.DELETAR)
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        service.deletarPorId(id);

        return ResponseEntity.noContent().build();
    }

}
