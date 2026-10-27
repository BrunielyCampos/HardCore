package com.ifrn.HardCore.ServicoProduto.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ProdutoRequestDTO {

    @NotBlank
    private String nome;

    private String marca;

    private String categoria;

    @NonNull
    private Double preco;

}
