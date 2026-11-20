package com.hardcore.pedidos.carrinho.routes;

public interface RotasCarrinho {
    String CARRINHO_BASE = "/carrinho";
    String CRIAR = CARRINHO_BASE + "/criar";
    String BUSCAR_POR_CLIENTE = CARRINHO_BASE + "/cliente/{idCliente}";
}