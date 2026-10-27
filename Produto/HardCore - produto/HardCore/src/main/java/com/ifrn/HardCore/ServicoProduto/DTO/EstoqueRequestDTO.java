package com.ifrn.HardCore.ServicoProduto.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class EstoqueRequestDTO {

    private int quantidadeProduto;

    public EstoqueRequestDTO(int quantidadeProduto) {
        this.quantidadeProduto = quantidadeProduto;
    }
}
