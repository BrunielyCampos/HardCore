package com.ifrn.hardcore.produto.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_estoque")
@Data
@NoArgsConstructor
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private int quantidadeProduto;

    @OneToOne
    @JoinColumn(name = "produto_id", unique = true)
    private Produto produto;

    public Estoque(Long id, int quantidadeProduto, Produto produto) {
        this.id = id;
        this.quantidadeProduto = quantidadeProduto;
        this.produto = produto;
    }
}