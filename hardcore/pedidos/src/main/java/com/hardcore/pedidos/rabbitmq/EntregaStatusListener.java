package com.hardcore.pedidos.rabbitmq;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hardcore.pedidos.pedido.model.EstadoCompraEnum;
import com.hardcore.pedidos.pedido.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EntregaStatusListener {
    private final ObjectMapper objectMapper;
    private final PedidoService pedidoService;

    @RabbitListener(queues = RabbitMQConfig.FILA_ENTREGA_ATUALIZADA)
    public void receberAtualizacaoEntrega(String mensagem) throws Exception {
        var evento = objectMapper.readTree(mensagem);
        long idPedido = evento.path("idPedido").asLong();
        String status = evento.path("status").asText(null);
        if (idPedido <= 0 || status == null) {
            throw new IllegalArgumentException("Evento entrega.atualizada incompleto.");
        }
        boolean recebida = evento.path("confirmacaoCliente").asBoolean(false);
        EstadoCompraEnum estadoPedido = switch (status) {
            case "EM_ENTREGA" -> EstadoCompraEnum.A_CAMINHO;
            case "ENTREGA_FEITA" -> recebida ? EstadoCompraEnum.ENTREGUE : EstadoCompraEnum.A_CAMINHO;
            case "CANCELADA" -> EstadoCompraEnum.COMPRA_CANCELADA;
            default -> null;
        };
        if (estadoPedido != null) {
            pedidoService.atualizarStatus(idPedido, estadoPedido);
        }
    }
}
