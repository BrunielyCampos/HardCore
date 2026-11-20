package com.ifrn.hardcore.produto.DTO;

import lombok.*;

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
