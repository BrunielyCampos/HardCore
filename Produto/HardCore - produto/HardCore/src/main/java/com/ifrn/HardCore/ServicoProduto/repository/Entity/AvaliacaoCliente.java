package com.ifrn.HardCore.ServicoProduto.repository.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Table(name = "AvaliacaoCliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private boolean avaliacao;

    private String campoComentario;

    @ManyToOne
    @JoinColumn(name = "id_produto")
    private Produto produto;
}
