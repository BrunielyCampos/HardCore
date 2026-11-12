package com.hardcore.pedidos.itemcarrinho.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCarrinhoResponseDTO {
    private Long id;
    private Long idCarrinho;
    private Long idProduto;
    private Integer quantidade;
}