
package com.hardcore.pedidos.itempedido.service;

import com.hardcore.pedidos.itempedido.dto.ItemPedidoRequestDTO;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoResponseDTO;
import com.hardcore.pedidos.itempedido.exception.ItemPedidoNaoEncontradoException;
import com.hardcore.pedidos.itempedido.mapper.ItemPedidoMapper;
import com.hardcore.pedidos.itempedido.model.ItemPedido;
import com.hardcore.pedidos.itempedido.repository.ItemPedidoRepository;
import com.hardcore.pedidos.pedido.exception.PedidoNaoEncontradoException;
import com.hardcore.pedidos.pedido.model.Pedido;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Proxy;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ItemPedidoServiceUnitTest {

    private ItemPedidoService service;

    private final Map<Long, Pedido> pedidos = new HashMap<>();
    private final Map<Long, ItemPedido> itens = new LinkedHashMap<>();

    private long proximoId = 1L;

    @BeforeEach
    void configurar() {

        pedidos.clear();
        itens.clear();
        proximoId = 1L;

        PedidoRepository pedidoRepository = criarPedidoRepository();
        ItemPedidoRepository itemPedidoRepository = criarItemPedidoRepository();

        ItemPedidoMapper mapper = new ItemPedidoMapper() {

            @Override
            public ItemPedido toEntity(ItemPedidoRequestDTO dto) {
                ItemPedido item = new ItemPedido();
                item.setIdPedido(dto.getIdPedido());
                item.setIdProduto(dto.getIdProduto());
                item.setQuantidade(dto.getQuantidade());
                item.setPrecoUnitario(dto.getPrecoUnitario());
                return item;
            }

            @Override
            public ItemPedidoResponseDTO toDTO(ItemPedido item) {
                return new ItemPedidoResponseDTO(
                        item.getId(),
                        item.getIdPedido(),
                        item.getIdProduto(),
                        item.getQuantidade(),
                        item.getPrecoUnitario()
                );
            }
        };

        service = new ItemPedidoService(
                mapper,
                itemPedidoRepository,
                pedidoRepository
        );
    }

    @AfterEach
    void limparAutenticacao() {
        SecurityContextHolder.clearContext();
    }

    // Repositório falso de pedidos
    private PedidoRepository criarPedidoRepository() {

        return (PedidoRepository) Proxy.newProxyInstance(
                PedidoRepository.class.getClassLoader(),
                new Class[]{PedidoRepository.class},
                (proxy, method, args) -> {

                    if (method.getName().equals("findById")) {
                        return Optional.ofNullable(pedidos.get(args[0]));
                    }

                    return null;
                }
        );
    }

    // Repositório falso de itens
    private ItemPedidoRepository criarItemPedidoRepository() {

        return (ItemPedidoRepository) Proxy.newProxyInstance(
                ItemPedidoRepository.class.getClassLoader(),
                new Class[]{ItemPedidoRepository.class},
                (proxy, method, args) -> {

                    switch (method.getName()) {

                        case "findById":
                            return Optional.ofNullable(itens.get(args[0]));

                        case "findByIdPedido":
                            Long idPedido = (Long) args[0];

                            return itens.values().stream()
                                    .filter(item -> item.getIdPedido().equals(idPedido))
                                    .toList();

                        case "save":
                            ItemPedido item = (ItemPedido) args[0];

                            if (item.getId() == null) {
                                item.setId(proximoId++);
                            }

                            itens.put(item.getId(), item);
                            return item;

                        case "delete":
                            ItemPedido itemExcluir = (ItemPedido) args[0];
                            itens.remove(itemExcluir.getId());
                            return null;

                        default:
                            return null;
                    }
                }
        );
    }

    private Pedido criarPedido(Long id, Long idCliente) {

        Pedido pedido = new Pedido();
        pedido.setId(id);
        pedido.setIdCliente(idCliente);

        pedidos.put(id, pedido);

        return pedido;
    }

    private ItemPedido criarItem(Long id, Long idPedido) {

        ItemPedido item = new ItemPedido();
        item.setId(id);
        item.setIdPedido(idPedido);
        item.setIdProduto(10L);
        item.setQuantidade(2);
        item.setPrecoUnitario(50.0);

        itens.put(id, item);

        return item;
    }

    private ItemPedidoRequestDTO criarRequest(Long idPedido) {

        ItemPedidoRequestDTO dto = new ItemPedidoRequestDTO();
        dto.setIdPedido(idPedido);
        dto.setIdProduto(10L);
        dto.setQuantidade(2);
        dto.setPrecoUnitario(50.0);

        return dto;
    }

    private void autenticar(Long idUsuario, String... roles) {

        List<SimpleGrantedAuthority> authorities = Arrays.stream(roles)
                .map(SimpleGrantedAuthority::new)
                .toList();

        UsernamePasswordAuthenticationToken autenticacao =
                new UsernamePasswordAuthenticationToken(
                        "usuario",
                        "senha",
                        authorities
                );

        autenticacao.setDetails(idUsuario);

        SecurityContextHolder.getContext()
                .setAuthentication(autenticacao);
    }

    // 1. Salvar item com sucesso
    @Test
    void deveSalvarItemComSucesso() {

        criarPedido(1L, 100L);
        autenticar(100L);

        ItemPedidoResponseDTO resultado =
                service.salvarItem(criarRequest(1L));

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals(1L, resultado.getIdPedido());
        assertEquals(10L, resultado.getIdProduto());
        assertEquals(2, resultado.getQuantidade());
        assertEquals(50.0, resultado.getPrecoUnitario());
    }

    // 2. Listar itens de um pedido
    @Test
    void deveListarItensPorPedido() {

        criarPedido(1L, 100L);
        criarItem(1L, 1L);
        criarItem(2L, 1L);

        autenticar(100L);

        List<ItemPedidoResponseDTO> resultado =
                service.listarItensPorPedido(1L);

        assertEquals(2, resultado.size());
    }

    // 3. Listar pedido sem itens
    @Test
    void deveRetornarListaVaziaQuandoPedidoNaoPossuirItens() {

        criarPedido(1L, 100L);
        autenticar(100L);

        List<ItemPedidoResponseDTO> resultado =
                service.listarItensPorPedido(1L);

        assertTrue(resultado.isEmpty());
    }

    // 4. Buscar item por ID
    @Test
    void deveBuscarItemPorId() {

        criarPedido(1L, 100L);
        criarItem(5L, 1L);

        autenticar(100L);

        ItemPedidoResponseDTO resultado =
                service.buscarItemPorId(5L);

        assertNotNull(resultado);
        assertEquals(5L, resultado.getId());
        assertEquals(1L, resultado.getIdPedido());
    }

    // 5. Buscar item inexistente
    @Test
    void deveLancarExcecaoQuandoItemNaoExistir() {

        ItemPedidoNaoEncontradoException exception =
                assertThrows(
                        ItemPedidoNaoEncontradoException.class,
                        () -> service.buscarItemPorId(99L)
                );

        assertTrue(exception.getMessage().contains("99"));
    }

    // 6. Deletar item
    @Test
    void deveDeletarItemComSucesso() {

        criarPedido(1L, 100L);
        criarItem(5L, 1L);

        autenticar(100L);

        service.deletarItem(5L);

        assertFalse(itens.containsKey(5L));
    }

    // 7. Deletar item inexistente
    @Test
    void deveLancarExcecaoAoDeletarItemInexistente() {

        assertThrows(
                ItemPedidoNaoEncontradoException.class,
                () -> service.deletarItem(99L)
        );
    }

    // 8. Pedido inexistente
    @Test
    void deveLancarExcecaoQuandoPedidoNaoExistir() {

        autenticar(100L);

        assertThrows(
                PedidoNaoEncontradoException.class,
                () -> service.listarItensPorPedido(99L)
        );
    }

    // 9. Usuário não autenticado
    @Test
    void deveBloquearUsuarioNaoAutenticado() {

        criarPedido(1L, 100L);

        SecurityContextHolder.clearContext();

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> service.listarItensPorPedido(1L)
                );

        assertEquals(
                HttpStatus.UNAUTHORIZED.value(),
                exception.getStatusCode().value()
        );
    }

    // 10. Autenticação existente, mas não autenticada
    @Test
    void deveBloquearAutenticacaoNaoValidada() {

        criarPedido(1L, 100L);

        UsernamePasswordAuthenticationToken autenticacao =
                new UsernamePasswordAuthenticationToken(
                        "usuario",
                        "senha"
                );

        SecurityContextHolder.getContext()
                .setAuthentication(autenticacao);

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> service.listarItensPorPedido(1L)
                );

        assertEquals(
                HttpStatus.UNAUTHORIZED.value(),
                exception.getStatusCode().value()
        );
    }

    // 11. Usuário tentando acessar pedido de outra pessoa
    @Test
    void deveBloquearUsuarioQueNaoSejaDonoDoPedido() {

        criarPedido(1L, 100L);
        autenticar(200L);

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> service.listarItensPorPedido(1L)
                );

        assertEquals(
                HttpStatus.FORBIDDEN.value(),
                exception.getStatusCode().value()
        );
    }

    // 12. Usuário autenticado sem ID Long nos detalhes
    @Test
    void deveBloquearUsuarioSemIdValidoNosDetalhes() {

        criarPedido(1L, 100L);

        UsernamePasswordAuthenticationToken autenticacao =
                new UsernamePasswordAuthenticationToken(
                        "usuario",
                        "senha",
                        List.of()
                );

        autenticacao.setDetails("100");

        SecurityContextHolder.getContext()
                .setAuthentication(autenticacao);

        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> service.listarItensPorPedido(1L)
                );

        assertEquals(
                HttpStatus.FORBIDDEN.value(),
                exception.getStatusCode().value()
        );
    }

    // 13. Gerente pode acessar pedido de outro usuário
    @Test
    void gerenteDeveConseguirAcessarPedidoDeOutroUsuario() {

        criarPedido(1L, 100L);
        autenticar(200L, "ROLE_GERENTE");

        List<ItemPedidoResponseDTO> resultado =
                service.listarItensPorPedido(1L);

        assertNotNull(resultado);
    }

    // 14. Administrador pode acessar pedido de outro usuário
    @Test
    void adminDeveConseguirAcessarPedidoDeOutroUsuario() {

        criarPedido(1L, 100L);
        autenticar(200L, "ROLE_ADMIN");

        List<ItemPedidoResponseDTO> resultado =
                service.listarItensPorPedido(1L);

        assertNotNull(resultado);
    }
}
