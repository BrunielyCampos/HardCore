package com.ifrn.HardCore.ServicoProduto.repository.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Table(name = "TB_prateleira")
@Data
public class Prateleira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private int quantidade_produto;

    @OneToOne(mappedBy = "prateleira")
    private Produto produto;

    public Prateleira(Long id, @NotNull int quantidade_produto, Produto produto) {
        this.id = id;
        this.quantidade_produto = quantidade_produto;
        this.produto = produto;
    }
}
