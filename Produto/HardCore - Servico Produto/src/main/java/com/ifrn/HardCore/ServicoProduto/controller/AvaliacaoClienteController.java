package com.ifrn.HardCore.ServicoProduto.controller;

import com.ifrn.HardCore.ServicoProduto.DTO.AvaliacaoClienteRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.AvaliacaoClienteResponseDTO;
import com.ifrn.HardCore.ServicoProduto.rotasController.AvaliacaoCliente;
import com.ifrn.HardCore.ServicoProduto.service.AvaliaçãoClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AvaliacaoCliente.AVALIACAO_BASE)
public class AvaliacaoClienteController {

    private AvaliaçãoClienteService service;

    @PostMapping(AvaliacaoCliente.CADASTRAR)
    public ResponseEntity<AvaliacaoClienteResponseDTO> criarAvaliacao(@Valid @RequestBody AvaliacaoClienteRequestDTO dto){

        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarAvaliacao(dto));
    }

    @GetMapping(AvaliacaoCliente.BUSCAR_POR_ID)
    public ResponseEntity<AvaliacaoClienteResponseDTO> listarPorId(@PathVariable Long id){
        return ResponseEntity.ok().body(service.buscarAvaliacaoPorId(id));
    }

    @GetMapping(AvaliacaoCliente.LISTAR_POR_IDS)
    public ResponseEntity<List<AvaliacaoClienteResponseDTO>> listarValiacoes(@PathVariable List<Long> ids){

        return ResponseEntity.ok().body(service.listarAvaliacao(ids));
    }

    @GetMapping(AvaliacaoCliente.BUSCAR_POR_PRODUTO)
    public  ResponseEntity< List<AvaliacaoClienteResponseDTO>> listaAvaliacaoProduto(@PathVariable Long id){
        return ResponseEntity.ok().body(service.buscarPorIdProduto(id));
    }

    @DeleteMapping(AvaliacaoCliente.DELETAR)
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Long id){
        service.deletePorId(id);

        return ResponseEntity.noContent().build();
    }
}
