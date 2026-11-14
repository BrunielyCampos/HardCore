package com.hardcore.pedidos.abacatepayapi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CriarCheckoutDTO(@NotNull Long pedidoId,@NotEmpty List<@Valid ItemCheckoutDTO> itens) {
}