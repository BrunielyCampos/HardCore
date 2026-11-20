package com.ifrn.hardcore.produto.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class ProdutoRequestDTO {

    @NotBlank
    private String nome;
    @NotBlank
    private String marca;

    @NotBlank
    private String categoria;

    @NotNull
    @Positive
    private Double preco;

    private Long idPrateleira;

    public ProdutoRequestDTO(String nome, String marca, String categoria, @NotNull @Positive Double preco, Long idPrateleira){
        this.nome = nome;
        this.marca = marca;
        this.categoria = categoria;
        this.preco = preco;
        this.idPrateleira = idPrateleira;
    }
}
