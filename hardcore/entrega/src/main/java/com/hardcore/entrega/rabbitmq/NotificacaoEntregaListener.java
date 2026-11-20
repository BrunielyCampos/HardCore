package com.hardcore.entrega.rabbitmq;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificacaoEntregaListener {

    @RabbitListener(queues = RabbitMQConfig.FILA_NOTIFICACAO_ENTREGADOR)
    public void receberNotificacao(String mensagem) {
        log.info("NOTIFICAÇÃO RECEBIDA PELO ENTREGADOR: {}", mensagem);
    }
}