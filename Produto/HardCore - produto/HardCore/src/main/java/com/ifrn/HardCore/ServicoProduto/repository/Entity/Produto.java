package com.ifrn.HardCore.ServicoProduto.repository.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity 
@Table(name = "produto")
@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank 
    private String nome;

    private String marca;

    private String categoria;

    @NonNull
    private Double preco;

    @OneToOne(mappedBy = "produto_id")
    private Estoque estoque;

    @ManyToOne
    @JoinColumn(name = "prateleira_id")
    private Prateleira prateleira;

    @OneToMany(mappedBy = "produto_id")
    private List<AvaliacaoCliente> avaliacoes;





}
