package com.hardcore.entrega.entrega.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entrega")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_pedido", nullable = false)
    private Long idPedido;

    @Column(name = "id_entregador", nullable = false)
    private Long idEntregador;

    @Column(name = "endereco_destino", nullable = false)
    private String enderecoDestino;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_entrega", nullable = false)
    private EstadoEntregaEnum estadoEntrega;

    @Column(name = "confirmacao_cliente")
    private Boolean confirmacaoCliente;
}