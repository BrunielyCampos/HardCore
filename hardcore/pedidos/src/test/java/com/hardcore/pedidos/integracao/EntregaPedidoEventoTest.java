package com.hardcore.pedidos.integracao;

import com.hardcore.pedidos.pedido.model.*;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.hardcore.pedidos.rabbitmq.EntregaStatusListener;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class EntregaPedidoEventoTest {

    @Autowired
    private EntregaStatusListener entregaStatusListener;

    @Autowired
    private PedidoRepository pedidoRepository;

    @DynamicPropertySource
    static void configurarPropriedades(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:h2:mem:pedidos_evento_it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.flyway.enabled", () -> "false");
        registry.add("integracao.produtos.url", () -> "http://localhost:8082");
        registry.add("integracao.usuarios.url", () -> "http://localhost:8080");
        registry.add("abacatepay.api.url", () -> "https://api.abacatepay.com/v2");
        registry.add("abacatepay.api.key", () -> "test_key");
        registry.add("abacatepay.webhook.secret", () -> "test_secret");
        registry.add("abacatepay.webhook.endpoint", () -> "http://localhost:8083/webhook");
        registry.add("spring.rabbitmq.listener.simple.auto-startup", () -> "false");
        registry.add("spring.rabbitmq.dynamic", () -> "false");
    }

    @BeforeEach
    void limparBanco() {
        pedidoRepository.deleteAll();
    }

    @Test
    @DisplayName("IT2 (RN08, CT-ENT-06 e CT-ENT-08): Deve integrar evento RabbitMQ de Entrega com PedidoService e persistir transição no banco")
    void deveIntegrarEventoDeEntregaComAtualizacaoDoPedidoNoBanco() throws Exception {
        Pedido pedido = pedidoRepository.save(new Pedido(
                null, 1L, 350.00, LocalDateTime.now(),
                EstadoCompraEnum.A_CAMINHO, TipoPagamentoEnum.PIX, EstadoPagamentoEnum.PAGO,
                "chk_999", "https://pay.abacatepay.com/chk_999", 7L, true, null
        ));

        // 1. Cenário RN08 (CT-ENT-06): Entregador marca ENTREGA_FEITA, mas cliente sinaliza negativo (confirmacaoCliente = false)
        String payloadNegativo = "{\"idPedido\":" + pedido.getId()
                + ",\"status\":\"ENTREGA_FEITA\",\"confirmacaoCliente\":false}";
        entregaStatusListener.receberAtualizacaoEntrega(payloadNegativo);

        Pedido aposSinalizacaoNegativa = pedidoRepository.findById(pedido.getId()).orElseThrow();
        assertEquals(EstadoCompraEnum.A_CAMINHO, aposSinalizacaoNegativa.getEstado());

        // 2. Cenário RN08 (CT-ENT-08 / CT-CEN-01): Cliente confirma positivamente (confirmacaoCliente = true)
        String payloadPositivo = "{\"idPedido\":" + pedido.getId()
                + ",\"status\":\"ENTREGA_FEITA\",\"confirmacaoCliente\":true}";
        entregaStatusListener.receberAtualizacaoEntrega(payloadPositivo);

        Pedido aposConfirmacaoPositiva = pedidoRepository.findById(pedido.getId()).orElseThrow();
        assertEquals(EstadoCompraEnum.ENTREGUE, aposConfirmacaoPositiva.getEstado());
    }
}