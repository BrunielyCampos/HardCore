package com.hardcore.entrega.rabbitmq;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String FILA_NOTIFICACAO_ENTREGADOR = "entrega.notificacao.entregador";

    @Bean
    public Queue filaNotificacaoEntregador() {
        return new Queue(FILA_NOTIFICACAO_ENTREGADOR, true);
    }
}