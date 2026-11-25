package com.ifrn.hardcore.produto.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class ProdutoResponseDTO {

    private Long id;

    @NotBlank
    private String nome;

    private String marca;
    private String categoria;

    @NotNull
    private Double preco;

    private String imagemPrincipal;

    private Long idPrateleira;

    private Double mediaAvaliacoes;
    private Integer totalAvaliacoes;

    public ProdutoResponseDTO(Long id, String nome, String marca, String categoria, @NotNull Double preco,
                              String imagemPrincipal, Long idPrateleira, Double mediaAvaliacoes,
                              Integer totalAvaliacoes) {
        this.id = id;
        this.nome = nome;
        this.marca = marca;
        this.categoria = categoria;
        this.preco = preco;
        this.imagemPrincipal = imagemPrincipal;
        this.idPrateleira = idPrateleira;
        this.mediaAvaliacoes = mediaAvaliacoes;
        this.totalAvaliacoes = totalAvaliacoes;
    }
}