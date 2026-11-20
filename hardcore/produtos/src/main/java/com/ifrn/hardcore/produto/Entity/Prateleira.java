package com.ifrn.hardcore.produto.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(name = "tb_prateleira")
@Data
public class Prateleira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private int quantidade_produto;

    @OneToOne
    @JoinColumn(name = "produto_id", unique = true)
    private Produto produto;

    public Prateleira(Long id, @NotNull int quantidade_produto, Produto produto) {
        this.id = id;
        this.quantidade_produto = quantidade_produto;
        this.produto = produto;
    }
}