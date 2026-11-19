package com.hardcore.pedidos.itemcarrinho.model;

import com.hardcore.pedidos.carrinho.model.Carrinho;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_carrinho",
        insertable = false,
        updatable = false
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Carrinho carrinho;

    @Column(name = "id_produto", nullable = false)
    private Long idProduto;

    @Column(nullable = false)
    private Integer quantidade;
}