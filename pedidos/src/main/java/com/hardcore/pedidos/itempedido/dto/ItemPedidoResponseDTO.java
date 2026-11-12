package com.hardcore.pedidos.itempedido.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedidoResponseDTO {
    private Long id;
    private Long idPedido;
    private Long idProduto;
    private Integer quantidade;
    private Double precoUnitario;
}