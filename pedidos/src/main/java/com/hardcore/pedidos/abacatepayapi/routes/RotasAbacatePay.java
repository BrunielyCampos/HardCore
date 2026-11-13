package com.hardcore.pedidos.abacatepayapi.routes;

public interface RotasAbacatePay {
    String PAGAMENTOS_BASE = "/pagamentos";
    String CRIAR_CHECKOUT = "/checkout";
    String CONSULTAR_CHECKOUT = "/checkout/{id}";
    String CANCELAR_CHECKOUT = "/checkout/{id}";
    String ESTORNAR_CHECKOUT = "/checkout/{id}/estornar";
    String RECEBER_WEBHOOK = "/webhooks/abacatepay";
}