package com.hardcore.pedidos.carrinho.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CarrinhoRequestDTO {
    @NotNull(message = "O ID do cliente é obrigatório")
    private Long idCliente;
}