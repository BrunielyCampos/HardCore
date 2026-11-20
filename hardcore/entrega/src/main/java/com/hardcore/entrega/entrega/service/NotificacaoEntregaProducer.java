package com.hardcore.entrega.entrega.service;

import com.hardcore.entrega.rabbitmq.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificacaoEntregaProducer {
    private final RabbitTemplate rabbitTemplate;

    public void enviarNotificacaoParaEntregador(Long idEntregador, String mensagem) {
        String payload = "Entregador ID: " + idEntregador + " - Mensagem: " + mensagem;
        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_NOTIFICACAO_ENTREGADOR, payload);
    }
}