package com.hardcore.pedidos.rabbitmq;

public record PedidoPagoEvent(Long idPedido, Long idCliente, Long idEntregador) {
}
