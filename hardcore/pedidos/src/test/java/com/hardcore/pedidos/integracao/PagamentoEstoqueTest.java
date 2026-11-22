package com.hardcore.pedidos.integracao;

import com.hardcore.pedidos.abacatepayapi.dto.CriarCheckoutDTO;
import com.hardcore.pedidos.abacatepayapi.dto.ItemCheckoutDTO;
import com.hardcore.pedidos.abacatepayapi.service.PagamentoService;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.model.*;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PagamentoEstoqueTest {

    private static HttpServer servidorHttpStub;
    private static final AtomicInteger estoqueSimulado = new AtomicInteger(10);

    @Autowired
    private PagamentoService pagamentoService;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @BeforeAll
    static void iniciarServidorExterno() throws Exception {
        servidorHttpStub = HttpServer.create(new InetSocketAddress(0), 0);

        // Endpoint real do microsserviço Produtos: GET /produtos/{id}
        servidorHttpStub.createContext("/produtos/1", exchange -> {
            String json = "{\"id\":1,\"nome\":\"SSD SATA 480GB\",\"preco\":250.00}";
            responderJson(exchange, 200, json);
        });

        // Endpoint real do microsserviço Produtos: POST /estoque/{id}/reservar
        servidorHttpStub.createContext("/estoque/1/reservar", exchange -> {
            String query = exchange.getRequestURI().getQuery(); // quantidade=2
            int qtd = Integer.parseInt(query.split("=")[1]);
            if (estoqueSimulado.get() >= qtd) {
                estoqueSimulado.addAndGet(-qtd);
                responderJson(exchange, 200, "");
            } else {
                responderJson(exchange, 400, "{\"erro\":\"Estoque insuficiente\"}");
            }
        });

        // Stub da API externa AbacatePay (único stub permitido pelo roteiro)
        servidorHttpStub.createContext("/products/get", exchange ->
                responderJson(exchange, 200, "{\"success\":true,\"data\":{\"id\":\"prod_abacate_01\"}}"));

        servidorHttpStub.createContext("/checkouts/create", exchange ->
                responderJson(exchange, 200, "{\"success\":true,\"data\":{\"id\":\"chk_12345\",\"url\":\"https://pay.abacatepay.com/chk_12345\"}}"));

        servidorHttpStub.start();
    }

    @AfterAll
    static void pararServidorExterno() {
        if (servidorHttpStub != null) servidorHttpStub.stop(0);
    }

    @DynamicPropertySource
    static void configurarPropriedades(DynamicPropertyRegistry registry) {
        String baseUrl = "http://localhost:" + servidorHttpStub.getAddress().getPort();
        registry.add("spring.datasource.url", () -> "jdbc:h2:mem:pedidos_it;MODE=PostgreSQL;DB_CLOSE_DELAY=-1");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.flyway.enabled", () -> "false");
        registry.add("integracao.produtos.url", () -> baseUrl);
        registry.add("integracao.usuarios.url", () -> baseUrl);
        registry.add("abacatepay.api.url", () -> baseUrl);
        registry.add("abacatepay.api.key", () -> "test_key");
        registry.add("abacatepay.webhook.secret", () -> "test_secret");
        registry.add("abacatepay.webhook.endpoint", () -> "http://localhost:8083/webhook");
        registry.add("spring.rabbitmq.listener.simple.auto-startup", () -> "false");
    }

    @BeforeEach
    void prepararAmbiente() {
        itemPedidoRepository.deleteAll();
        pedidoRepository.deleteAll();
        estoqueSimulado.set(10);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "cliente@hardcore.com", null, List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));
        auth.setDetails(1L);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void limparSeguranca() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("IT1 (RF9, RF10, CT-COM-04): Deve integrar Pedido + ProdutoClient (reserva HTTP) + AbacatePay e persistir no banco")
    void deveIntegrarCriacaoCheckoutComReservaDeEstoqueEPersistencia() {
        Pedido pedido = pedidoRepository.save(new Pedido(
                null, 1L, 0.0, LocalDateTime.now(),
                EstadoCompraEnum.A_COMPRAR, TipoPagamentoEnum.PIX, EstadoPagamentoEnum.PENDENTE,
                null, null, null, false, null
        ));

        CriarCheckoutDTO checkoutDTO = new CriarCheckoutDTO(
                pedido.getId(),
                List.of(new ItemCheckoutDTO("1", 2))
        );

        PedidoResponseDTO resposta = pagamentoService.criarCheckout(checkoutDTO);

        // 1. Verifica retorno integrado do Checkout (AbacatePay stub)
        assertEquals("chk_12345", resposta.getAbacatePayCheckoutId());
        assertEquals("https://pay.abacatepay.com/chk_12345", resposta.getUrlPagamento());
        assertEquals(500.00, resposta.getValorCompra());

        // 2. Verifica efeito colateral real no serviço de Produtos via HTTP (10 - 2 = 8)
        assertEquals(8, estoqueSimulado.get());

        // 3. Verifica persistência real no banco de dados (Pedido + ItemPedido)
        Pedido pedidoBanco = pedidoRepository.findById(pedido.getId()).orElseThrow();
        assertTrue(pedidoBanco.getEstoqueBaixado());
        assertEquals(1, itemPedidoRepository.findByIdPedido(pedido.getId()).size());
    }

    private static void responderJson(com.sun.net.httpserver.HttpExchange exchange, int status, String body) throws java.io.IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}