package com.hardcore.pedidos.itemcarrinho.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ItemCarrinhoRequestDTO {
    @NotNull(message = "O ID do carrinho é obrigatório")
    private Long idCarrinho;

    @NotNull(message = "O ID do produto é obrigatório")
    private Long idProduto;

    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    private Integer quantidade;
}