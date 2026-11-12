package com.hardcore.pedidos.pedido.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.service.PedidoService;
import com.hardcore.pedidos.pedido.dto.PedidoRequestDTO;
import com.hardcore.pedidos.pedido.model.EstadoCompraEnum;
import com.hardcore.pedidos.pedido.routes.RotasPedido;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping(RotasPedido.CRIAR)
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody @Valid PedidoRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.criarPedido(requestDTO));
    }

    @GetMapping(RotasPedido.BUSCAR_POR_ID)
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPedidoPorId(id));
    }

    @GetMapping(RotasPedido.LISTAR_POR_CLIENTE)
    public ResponseEntity<List<PedidoResponseDTO>> listarPorCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(pedidoService.listarPedidosPorCliente(idCliente));
    }

    @PatchMapping(RotasPedido.ATUALIZAR_STATUS)
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestParam EstadoCompraEnum status) {
        pedidoService.atualizarStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(RotasPedido.CANCELAR)
    public ResponseEntity<Void> cancelarPedido(@PathVariable Long id) {
        pedidoService.cancelarPedido(id);
        return ResponseEntity.noContent().build();
    }
}