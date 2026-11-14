package com.hardcore.pedidos.abacatepayapi.routes;

public interface RotasAbacatePay {
    String PAGAMENTOS_BASE = "/pagamentos";
    String CRIAR_CHECKOUT = "/checkout";
    String CONSULTAR_CHECKOUT = "/pedido/{id}";
    String CANCELAR_CHECKOUT = "/pedido/{id}/cancelar";
    String ESTORNAR_CHECKOUT = "/pedido/{id}/estornar";
    String REGISTRAR_WEBHOOK = "/webhook/registrar";
    String RECEBER_WEBHOOK = "/webhooks/abacatepay";
}