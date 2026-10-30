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


    public PrateleiraRequestDTO( @NotNull int quantidade_produto) {
        this.quantidade_produto = quantidade_produto;
    }
}
