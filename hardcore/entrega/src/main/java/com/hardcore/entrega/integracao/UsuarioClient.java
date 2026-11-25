package com.hardcore.entrega.integracao;

import tools.jackson.databind.JsonNode;
import com.hardcore.entrega.security.ServiceTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class UsuarioClient {

    private final RestClient client;
    private final ServiceTokenService tokenService;

    public UsuarioClient(@Value("${integracao.usuarios.url}") String url, ServiceTokenService tokenService) {
        this.client = RestClient.builder().baseUrl(url).build();
        this.tokenService = tokenService;
    }

    public JsonNode buscarPorId(Long id) {
        try {
            return client.get()
                    .uri("/usuarios/{id}", id)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenService.gerarTokenInterno())
                    .retrieve()
                    .body(JsonNode.class);
        } catch (Exception e) {
            System.err.println("ERRO AO BUSCAR USUARIO " + id + ": " + e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não foi possível validar o usuário " + id + " no serviço Usuários.",
                    e
            );
        }
    }

    public void validarEntregador(Long id) {
        try {
            Boolean valido = client.get()
                    .uri("/usuarios/{id}/validar-entregador", id)
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer " + tokenService.gerarTokenInterno()
                    )
                    .retrieve()
                    .body(Boolean.class);

            if (!Boolean.TRUE.equals(valido)) {
                System.err.println("VALIDACAO ENTREGADOR " + id + " RETORNOU: " + valido);
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "O usuário informado não possui perfil de ENTREGADOR."
                );
            }

        } catch (RestClientException e) {
            System.err.println("ERRO AO VALIDAR ENTREGADOR " + id + ": " + e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não foi possível validar o entregador " + id + " no serviço Usuários.",
                    e
            );
        }
    }
}