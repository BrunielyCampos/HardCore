package com.ifrn.HardCore.ServicoProduto.DTO;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class EstoqueRequestDTO {

    private int quantidadeProduto;

    private Long produto_id;

    public EstoqueRequestDTO(int quantidadeProduto, Long produto_id) {
        this.quantidadeProduto = quantidadeProduto;
        this.produto_id = produto_id;
    }
}
