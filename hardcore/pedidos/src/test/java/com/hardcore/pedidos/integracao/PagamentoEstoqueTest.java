package com.hardcore.pedidos.integracao;

import com.hardcore.pedidos.abacatepayapi.dto.CriarCheckoutDTO;
import com.hardcore.pedidos.abacatepayapi.dto.ItemCheckoutDTO;
import com.hardcore.pedidos.abacatepayapi.service.PagamentoService;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.model.*;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.hardcore.pedidos.security.ServiceTokenService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PagamentoEstoqueTest {
    private static final String PRODUTOS_URL = "http://localhost:8082";
    private static HttpServer abacateStub;

    @Autowired private PagamentoService pagamentoService;
    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private ItemPedidoRepository itemPedidoRepository;
    @Autowired private ServiceTokenService tokenService;

    private final RestClient produtos = RestClient.builder().baseUrl(PRODUTOS_URL).build();

    @BeforeAll
    static void iniciarAbacateStub() throws IOException {
        abacateStub = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        abacateStub.createContext("/products/get", ex -> responder(ex, 200,
                "{\"success\":true,\"data\":{\"id\":\"prod_it1\"}}"));
        abacateStub.createContext("/checkouts/create", ex -> responder(ex, 200,
                "{\"success\":true,\"data\":{\"id\":\"chk_it1\",\"url\":\"https://pay.abacatepay.com/chk_it1\"}}"));
        abacateStub.start();
    }

    @AfterAll
    static void pararAbacateStub() {
        if (abacateStub != null) abacateStub.stop(0);
    }

    @DynamicPropertySource
    static void propriedades(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", () -> "jdbc:h2:mem:pedidos_it_real;MODE=PostgreSQL;DB_CLOSE_DELAY=-1");
        r.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        r.add("spring.datasource.username", () -> "sa");
        r.add("spring.datasource.password", () -> "");
        r.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        r.add("spring.flyway.enabled", () -> "false");
        r.add("integracao.produtos.url", () -> PRODUTOS_URL);
        r.add("integracao.usuarios.url", () -> "http://localhost:8081");
        r.add("abacatepay.api.url", () -> "http://127.0.0.1:" + abacateStub.getAddress().getPort());
        r.add("abacatepay.api.key", () -> "test_key");
        r.add("abacatepay.webhook.secret", () -> "test_secret");
        r.add("abacatepay.webhook.endpoint", () -> "http://localhost:8083/webhook");
        r.add("spring.rabbitmq.listener.simple.auto-startup", () -> "false");
        r.add("JWT_SECRET", () -> "hardcore-chave-secreta-super-segura-2026-tads-ifrn");
    }

    @BeforeEach
    void preparar() {
        itemPedidoRepository.deleteAll();
        pedidoRepository.deleteAll();
        var auth = new UsernamePasswordAuthenticationToken("cliente@hardcore.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));
        auth.setDetails(1L);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void limparSeguranca() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("IT1 - Pedidos e Produtos reais: checkout, reserva, cancelamento e liberacao")
    void deveReservarECancelarComProdutosReal() {
        Long produtoId = null;
        boolean estoqueCriado = false;
        try {
            // Produto exclusivo deste teste; nao interfere nos produtos do Selenium.
            JsonNode produto = postAutenticado("/produtos/cadastrar", Map.of(
                    "nome", "Produto exclusivo IT1", "marca", "HardCore",
                    "categoria", "Testes", "preco", 250.00));
            assertNotNull(produto);
            produtoId = produto.path("id").asLong();
            assertTrue(produtoId > 0, "Cadastro nao retornou ID de produto valido");

            JsonNode estoque = postAutenticado("/estoque/cadastrar", Map.of(
                    "produto_id", produtoId, "quantidadeProduto", 10));
            assertNotNull(estoque);
            estoqueCriado = true;
            assertEquals(10, consultarEstoque(produtoId));

            Pedido pedido = pedidoRepository.save(new Pedido(
                    null, 1L, 0.0, LocalDateTime.now(),
                    EstadoCompraEnum.A_COMPRAR, TipoPagamentoEnum.PIX,
                    EstadoPagamentoEnum.PENDENTE, null, null, null, false, null));

            PedidoResponseDTO resposta = pagamentoService.criarCheckout(new CriarCheckoutDTO(
                    pedido.getId(), List.of(new ItemCheckoutDTO(produtoId.toString(), 2))));

            assertEquals("chk_it1", resposta.getAbacatePayCheckoutId());
            assertEquals(500.00, resposta.getValorCompra(), 0.001);
            assertEquals(8, consultarEstoque(produtoId), "Reserva HTTP real deve baixar estoque de 10 para 8");
            assertTrue(pedidoRepository.findById(pedido.getId()).orElseThrow().getEstoqueBaixado());
            assertEquals(1, itemPedidoRepository.findByIdPedido(pedido.getId()).size());

            pagamentoService.cancelarPagamento(pedido.getId());
            Pedido cancelado = pedidoRepository.findById(pedido.getId()).orElseThrow();
            assertEquals(EstadoCompraEnum.COMPRA_CANCELADA, cancelado.getEstado());
            assertEquals(EstadoPagamentoEnum.CANCELADO, cancelado.getEstadoPagamento());
            assertFalse(cancelado.getEstoqueBaixado());
            assertEquals(10, consultarEstoque(produtoId), "Cancelamento deve liberar as 2 unidades");
        } finally {
            if (produtoId != null) {
                // Limpeza limitada ao produto criado por este teste.
                // A exclusao exige quantidade de estoque igual a zero.
                try {
                    if (estoqueCriado) {
                        produtos.put().uri("/estoque/{id}/quantidade", produtoId)
                                .header(HttpHeaders.AUTHORIZATION, bearer())
                                .body(0).retrieve().toBodilessEntity();
                    }
                    produtos.delete().uri("/produtos/{id}", produtoId)
                            .header(HttpHeaders.AUTHORIZATION, bearer())
                            .retrieve().toBodilessEntity();
                } catch (RuntimeException erroLimpeza) {
                    throw new AssertionError("Falha ao limpar produto exclusivo IT1 (ID " + produtoId
                            + "). Verifique o banco antes de repetir o teste.", erroLimpeza);
                }
            }
        }
    }

    private String bearer() {
        return "Bearer " + tokenService.gerarTokenInterno();
    }

    private JsonNode postAutenticado(String caminho, Object corpo) {
        return produtos.post().uri(caminho)
                .header(HttpHeaders.AUTHORIZATION, bearer())
                .body(corpo).retrieve().body(JsonNode.class);
    }

    private int consultarEstoque(Long id) {
        JsonNode json = produtos.get().uri("/estoque/{id}", id)
                .retrieve().body(JsonNode.class);
        assertNotNull(json, "Produtos nao retornou estoque");
        assertFalse(json.path("quantidadeProduto").isMissingNode(), "Campo quantidadeProduto ausente");
        return json.path("quantidadeProduto").asInt();
    }

    private static void responder(HttpExchange ex, int status, String corpo) throws IOException {
        byte[] bytes = corpo.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }
}
