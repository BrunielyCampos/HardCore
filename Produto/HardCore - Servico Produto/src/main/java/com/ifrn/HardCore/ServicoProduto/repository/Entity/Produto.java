package com.ifrn.HardCore.ServicoProduto.repository.Entity;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.AvaliacaoCliente;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity
@Table(name = "produto")
@Data
@NoArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    private String marca;

    private String categoria;

    @NotNull
    private Double preco;

    @OneToOne(mappedBy = "produto")
    private Estoque estoque;

    @ManyToOne
    @JoinColumn(name = "prateleira_id")
    private Prateleira prateleira;

    @OneToMany(mappedBy = "produto")
    private List<AvaliacaoCliente> avaliacoes;

    public Produto(Long id, String nome, String marca, String categoria, @NotNull Double preco, Estoque estoque,
                   Prateleira prateleira, List<AvaliacaoCliente> avaliacoes) {
        this.id = id;
        this.nome = nome;
        this.marca = marca;
        this.categoria = categoria;
        this.preco = preco;
        this.estoque = estoque;
        this.prateleira = prateleira;
        this.avaliacoes = avaliacoes;
    }
}