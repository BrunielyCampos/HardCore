package com.hardcore.pedidos.abacatepayapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ItemCheckoutDTO(@NotBlank String id, @NotNull @Positive Integer quantity) {
}