package com.ifrn.HardCore.ServicoProduto.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class PrateleiraRequestDTO {


    @NotNull
    private int quantidade_produto;

    private List<Long> produtoIds;

    public PrateleiraRequestDTO( @NotNull int quantidade_produto, List<Long> produtoIds) {
        this.quantidade_produto = quantidade_produto;
        this.produtoIds = produtoIds;
    }
}
