package com.hardcore.pedidos.carrinho.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hardcore.pedidos.carrinho.dto.CarrinhoRequestDTO;
import com.hardcore.pedidos.carrinho.dto.CarrinhoResponseDTO;
import com.hardcore.pedidos.carrinho.service.CarrinhoService;
import com.hardcore.pedidos.carrinho.routes.RotasCarrinho;

@RestController
@RequiredArgsConstructor
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    @PostMapping(RotasCarrinho.CRIAR)
    public ResponseEntity<CarrinhoResponseDTO> criarCarrinho(@RequestBody @Valid CarrinhoRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carrinhoService.criarCarrinho(requestDTO));
    }

    @GetMapping(RotasCarrinho.BUSCAR_POR_CLIENTE)
    public ResponseEntity<CarrinhoResponseDTO> buscarPorCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(carrinhoService.buscarCarrinhoPorCliente(idCliente));
    }
}