package com.ifrn.HardCore.ServicoProduto.DTO;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import jakarta.persistence.OneToOne;
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

    private Long idPrateleira;

    public ProdutoResponseDTO(Long id, String nome, String marca, String categoria, @NotNull Double preco,
                              Long idPrateleira) {
        this.id = id;
        this.nome = nome;
        this.marca = marca;
        this.categoria = categoria;
        this.preco = preco;
        this.idPrateleira = idPrateleira;
    }
}
