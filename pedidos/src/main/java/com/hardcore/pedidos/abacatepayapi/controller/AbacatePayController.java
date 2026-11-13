package com.hardcore.pedidos.abacatepayapi.controller;

import com.hardcore.pedidos.abacatepayapi.dto.CriarCheckoutDTO;
import com.hardcore.pedidos.abacatepayapi.routes.RotasAbacatePay;
import com.hardcore.pedidos.abacatepayapi.service.AbacatePayService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(RotasAbacatePay.PAGAMENTOS_BASE)
@RequiredArgsConstructor
public class AbacatePayController {

    private final AbacatePayService abacatePayService;

    @PostMapping(RotasAbacatePay.CRIAR_CHECKOUT)
    public JsonNode criarCheckout(@RequestBody CriarCheckoutDTO dto) {
        List<Map<String, Object>> itens = dto.itens()
                .stream()
                .map(item -> Map.<String, Object>of(
                        "id", item.id(),
                        "quantity", item.quantity()
                ))
                .toList();

        return abacatePayService.criarCheckout(
                itens,
                dto.externalId()
        );
    }

    @GetMapping(RotasAbacatePay.CONSULTAR_CHECKOUT)
    public JsonNode consultarCheckout(@PathVariable String id) {
        return abacatePayService.consultarCheckout(id);
    }

    @DeleteMapping(RotasAbacatePay.CANCELAR_CHECKOUT)
    public JsonNode cancelarCheckout(@PathVariable String id) {
        return abacatePayService.cancelarCheckout(id);
    }

    @PostMapping(RotasAbacatePay.ESTORNAR_CHECKOUT)
    public JsonNode estornarCheckout(@PathVariable String id, @RequestParam String motivo) {
        return abacatePayService.estornarCheckout(id, motivo);
    }
}