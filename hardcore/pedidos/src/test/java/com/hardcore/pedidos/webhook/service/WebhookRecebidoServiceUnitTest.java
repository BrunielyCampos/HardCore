
package com.hardcore.pedidos.webhook.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hardcore.pedidos.integracao.ProdutoClient;
import com.hardcore.pedidos.itempedido.model.ItemPedido;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import com.hardcore.pedidos.pedido.model.EstadoPagamentoEnum;
import com.hardcore.pedidos.pedido.model.Pedido;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.hardcore.pedidos.rabbitmq.PedidoPagoEvent;
import com.hardcore.pedidos.rabbitmq.PedidoPagoProducer;
import com.hardcore.pedidos.security.ServiceTokenService;
import com.hardcore.pedidos.webhook.model.WebhookRecebido;
import com.hardcore.pedidos.webhook.repository.WebhookRecebidoRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.io.IOException;
import java.lang.reflect.Proxy;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class WebhookRecebidoServiceUnitTest {

    private WebhookRecebidoService service;

    private final Map<Long, Pedido> pedidos = new HashMap<>();
    private final Map<String, WebhookRecebido> webhooks = new HashMap<>();
    private final List<ItemPedido> itens = new ArrayList<>();
    private final List<String> estoquesLiberados = new ArrayList<>();
    private final List<PedidoPagoEvent> eventosPublicados = new ArrayList<>();

    private int pedidosSalvos;

    @BeforeEach
    void configurar() {

        pedidos.clear();
        webhooks.clear();
        itens.clear();
        estoquesLiberados.clear();
        eventosPublicados.clear();
        pedidosSalvos = 0;

        ObjectMapper objectMapper = new ObjectMapper();

        PedidoRepository pedidoRepository = criarPedidoRepository();
        WebhookRecebidoRepository webhookRepository = criarWebhookRepository();
        ItemPedidoRepository itemPedidoRepository = criarItemPedidoRepository();

        // ProdutoClient falso: não realiza chamadas HTTP reais.
        ProdutoClient produtoClient = new ProdutoClient(
                "http://localhost",
                (ServiceTokenService) null
        ) {
            @Override
            public void liberarEstoque(Long produtoId, int quantidade) {
                estoquesLiberados.add(produtoId + ":" + quantidade);
            }
        };

        // Producer falso: não envia mensagens ao RabbitMQ.
        PedidoPagoProducer producer = new PedidoPagoProducer(
                (RabbitTemplate) null
        ) {
            @Override
            public void publicar(PedidoPagoEvent evento) {
                eventosPublicados.add(evento);
            }
        };

        service = new WebhookRecebidoService(
                objectMapper,
                pedidoRepository,
                webhookRepository,
                producer,
                produtoClient,
                itemPedidoRepository
        );
    }

    private PedidoRepository criarPedidoRepository() {

        return (PedidoRepository) Proxy.newProxyInstance(
                PedidoRepository.class.getClassLoader(),
                new Class[]{PedidoRepository.class},
                (proxy, method, args) -> {

                    switch (method.getName()) {

                        case "findById":
                            return Optional.ofNullable(
                                    pedidos.get(args[0])
                            );

                        case "findByAbacatePayCheckoutId":
                            String checkoutId = (String) args[0];

                            return pedidos.values().stream()
                                    .filter(p -> checkoutId.equals(
                                            p.getAbacatePayCheckoutId()
                                    ))
                                    .findFirst();

                        case "save":
                            pedidosSalvos++;
                            return args[0];

                        default:
                            return null;
                    }
                }
        );
    }

    private WebhookRecebidoRepository criarWebhookRepository() {

        return (WebhookRecebidoRepository) Proxy.newProxyInstance(
                WebhookRecebidoRepository.class.getClassLoader(),
                new Class[]{WebhookRecebidoRepository.class},
                (proxy, method, args) -> {

                    switch (method.getName()) {

                        case "existsById":
                            return webhooks.containsKey(args[0]);

                        case "saveAndFlush":
                            WebhookRecebido webhook =
                                    (WebhookRecebido) args[0];

                            webhooks.put(webhook.getId(), webhook);
                            return webhook;

                        default:
                            return null;
                    }
                }
        );
    }

    private ItemPedidoRepository criarItemPedidoRepository() {

        return (ItemPedidoRepository) Proxy.newProxyInstance(
                ItemPedidoRepository.class.getClassLoader(),
                new Class[]{ItemPedidoRepository.class},
                (proxy, method, args) -> {

                    if (method.getName().equals("findByIdPedido")) {

                        Long idPedido = (Long) args[0];

                        return itens.stream()
                                .filter(item -> item.getIdPedido().equals(idPedido))
                                .toList();
                    }

                    return null;
                }
        );
    }

    private Pedido criarPedido(Long id, String checkoutId) {

        Pedido pedido = new Pedido();

        pedido.setId(id);
        pedido.setIdCliente(100L);
        pedido.setIdEntregador(200L);
        pedido.setAbacatePayCheckoutId(checkoutId);
        pedido.setEstadoPagamento(EstadoPagamentoEnum.PENDENTE);
        pedido.setEstoqueBaixado(false);

        pedidos.put(id, pedido);

        return pedido;
    }

    private byte[] evento(String id, String tipo, String checkoutId,
                          String externalId) {

        String json = """
                {
                  "id": "%s",
                  "event": "%s",
                  "data": {
                    "checkout": {
                      "id": "%s",
                      "externalId": "%s"
                    }
                  }
                }
                """.formatted(id, tipo, checkoutId, externalId);

        return json.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private ItemPedido criarItem(Long idPedido, Long idProduto,
                                 Integer quantidade) {

        ItemPedido item = new ItemPedido();

        item.setIdPedido(idPedido);
        item.setIdProduto(idProduto);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(50.0);

        itens.add(item);

        return item;
    }

    // 1. Pagamento concluído
    @Test
    void deveAtualizarPedidoQuandoPagamentoForConcluido() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");

        service.processarEvento(
                evento("evt-1", "checkout.completed",
                        "checkout-123", "pedido-1")
        );

        assertEquals(EstadoPagamentoEnum.PAGO, pedido.getEstadoPagamento());
        assertEquals(1, pedidosSalvos);
        assertTrue(webhooks.containsKey("evt-1"));
        assertEquals(1, eventosPublicados.size());
    }

    // 2. Pagamento estornado
    @Test
    void deveEstornarPagamentoEDevolverEstoque() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");
        pedido.setEstoqueBaixado(true);

        criarItem(1L, 10L, 3);

        service.processarEvento(
                evento("evt-2", "checkout.refunded",
                        "checkout-123", "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.ESTORNADO,
                pedido.getEstadoPagamento()
        );

        assertFalse(pedido.getEstoqueBaixado());
        assertEquals(List.of("10:3"), estoquesLiberados);
    }

    // 3. Pagamento em disputa
    @Test
    void deveAtualizarPagamentoParaEmDisputa() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");

        service.processarEvento(
                evento("evt-3", "checkout.disputed",
                        "checkout-123", "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.EM_DISPUTA,
                pedido.getEstadoPagamento()
        );
    }

    // 4. Pagamento perdido
    @Test
    void deveMarcarPagamentoComoFalhouELiberarEstoque() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");
        pedido.setEstoqueBaixado(true);

        criarItem(1L, 20L, 2);

        service.processarEvento(
                evento("evt-4", "checkout.lost",
                        "checkout-123", "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.FALHOU,
                pedido.getEstadoPagamento()
        );

        assertFalse(pedido.getEstoqueBaixado());
        assertEquals(List.of("20:2"), estoquesLiberados);
    }

    // 5. Evento sem ID
    @Test
    void deveRejeitarEventoSemId() {

        byte[] corpo = """
                {"event":"checkout.completed"}
                """.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        assertThrows(
                IllegalArgumentException.class,
                () -> service.processarEvento(corpo)
        );
    }

    // 6. Evento sem tipo
    @Test
    void deveRejeitarEventoSemTipo() {

        byte[] corpo = """
                {"id":"evt-5"}
                """.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        assertThrows(
                IllegalArgumentException.class,
                () -> service.processarEvento(corpo)
        );
    }

    // 7. Evento duplicado
    @Test
    void naoDeveProcessarEventoDuplicado() throws IOException {

        webhooks.put(
                "evt-6",
                new WebhookRecebido("evt-6", "checkout.completed")
        );

        Pedido pedido = criarPedido(1L, "checkout-123");

        service.processarEvento(
                evento("evt-6", "checkout.completed",
                        "checkout-123", "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.PENDENTE,
                pedido.getEstadoPagamento()
        );

        assertEquals(0, pedidosSalvos);
        assertTrue(eventosPublicados.isEmpty());
    }

    // 8. Evento desconhecido
    @Test
    void deveIgnorarEventoDesconhecido() throws IOException {

        criarPedido(1L, "checkout-123");

        service.processarEvento(
                evento("evt-7", "checkout.created",
                        "checkout-123", "pedido-1")
        );

        assertEquals(0, pedidosSalvos);
        assertFalse(webhooks.containsKey("evt-7"));
    }

    // 9. Localizar pedido pelo checkout ID
    @Test
    void deveLocalizarPedidoPeloCheckoutId() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");

        service.processarEvento(
                evento("evt-8", "checkout.disputed",
                        "checkout-123", null)
        );

        assertEquals(
                EstadoPagamentoEnum.EM_DISPUTA,
                pedido.getEstadoPagamento()
        );
    }

    // 10. Localizar pedido pelo external ID
    @Test
    void deveLocalizarPedidoPeloExternalId() throws IOException {

        Pedido pedido = criarPedido(1L, null);

        service.processarEvento(
                evento("evt-9", "checkout.completed",
                        null, "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.PAGO,
                pedido.getEstadoPagamento()
        );
    }

    // 11. Pedido não encontrado
    @Test
    void deveLancarExcecaoQuandoPedidoNaoForEncontrado() {

        assertThrows(
                IllegalStateException.class,
                () -> service.processarEvento(
                        evento("evt-10", "checkout.completed",
                                null, "pedido-999")
                )
        );
    }

    // 12. External ID inválido
    @Test
    void deveLancarExcecaoQuandoExternalIdForInvalido() {

        assertThrows(
                IllegalStateException.class,
                () -> service.processarEvento(
                        evento("evt-11", "checkout.completed",
                                null, "pedido-abc")
                )
        );
    }

    // 13. Não alterar pedido já estornado
    @Test
    void naoDeveAlterarPedidoJaEstornado() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");
        pedido.setEstadoPagamento(EstadoPagamentoEnum.ESTORNADO);

        service.processarEvento(
                evento("evt-12", "checkout.completed",
                        "checkout-123", "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.ESTORNADO,
                pedido.getEstadoPagamento()
        );

        assertEquals(0, pedidosSalvos);
        assertTrue(webhooks.containsKey("evt-12"));
    }

    // 14. Não alterar pedido cancelado
    @Test
    void naoDeveAlterarPedidoCancelado() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");
        pedido.setEstadoPagamento(EstadoPagamentoEnum.CANCELADO);

        service.processarEvento(
                evento("evt-13", "checkout.completed",
                        "checkout-123", "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.CANCELADO,
                pedido.getEstadoPagamento()
        );

        assertEquals(0, pedidosSalvos);
    }

    // 15. Não liberar estoque quando ele não foi baixado
    @Test
    void naoDeveLiberarEstoqueQuandoNaoFoiBaixado() throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");

        criarItem(1L, 30L, 5);

        service.processarEvento(
                evento("evt-14", "checkout.refunded",
                        "checkout-123", "pedido-1")
        );

        assertFalse(pedido.getEstoqueBaixado());
        assertTrue(estoquesLiberados.isEmpty());
    }

    // 16. Pagamento concluído sem entregador
    @Test
    void naoDevePublicarEventoQuandoPedidoNaoPossuirEntregador()
            throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");
        pedido.setIdEntregador(null);

        service.processarEvento(
                evento("evt-15", "checkout.completed",
                        "checkout-123", "pedido-1")
        );

        assertEquals(
                EstadoPagamentoEnum.PAGO,
                pedido.getEstadoPagamento()
        );

        assertTrue(eventosPublicados.isEmpty());
    }

    // 17. Pagamento concluído não deve liberar estoque
    @Test
    void naoDeveLiberarEstoqueQuandoPagamentoForConcluido()
            throws IOException {

        Pedido pedido = criarPedido(1L, "checkout-123");
        pedido.setEstoqueBaixado(true);

        criarItem(1L, 40L, 2);

        service.processarEvento(
                evento("evt-16", "checkout.completed",
                        "checkout-123", "pedido-1")
        );

        assertTrue(estoquesLiberados.isEmpty());
        assertTrue(pedido.getEstoqueBaixado());
    }
}
