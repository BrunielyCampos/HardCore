package com.ifrn.hardcore.produto.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_avaliacao_cliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer avaliacao;

    @Column(nullable = true)
    private String campoComentario;

    @Column(name = "autor_id")
    private Long autorId;

    @Column(name = "autor_tipo")
    private String autorTipo;

    @ManyToOne
    @JoinColumn(name = "id_produto")
    private Produto produto;
}