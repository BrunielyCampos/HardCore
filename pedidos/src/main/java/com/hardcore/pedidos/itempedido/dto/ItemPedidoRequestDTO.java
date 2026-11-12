package com.hardcore.pedidos.itempedido.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ItemPedidoRequestDTO {
    @NotNull(message = "O ID do pedido é obrigatório")
    private Long idPedido;

    @NotNull(message = "O ID do produto é obrigatório")
    private Long idProduto;

    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    private Integer quantidade;

    @NotNull(message = "O preço unitário é obrigatório")
    @Positive(message = "O preço unitário deve ser maior que zero")
    private Double precoUnitario;
}