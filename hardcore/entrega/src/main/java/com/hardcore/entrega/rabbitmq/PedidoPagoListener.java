package com.hardcore.entrega.rabbitmq;

import tools.jackson.databind.ObjectMapper;
import com.hardcore.entrega.entrega.dto.EntregaRequestDTO;
import com.hardcore.entrega.entrega.service.EntregaService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PedidoPagoListener {
    private final ObjectMapper objectMapper;
    private final EntregaService entregaService;

    @RabbitListener(queues = RabbitMQConfig.FILA_PEDIDO_PAGO)
    public void receberPedidoPago(String mensagem) throws Exception {
        var evento = objectMapper.readTree(mensagem);
        Long idPedido = evento.path("idPedido").asLong();
        Long idCliente = evento.path("idCliente").asLong();
        Long idEntregador = evento.path("idEntregador").asLong();
        if (idPedido == 0 || idCliente == 0 || idEntregador == 0) {
            throw new IllegalArgumentException("Evento pedido.pago incompleto.");
        }
        EntregaRequestDTO dto = new EntregaRequestDTO();
        dto.setIdPedido(idPedido);
        dto.setIdEntregador(idEntregador);
        entregaService.criarEntregaDoPedido(dto, idCliente);
    }
}
