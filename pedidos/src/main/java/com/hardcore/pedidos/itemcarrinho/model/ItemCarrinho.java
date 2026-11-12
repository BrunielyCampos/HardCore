package com.hardcore.pedidos.itemcarrinho.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_item_carrinho")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCarrinho {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_carrinho", nullable = false)
    private Long idCarrinho;

    @Column(name = "id_produto", nullable = false)
    private Long idProduto;

    @Column(nullable = false)
    private Integer quantidade;
}