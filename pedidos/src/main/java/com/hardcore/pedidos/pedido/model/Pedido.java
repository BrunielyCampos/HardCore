package com.hardcore.pedidos.pedido.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_pedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_cliente", nullable = false)
    private Long idCliente;

    @Column(name = "valor_compra", nullable = false)
    private Double valorCompra;

    @Column(name = "data_compra", nullable = false)
    private LocalDateTime dataCompra;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCompraEnum estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pagamento", nullable = false)
    private TipoPagamentoEnum tipoPagamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pagamento", nullable = false)
    private EstadoPagamentoEnum estadoPagamento = EstadoPagamentoEnum.PENDENTE;

    @Column(name = "abacatepay_checkout_id")
    private String abacatePayCheckoutId;

    @Column(name = "url_pagamento")
    private String urlPagamento;
}