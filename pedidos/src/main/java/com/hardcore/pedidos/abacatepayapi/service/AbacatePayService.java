package com.hardcore.pedidos.abacatepayapi.service;

import tools.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AbacatePayService {

    private final RestClient restClient;

    public JsonNode listarProdutos() {
        return restClient.get()
            .uri("/products/list")
            .retrieve()
            .body(JsonNode.class);
    }

    public JsonNode criarProduto(String externalId, String nome, Integer precoCentavos) {
        Map<String, Object> dados = Map.of(
                "externalId", externalId,
                "name", nome,
                "price", precoCentavos,
                "currency", "BRL"
        );

        return restClient.post()
                .uri("/products/create")
                .body(dados)
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode criarCheckout(
            List<Map<String, Object>> itens,
            String externalId,
            List<String> methods
    ) {
        Map<String, Object> dados = Map.of(
                "items", itens,
                "methods", methods,
                "externalId", externalId
        );

        return restClient.post()
                .uri("/checkouts/create")
                .body(dados)
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode consultarCheckout(String id) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/checkouts/get")
                        .queryParam("id", id)
                        .build())
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode cancelarCheckout(String id) {
        return restClient.post()
                .uri("/checkouts/delete")
                .body(Map.of("id", id))
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode estornarCheckout(String id, String motivo) {
        return restClient.post()
                .uri("/checkouts/refund")
                .body(Map.of("id", id, "reason", motivo))
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode registrarWebhook(String endpoint, String secret) {
        Map<String, Object> dados = Map.of(
                "name", "HARDCORE - Pedidos",
                "endpoint", endpoint,
                "secret", secret,
                "events", List.of(
                        "checkout.completed",
                        "checkout.refunded",
                        "checkout.disputed",
                        "checkout.lost"
                )
        );

        return restClient.post()
                .uri("/webhooks/create")
                .body(dados)
                .retrieve()
                .body(JsonNode.class);
    }
}
