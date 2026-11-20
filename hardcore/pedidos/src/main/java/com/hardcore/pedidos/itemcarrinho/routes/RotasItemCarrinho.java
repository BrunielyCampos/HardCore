package com.hardcore.pedidos.itemcarrinho.routes;

public interface RotasItemCarrinho {
    String ITEM_CARRINHO_BASE = "/itens-carrinho";
    String ADICIONAR = ITEM_CARRINHO_BASE + "/adicionar";
    String LISTAR_POR_CARRINHO = ITEM_CARRINHO_BASE + "/carrinho/{idCarrinho}";
    String DELETAR = ITEM_CARRINHO_BASE + "/{id}";
}