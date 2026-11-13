package com.hardcore.pedidos.abacatepayapi.dto;

import java.util.List;

public record CriarCheckoutDTO(List<ItemCheckoutDTO> itens, String externalId) {
}