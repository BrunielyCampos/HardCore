package com.ifrn.HardCore.ServicoProduto.DTO;

import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class PrateleiraResponseDTO {

    private Long id;

    @NonNull
    private int quantidade_produto;


    private List<Long> produtoIds;

    public PrateleiraResponseDTO(Long id, @NonNull int quantidade_produto, List<Long> produtoIds) {
        this.id = id;
        this.quantidade_produto = quantidade_produto;
        this.produtoIds = produtoIds;
    }
}
