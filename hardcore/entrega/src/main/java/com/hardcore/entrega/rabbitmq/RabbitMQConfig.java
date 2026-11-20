package com.hardcore.entrega.rabbitmq;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String FILA_NOTIFICACAO_ENTREGADOR = "entrega.notificacao.entregador";
    public static final String FILA_PEDIDO_PAGO = "pedido.pago";
    public static final String FILA_ENTREGA_ATUALIZADA = "entrega.atualizada";

    @Bean
    public Queue filaNotificacaoEntregador() {
        return new Queue(FILA_NOTIFICACAO_ENTREGADOR, true);
    }

    @Bean
    public Queue filaPedidoPago() {
        return new Queue(FILA_PEDIDO_PAGO, true);
    }

    @Bean
    public Queue filaEntregaAtualizada() {
        return new Queue(FILA_ENTREGA_ATUALIZADA, true);
    }
}