package com.hardcore.pedidos.carrinho.model;

import java.util.List;

import com.hardcore.pedidos.itemcarrinho.model.ItemCarrinho;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "tb_carrinho")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Carrinho {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "id_cliente", nullable = false, unique = true)
    private Long idCliente;

    @OneToMany(mappedBy = "carrinho", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<ItemCarrinho> itens;
}