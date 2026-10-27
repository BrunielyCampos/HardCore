package com.ifrn.HardCore.ServicoProduto.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PrateleiraRequestDTO {


    @NonNull
    private int quantidade_produto;

    public PrateleiraRequestDTO(@NonNull int quantidade_produto) {
        this.quantidade_produto = quantidade_produto;
    }
}
