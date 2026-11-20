package com.ifrn.hardcore.produto.DTO;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Setter
@Getter
@NoArgsConstructor
public class PrateleiraRequestDTO {

    @Positive
    private int quantidade_produto;

    @NotNull
    private Long produtoId;

    public PrateleiraRequestDTO(@Positive int quantidade_produto, @NotNull Long produtoId) {
        this.quantidade_produto = quantidade_produto;
        this.produtoId = produtoId;
    }
}
