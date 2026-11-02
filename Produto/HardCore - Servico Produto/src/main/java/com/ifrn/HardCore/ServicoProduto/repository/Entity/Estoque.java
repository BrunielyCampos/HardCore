package com.ifrn.HardCore.ServicoProduto.repository.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity
@Table(name = "TB_estoque")
@Data
@NoArgsConstructor
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private int quantidadeProduto;

    @OneToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    public Estoque(Long id, int quantidadeProduto, Produto produto) {
        this.id = id;
        this.quantidadeProduto = quantidadeProduto;
        this.produto = produto;
    }
}
