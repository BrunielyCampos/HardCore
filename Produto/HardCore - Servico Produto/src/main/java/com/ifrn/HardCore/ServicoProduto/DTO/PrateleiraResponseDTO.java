package com.ifrn.HardCore.ServicoProduto.DTO;

import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class PrateleiraResponseDTO {

    private Long id;

    private int quantidade_produto;


    private Long produtoId;

    public PrateleiraResponseDTO(Long id, int quantidade_produto, Long produtoId) {
        this.id = id;
        this.quantidade_produto = quantidade_produto;
        this.produtoId = produtoId;
    }
}
