package com.ifrn.HardCore.ServicoProduto.DTO;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
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

    private Long idPrateleira;

    public ProdutoRequestDTO(String nome, String marca, String categoria, @NotNull Double preco, Long idPrateleira){
        this.nome = nome;
        this.marca = marca;
        this.categoria = categoria;
        this.preco = preco;
        this.idPrateleira = idPrateleira;
    }
}
