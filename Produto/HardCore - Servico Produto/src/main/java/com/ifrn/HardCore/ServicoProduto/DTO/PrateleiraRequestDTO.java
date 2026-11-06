package com.ifrn.HardCore.ServicoProduto.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class PrateleiraRequestDTO {


    private int quantidade_produto;

    private Long produtoId;


    public PrateleiraRequestDTO(int quantidade_produto, Long produtoId) {
        this.quantidade_produto = quantidade_produto;
        this.produtoId = produtoId;
    }
}
