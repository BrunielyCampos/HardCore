
package com.hardcore.pedidos.integracao;

import com.hardcore.pedidos.pedido.model.*;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.hardcore.pedidos.rabbitmq.EntregaStatusListener;
import com.hardcore.pedidos.rabbitmq.RabbitMQConfig;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

@SpringBootTest
class EntregaPedidoRabbitMQIntegrationTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private PedidoRepository pedidoRepository;

    @MockitoSpyBean
    private EntregaStatusListener entregaStatusListener;

    @DynamicPropertySource
    static void configurarPropriedades(DynamicPropertyRegistry registry) {

        // Banco H2
        registry.add("spring.datasource.url",
                () -> "jdbc:h2:mem:pedidos_rabbit_it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1");
        registry.add("spring.datasource.driver-class-name",
                () -> "org.h2.Driver");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.flyway.enabled", () -> "false");

        // RabbitMQ real no Docker
        registry.add("spring.rabbitmq.host", () -> "localhost");
        registry.add("spring.rabbitmq.port", () -> "5672");
        registry.add("spring.rabbitmq.username", () -> "guest");
        registry.add("spring.rabbitmq.password", () -> "guest");
        registry.add("spring.rabbitmq.dynamic", () -> "true");
        registry.add("spring.rabbitmq.listener.simple.auto-startup", () -> "true");

        // Configurações necessárias
        registry.add("JWT_SECRET",
                () -> "chave-secreta-super-segura-para-testes-hardcore-2026-256bits");

        registry.add("integracao.usuarios.url",
                () -> "http://localhost:8080");
        registry.add("integracao.produtos.url",
                () -> "http://localhost:8082");

        registry.add("abacatepay.api.url",
                () -> "https://api.abacatepay.com/v2");
        registry.add("abacatepay.api.key", () -> "test_key");
        registry.add("abacatepay.webhook.secret", () -> "test_secret");
        registry.add("abacatepay.webhook.endpoint",
                () -> "http://localhost:8083/webhook");
    }

    @BeforeEach
    void prepararCenario() {

        pedidoRepository.deleteAll();
        pedidoRepository.flush();

        // Limpa mensagens antigas da fila
        rabbitTemplate.execute(channel -> {
            channel.queuePurge(RabbitMQConfig.FILA_ENTREGA_ATUALIZADA);
            return null;
        });

        // Limpa registros de chamadas anteriores do listener
        clearInvocations(entregaStatusListener);
    }

    @Test
    @DisplayName("IT2: RabbitMQ recebe confirmação positiva e atualiza pedido para ENTREGUE")
    void deveAtualizarPedidoQuandoReceberConfirmacaoPositiva()
            throws Exception {

        Pedido pedido = pedidoRepository.saveAndFlush(
                criarPedido(EstadoCompraEnum.A_CAMINHO)
        );

        String mensagem = """
                {
                    "idPedido": %d,
                    "status": "ENTREGA_FEITA",
                    "confirmacaoCliente": true
                }
                """.formatted(pedido.getId());

        // Envia evento para o RabbitMQ real
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.FILA_ENTREGA_ATUALIZADA,
                mensagem
        );

        // Confirma que o listener recebeu a mensagem
        verify(entregaStatusListener, timeout(10000))
                .receberAtualizacaoEntrega(mensagem);

        // Aguarda a atualização no banco
        Pedido atualizado = aguardarEstado(
                pedido.getId(),
                EstadoCompraEnum.ENTREGUE
        );

        assertEquals(
                EstadoCompraEnum.ENTREGUE,
                atualizado.getEstado()
        );
    }

    @Test
    @DisplayName("IT2: RabbitMQ recebe confirmação negativa e mantém pedido A_CAMINHO")
    void deveManterPedidoACaminhoQuandoClienteNaoConfirmarRecebimento()
            throws Exception {

        Pedido pedido = pedidoRepository.saveAndFlush(
                criarPedido(EstadoCompraEnum.A_CAMINHO)
        );

        String mensagem = """
                {
                    "idPedido": %d,
                    "status": "ENTREGA_FEITA",
                    "confirmacaoCliente": false
                }
                """.formatted(pedido.getId());

        // Envia evento para o RabbitMQ real
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.FILA_ENTREGA_ATUALIZADA,
                mensagem
        );

        // Confirma que o listener recebeu a mensagem
        verify(entregaStatusListener, timeout(10000))
                .receberAtualizacaoEntrega(mensagem);

        Pedido atualizado = pedidoRepository.findById(
                pedido.getId()
        ).orElseThrow();

        assertEquals(
                EstadoCompraEnum.A_CAMINHO,
                atualizado.getEstado()
        );
    }

    private Pedido criarPedido(EstadoCompraEnum estado) {

        return new Pedido(
                null,
                1L,
                350.00,
                LocalDateTime.now(),
                estado,
                TipoPagamentoEnum.PIX,
                EstadoPagamentoEnum.PAGO,
                "chk_teste",
                "https://pay.abacatepay.com/chk_teste",
                7L,
                true,
                null
        );
    }

    private Pedido aguardarEstado(
            Long idPedido,
            EstadoCompraEnum estadoEsperado
    ) throws InterruptedException {

        long limite = System.currentTimeMillis() + 10000;

        while (System.currentTimeMillis() < limite) {

            Pedido pedido = pedidoRepository.findById(idPedido)
                    .orElseThrow();

            if (pedido.getEstado() == estadoEsperado) {
                return pedido;
            }

            Thread.sleep(100);
        }

        Pedido pedidoFinal = pedidoRepository.findById(idPedido)
                .orElseThrow();

        throw new AssertionError(
                "O pedido " + idPedido
                        + " deveria estar em " + estadoEsperado
                        + ", mas permaneceu em " + pedidoFinal.getEstado()
        );
    }
}
