package com.hardcore.pedidos.integracao;

import com.hardcore.pedidos.security.ServiceTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class UsuarioClient {

    private final RestClient client;
    private final ServiceTokenService tokenService;

    public UsuarioClient(
            @Value("${integracao.usuarios.url}") String url,
            ServiceTokenService tokenService) {

        this.client = RestClient.builder()
                .baseUrl(url)
                .build();

        this.tokenService = tokenService;
    }

    public boolean validarEntregador(Long id) {
        return client.get()
                .uri("/usuarios/{id}/validar-entregador", id)
                .header(
                    HttpHeaders.AUTHORIZATION,
                    "Bearer " + tokenService.gerarTokenInterno()
                )
                .retrieve()
                .body(Boolean.class);
    }
}