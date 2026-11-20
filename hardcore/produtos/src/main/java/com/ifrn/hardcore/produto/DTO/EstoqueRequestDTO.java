package com.ifrn.hardcore.produto.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class EstoqueRequestDTO {

    @NotNull
    @PositiveOrZero
    private Integer quantidadeProduto;

    @NotNull
    private Long produto_id;

    public EstoqueRequestDTO(@NotNull @PositiveOrZero Integer quantidadeProduto, @NotNull Long produto_id) {
        this.quantidadeProduto = quantidadeProduto;
        this.produto_id = produto_id;
    }
}
