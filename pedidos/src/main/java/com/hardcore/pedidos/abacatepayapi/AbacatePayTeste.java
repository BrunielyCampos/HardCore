package com.hardcore.pedidos.abacatepayapi;

import tools.jackson.databind.JsonNode;
import com.hardcore.pedidos.abacatepayapi.service.AbacatePayService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AbacatePayTeste implements CommandLineRunner {

    private final AbacatePayService abacatePayService;

    public AbacatePayTeste(AbacatePayService abacatePayService) {
        this.abacatePayService = abacatePayService;
    }

    @Override
    public void run(String... args) {
        JsonNode resposta = abacatePayService.listarProdutos();
        System.out.println("Resposta da AbacatePay:");
        System.out.println(resposta.toPrettyString());
    }
}