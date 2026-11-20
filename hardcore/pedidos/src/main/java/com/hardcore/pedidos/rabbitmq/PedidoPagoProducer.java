package com.hardcore.pedidos.rabbitmq;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PedidoPagoProducer {
    private final RabbitTemplate rabbitTemplate;

    public void publicar(PedidoPagoEvent evento) {
        String payload = "{\"idPedido\":" + evento.idPedido()
                + ",\"idCliente\":" + evento.idCliente()
                + ",\"idEntregador\":" + evento.idEntregador() + "}";
        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_PEDIDO_PAGO, payload);
    }
}
