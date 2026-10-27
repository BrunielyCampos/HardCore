package com.ifrn.HardCore.ServicoProduto.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class EstoqueResponseDTO {

    private Long id;

    @NonNull
    private int quantidadeProduto;

    public EstoqueResponseDTO(Long id, @NonNull int quantidadeProduto) {
        this.id = id;
        this.quantidadeProduto = quantidadeProduto;
    }
}
