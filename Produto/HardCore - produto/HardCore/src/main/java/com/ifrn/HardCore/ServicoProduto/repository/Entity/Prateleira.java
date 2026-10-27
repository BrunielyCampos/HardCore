package com.ifrn.HardCore.ServicoProduto.repository.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity
@NoArgsConstructor
@Table(name = "Prateleira")
@Data
public class Prateleira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private int quantidade_produto;

    @OneToMany(mappedBy = "prateleira")
    private List<Produto> produtos;

    public Prateleira(Long id, @NonNull int quantidade_produto) {
        this.id = id;
        this.quantidade_produto = quantidade_produto;
    }
}
