package com.ifrn.HardCore.ServicoProduto.controller;

import com.ifrn.HardCore.ServicoProduto.DTO.AvaliacaoClienteRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.AvaliacaoClienteResponseDTO;
import com.ifrn.HardCore.ServicoProduto.rotasController.RotasAvaliacaoCliente;
import com.ifrn.HardCore.ServicoProduto.service.AvaliaçãoClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RotasAvaliacaoCliente.AVALIACAO_BASE)
@RequiredArgsConstructor
public class AvaliacaoClienteController {

    private final AvaliaçãoClienteService service;

    @PostMapping(RotasAvaliacaoCliente.CADASTRAR)
    public ResponseEntity<AvaliacaoClienteResponseDTO> criarAvaliacao(@Valid @RequestBody AvaliacaoClienteRequestDTO dto){

        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarAvaliacao(dto));
    }

    @GetMapping(RotasAvaliacaoCliente.BUSCAR_POR_ID)
    public ResponseEntity<AvaliacaoClienteResponseDTO> listarPorId(@PathVariable Long id){
        return ResponseEntity.ok().body(service.buscarAvaliacaoPorId(id));
    }

    @GetMapping(RotasAvaliacaoCliente.LISTAR_POR_IDS)
    public ResponseEntity<List<AvaliacaoClienteResponseDTO>> listarValiacoes(@PathVariable List<Long> ids){

        return ResponseEntity.ok().body(service.listarAvaliacao(ids));
    }

    @GetMapping(RotasAvaliacaoCliente.BUSCAR_POR_PRODUTO)
    public  ResponseEntity< List<AvaliacaoClienteResponseDTO>> listaAvaliacaoProduto(@PathVariable Long id){
        return ResponseEntity.ok().body(service.buscarPorIdProduto(id));
    }

    @DeleteMapping(RotasAvaliacaoCliente.DELETAR)
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Long id){
        service.deletePorId(id);

        return ResponseEntity.noContent().build();
    }
}
