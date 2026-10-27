package com.ifrn.HardCore.ServicoProduto.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PrateleiraResponseDTO {

    private Long id;

    @NonNull
    private int quantidade_produto;

}
