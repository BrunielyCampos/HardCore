package com.hardcore.pedidos.abacatepayapi.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AbacatePayService {

    private final RestClient restClient;

    public JsonNode criarProduto(String externalId, String nome, Integer preco) {

        Map<String, Object> dados = Map.of(
                "externalId", externalId,
                "name", nome,
                "price", preco,
                "currency", "BRL"
        );

        return restClient.post()
                .uri("/products/create")
                .body(dados)
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode criarCheckout(List<Map<String, Object>> itens, String externalId) {

        Map<String, Object> dados = Map.of(
                "items", itens,
                "methods", List.of("PIX", "CARD"),
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

        Map<String, Object> dados = Map.of(
                "id", id
        );

        return restClient.post()
                .uri("/checkouts/delete")
                .body(dados)
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode estornarCheckout(String id, String motivo) {

        Map<String, Object> dados = Map.of(
                "id", id,
                "reason", motivo
        );

        return restClient.post()
                .uri("/checkouts/refund")
                .body(dados)
                .retrieve()
                .body(JsonNode.class);
    }
}