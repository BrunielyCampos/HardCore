package com.hardcore.pedidos.webhook.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hardcore.pedidos.pedido.model.EstadoPagamentoEnum;
import com.hardcore.pedidos.pedido.model.Pedido;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.hardcore.pedidos.integracao.ProdutoClient;
import com.hardcore.pedidos.itempedido.model.ItemPedido;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import com.hardcore.pedidos.rabbitmq.PedidoPagoEvent;
import com.hardcore.pedidos.rabbitmq.PedidoPagoProducer;
import com.hardcore.pedidos.webhook.model.WebhookRecebido;
import com.hardcore.pedidos.webhook.repository.WebhookRecebidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class WebhookRecebidoService {

    private final ObjectMapper objectMapper;
    private final PedidoRepository pedidoRepository;
    private final WebhookRecebidoRepository webhookRepository;
    private final PedidoPagoProducer pedidoPagoProducer;
    private final ProdutoClient produtoClient;
    private final ItemPedidoRepository itemPedidoRepository;

    @Transactional
    public void processarEvento(byte[] corpo) throws IOException {
        JsonNode evento = objectMapper.readTree(corpo);
        String idEvento = evento.path("id").asText(null);
        String tipoEvento = evento.path("event").asText(null);

        if (idEvento == null || tipoEvento == null) {
            throw new IllegalArgumentException("Evento inválido: id ou event ausente.");
        }
        if (webhookRepository.existsById(idEvento)) {
            return;
        }

        EstadoPagamentoEnum novoEstado = switch (tipoEvento) {
            case "checkout.completed" -> EstadoPagamentoEnum.PAGO;
            case "checkout.refunded" -> EstadoPagamentoEnum.ESTORNADO;
            case "checkout.disputed" -> EstadoPagamentoEnum.EM_DISPUTA;
            case "checkout.lost" -> EstadoPagamentoEnum.FALHOU;
            default -> null;
        };
        if (novoEstado == null) {
            return;
        }

        JsonNode checkout = evento.path("data").path("checkout");
        String checkoutId = checkout.path("id").asText(null);
        String externalId = checkout.path("externalId").asText(null);

        Pedido pedido = null;
        if (checkoutId != null) {
            pedido = pedidoRepository.findByAbacatePayCheckoutId(checkoutId).orElse(null);
        }
        if (pedido == null && externalId != null && externalId.startsWith("pedido-")) {
            try {
                Long pedidoId = Long.parseLong(externalId.substring("pedido-".length()));
                pedido = pedidoRepository.findById(pedidoId).orElse(null);
            } catch (NumberFormatException ignored) {
            }
        }
        if (pedido == null) {
            throw new IllegalStateException("Não foi possível localizar o pedido do evento " + idEvento);
        }

        if (pedido.getEstadoPagamento() != EstadoPagamentoEnum.ESTORNADO
                && pedido.getEstadoPagamento() != EstadoPagamentoEnum.CANCELADO) {
            pedido.setEstadoPagamento(novoEstado);
            if (novoEstado == EstadoPagamentoEnum.ESTORNADO || novoEstado == EstadoPagamentoEnum.FALHOU
                    || novoEstado == EstadoPagamentoEnum.CANCELADO) {
                liberarEstoque(pedido);
            }
            pedidoRepository.save(pedido);
            if (novoEstado == EstadoPagamentoEnum.PAGO && pedido.getIdEntregador() != null) {
                pedidoPagoProducer.publicar(new PedidoPagoEvent(pedido.getId(), pedido.getIdCliente(), pedido.getIdEntregador()));
            }
        }

        webhookRepository.saveAndFlush(new WebhookRecebido(idEvento, tipoEvento));
    }

    private void liberarEstoque(Pedido pedido) {
        if (!Boolean.TRUE.equals(pedido.getEstoqueBaixado())) {
            return;
        }
        for (ItemPedido item : itemPedidoRepository.findByIdPedido(pedido.getId())) {
            produtoClient.liberarEstoque(item.getIdProduto(), item.getQuantidade());
        }
        pedido.setEstoqueBaixado(false);
    }
}