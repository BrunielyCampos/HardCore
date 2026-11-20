package com.hardcore.pedidos.abacatepayapi.dto;

import jakarta.validation.constraints.NotBlank;

public record RegistrarWebhookDTO(@NotBlank String endpoint) {
}