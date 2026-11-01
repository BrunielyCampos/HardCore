package com.hardcore.entrega.entrega.routes;

public interface RotasEntrega {
    String ENTREGA_BASE = "/entregas";
    String ATRIBUIR = ENTREGA_BASE;
    String BUSCAR_POR_PEDIDO = ENTREGA_BASE + "/pedido/{idPedido}";
    String BUSCAR_POR_ENTREGADOR = ENTREGA_BASE + "/entregador/{idEntregador}";
    String NOTIFICAR_EFETUADA = ENTREGA_BASE + "/{id}/notificar-efetuada";
    String CONFIRMAR_RECEBIMENTO = ENTREGA_BASE + "/{id}/confirmar-recebimento";
    String CANCELAR = ENTREGA_BASE + "/{id}/cancelar";
}