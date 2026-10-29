package com.ifrn.HardCore.ServicoProduto.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class EstoqueResponseDTO {

    private Long id;

    @NotNull
    private int quantidadeProduto;


    private Long produto_id;

    public EstoqueResponseDTO(Long id, @NotNull int quantidadeProduto, Long produto_id) {
        this.id = id;
        this.quantidadeProduto = quantidadeProduto;
        this.produto_id = produto_id;
    }
}
