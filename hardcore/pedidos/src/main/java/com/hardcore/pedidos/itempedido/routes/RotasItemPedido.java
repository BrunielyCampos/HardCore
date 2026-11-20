package com.hardcore.pedidos.itempedido.routes;

public interface RotasItemPedido {
    String ITEM_PEDIDO_BASE = "/itens-pedido";
    String SALVAR = ITEM_PEDIDO_BASE + "/salvar";
    String LISTAR_POR_PEDIDO = ITEM_PEDIDO_BASE + "/pedido/{idPedido}";
    String BUSCAR_POR_ID = ITEM_PEDIDO_BASE + "/{id}";
    String DELETAR = ITEM_PEDIDO_BASE + "/{id}";
}