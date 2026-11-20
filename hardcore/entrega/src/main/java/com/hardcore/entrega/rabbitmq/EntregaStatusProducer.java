package com.hardcore.entrega.rabbitmq;

import com.hardcore.entrega.entrega.model.Entrega;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EntregaStatusProducer {
    private final RabbitTemplate rabbitTemplate;

    public void publicar(Entrega entrega) {
        String payload = "{\"idPedido\":" + entrega.getIdPedido()
                + ",\"status\":\"" + entrega.getEstadoEntrega().name() + "\""
                + ",\"confirmacaoCliente\":" + entrega.getConfirmacaoCliente() + "}";
        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_ENTREGA_ATUALIZADA, payload);
    }
}
