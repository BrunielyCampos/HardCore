package com.hardcore.pedidos.pedido.routes;

public interface RotasPedido {
    String PEDIDO_BASE = "/pedidos";
    String CRIAR = PEDIDO_BASE + "/criar";
    String BUSCAR_POR_ID = PEDIDO_BASE + "/{id}";
    String LISTAR_POR_CLIENTE = PEDIDO_BASE + "/cliente/{idCliente}";
    String ATUALIZAR_STATUS = PEDIDO_BASE + "/{id}/status";
    String CANCELAR = PEDIDO_BASE + "/{id}/cancelar";
}