package com.hardcore.pedidos.carrinho.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarrinhoResponseDTO {
    private Long id;
    private Long idCliente;
}