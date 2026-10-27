package com.ifrn.HardCore.ServicoProduto.DTO;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class PrateleiraRequestDTO {


    @NonNull
    private int quantidade_produto;

    private Long produto_id;

    public PrateleiraRequestDTO(@NonNull int quantidade_produto, Long produto_id) {
        this.quantidade_produto = quantidade_produto;
        this.produto_id = produto_id;
    }
}
