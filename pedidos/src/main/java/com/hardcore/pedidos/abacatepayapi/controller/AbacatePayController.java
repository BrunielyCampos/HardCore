package com.hardcore.pedidos.abacatepayapi.controller;

import tools.jackson.databind.JsonNode;
import com.hardcore.pedidos.abacatepayapi.dto.CriarCheckoutDTO;
import com.hardcore.pedidos.abacatepayapi.dto.RegistrarWebhookDTO;
import com.hardcore.pedidos.abacatepayapi.routes.RotasAbacatePay;
import com.hardcore.pedidos.abacatepayapi.service.PagamentoService;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(RotasAbacatePay.PAGAMENTOS_BASE)
@RequiredArgsConstructor
public class AbacatePayController {

    private final PagamentoService pagamentoService;

    @PostMapping(RotasAbacatePay.CRIAR_CHECKOUT)
    public ResponseEntity<PedidoResponseDTO> criarCheckout(@RequestBody @Valid CriarCheckoutDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pagamentoService.criarCheckout(dto));
    }

    @GetMapping(RotasAbacatePay.CONSULTAR_CHECKOUT)
    public ResponseEntity<JsonNode> consultarCheckout(@PathVariable Long id) {
        return ResponseEntity.ok(pagamentoService.consultarCheckoutDoPedido(id));
    }

    @DeleteMapping(RotasAbacatePay.CANCELAR_CHECKOUT)
    public ResponseEntity<PedidoResponseDTO> cancelarCheckout(@PathVariable Long id) {
        return ResponseEntity.ok(pagamentoService.cancelarPagamento(id));
    }

    @PostMapping(RotasAbacatePay.ESTORNAR_CHECKOUT)
    public ResponseEntity<PedidoResponseDTO> estornarCheckout(@PathVariable Long id, @RequestParam String motivo) {
        return ResponseEntity.ok(pagamentoService.estornarPagamento(id, motivo));
    }

    @PostMapping(RotasAbacatePay.REGISTRAR_WEBHOOK)
    public ResponseEntity<JsonNode> registrarWebhook(@RequestBody(required = false) RegistrarWebhookDTO dto) {
        String endpoint = dto == null ? null : dto.endpoint();
        return ResponseEntity.ok(pagamentoService.registrarWebhook(endpoint));
    }
}