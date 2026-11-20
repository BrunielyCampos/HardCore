package com.hardcore.pedidos.webhook.controller;

import com.hardcore.pedidos.abacatepayapi.routes.RotasAbacatePay;
import com.hardcore.pedidos.webhook.security.WebhookRecebidoSecurity;
import com.hardcore.pedidos.webhook.service.WebhookRecebidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class WebhookRecebidoController {

    private final WebhookRecebidoSecurity security;
    private final WebhookRecebidoService webhookService;

    @PostMapping(value = RotasAbacatePay.RECEBER_WEBHOOK,consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> receberWebhook(
            @RequestBody byte[] corpo,
            @RequestParam(value = "webhookSecret", required = false) String secretQuery,
            @RequestHeader(value = "X-Webhook-Secret", required = false) String secretHeader,
            @RequestHeader(value = "X-Webhook-Signature", required = false) String assinatura) {

        String secretRecebido = secretQuery != null ? secretQuery : secretHeader;
        if (!security.validarSecret(secretRecebido)
                || !security.validarAssinatura(corpo, assinatura)) {
            return ResponseEntity.status(401).build();
        }

        try {
            webhookService.processarEvento(corpo);
            return ResponseEntity.ok().build();
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}