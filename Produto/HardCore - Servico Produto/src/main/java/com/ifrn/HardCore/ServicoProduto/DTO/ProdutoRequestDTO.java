package com.ifrn.HardCore.ServicoProduto.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class ProdutoRequestDTO {

    @NotBlank
    private String nome;

    private String marca;

    private String categoria;

    @NotNull
    private Double preco;

    public ProdutoRequestDTO(String nome, String marca, String categoria, @NotNull Double preco){
        this.nome = nome;
        this.marca = marca;
        this.categoria = categoria;
        this.preco = preco;
    }
}
