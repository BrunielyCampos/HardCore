package com.hardcore.pedidos.integracao;

import tools.jackson.databind.JsonNode;
import com.hardcore.pedidos.security.ServiceTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ProdutoClient {
    private final RestClient client;
    private final ServiceTokenService tokenService;

    public ProdutoClient(@Value("${integracao.produtos.url}") String url, ServiceTokenService tokenService) {
        this.client = RestClient.builder().baseUrl(url).build();
        this.tokenService = tokenService;
    }

    public void reservarEstoque(Long produtoId, int quantidade) {
        client.post().uri(uriBuilder -> uriBuilder.path("/estoque/{id}/reservar")
                .queryParam("quantidade", quantidade).build(produtoId))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenService.gerarTokenInterno())
                .retrieve().toBodilessEntity();
    }

    public void liberarEstoque(Long produtoId, int quantidade) {
        client.post().uri(uriBuilder -> uriBuilder.path("/estoque/{id}/liberar")
                .queryParam("quantidade", quantidade).build(produtoId))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenService.gerarTokenInterno())
                .retrieve().toBodilessEntity();
    }

    public JsonNode buscarPorId(Long id) {
        return client.get().uri("/produtos/{id}", id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenService.gerarTokenInterno())
                .retrieve().body(JsonNode.class);
    }
}