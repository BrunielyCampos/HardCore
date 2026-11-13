package com.hardcore.pedidos.abacatepayapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AbacatePayConfig {

    @Bean
    public RestClient abacatePayRestClient(
            @Value("${abacatepay.api.url}") String url,
            @Value("${abacatepay.api.key}") String chave) {

        return RestClient.builder()
                .baseUrl(url)
                .defaultHeader(
                    "Authorization",
                    "Bearer " + chave
                )
                .defaultHeader(
                    "Content-Type",
                    "application/json"
                )
                .build();
    }
}