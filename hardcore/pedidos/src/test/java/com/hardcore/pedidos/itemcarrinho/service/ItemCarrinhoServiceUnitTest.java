
package com.hardcore.pedidos.itemcarrinho.service;

import com.hardcore.pedidos.carrinho.model.Carrinho;
import com.hardcore.pedidos.carrinho.repository.CarrinhoRepository;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoRequestDTO;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoResponseDTO;
import com.hardcore.pedidos.itemcarrinho.exception.ItemCarrinhoNaoEncontradoException;
import com.hardcore.pedidos.itemcarrinho.mapper.ItemCarrinhoMapper;
import com.hardcore.pedidos.itemcarrinho.model.ItemCarrinho;
import com.hardcore.pedidos.itemcarrinho.repository.ItemCarrinhoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;

import java.lang.reflect.Proxy;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ItemCarrinhoServiceUnitTest {

    private ItemCarrinhoService service;
    private FakeItemRepository fakeItemRepository;
    private FakeCarrinhoRepository fakeCarrinhoRepository;

    @BeforeEach
    void setUp() {

        fakeItemRepository = new FakeItemRepository();
        fakeCarrinhoRepository = new FakeCarrinhoRepository();

        ItemCarrinhoMapper mapper = new ItemCarrinhoMapper() {

            @Override
            public ItemCarrinho toEntity(ItemCarrinhoRequestDTO dto) {
                ItemCarrinho item = new ItemCarrinho();
                item.setIdCarrinho(dto.getIdCarrinho());
                item.setIdProduto(dto.getIdProduto());
                item.setQuantidade(dto.getQuantidade());
                return item;
            }

            @Override
            public ItemCarrinhoResponseDTO toDTO(ItemCarrinho item) {
                return new ItemCarrinhoResponseDTO(
                        item.getId(),
                        item.getIdCarrinho(),
                        item.getIdProduto(),
                        item.getQuantidade()
                );
            }
        };

        service = new ItemCarrinhoService(
                mapper,
                fakeItemRepository.getRepository(),
                fakeCarrinhoRepository.getRepository()
        );

        // Carrinho 10 pertence ao usuário 1.
        fakeCarrinhoRepository.adicionar(
                criarCarrinho(10L, 1L)
        );
    }

    @Test
    @DisplayName("Deve adicionar um produto novo ao carrinho")
    void deveAdicionarProdutoNovo() {

        ItemCarrinhoRequestDTO request = criarRequest(10L, 100L, 2);

        ItemCarrinhoResponseDTO response =
                service.adicionarItem(request, 1L);

        assertNotNull(response);
        assertEquals(10L, response.getIdCarrinho());
        assertEquals(100L, response.getIdProduto());
        assertEquals(2, response.getQuantidade());
        assertEquals(1, fakeItemRepository.quantidadeSalvos());
    }

    @Test
    @DisplayName("Deve somar quantidade quando o produto já existe")
    void deveSomarQuantidadeDeProdutoExistente() {

        ItemCarrinho existente = criarItem(1L, 10L, 100L, 2);
        fakeItemRepository.adicionar(existente);

        ItemCarrinhoRequestDTO request = criarRequest(10L, 100L, 3);

        ItemCarrinhoResponseDTO response =
                service.adicionarItem(request, 1L);

        assertEquals(5, response.getQuantidade());
        assertEquals(1, fakeItemRepository.quantidadeItens());
    }

    @Test
    @DisplayName("Deve listar os itens do carrinho")
    void deveListarItensDoCarrinho() {

        fakeItemRepository.adicionar(
                criarItem(1L, 10L, 100L, 2)
        );

        fakeItemRepository.adicionar(
                criarItem(2L, 10L, 200L, 1)
        );

        List<ItemCarrinhoResponseDTO> response =
                service.listarItensPorCarrinho(10L, 1L);

        assertEquals(2, response.size());
        assertEquals(100L, response.get(0).getIdProduto());
        assertEquals(200L, response.get(1).getIdProduto());
    }

    @Test
    @DisplayName("Não deve permitir acessar carrinho de outro usuário")
    void naoDevePermitirAcessoAoCarrinhoDeOutroUsuario() {

        assertThrows(
                AccessDeniedException.class,
                () -> service.listarItensPorCarrinho(10L, 2L)
        );
    }

    @Test
    @DisplayName("Não deve permitir acesso a carrinho inexistente")
    void naoDevePermitirAcessoACarrinhoInexistente() {

        assertThrows(
                AccessDeniedException.class,
                () -> service.listarItensPorCarrinho(999L, 1L)
        );
    }

    @Test
    @DisplayName("Deve remover item existente do carrinho")
    void deveRemoverItemExistente() {

        ItemCarrinho item = criarItem(1L, 10L, 100L, 2);
        fakeItemRepository.adicionar(item);

        assertDoesNotThrow(() -> service.removerItem(1L, 1L));

        assertEquals(0, fakeItemRepository.quantidadeItens());
        assertEquals(1, fakeItemRepository.quantidadeExclusoes());
    }

    @Test
    @DisplayName("Deve lançar exceção ao remover item inexistente")
    void deveLancarExcecaoAoRemoverItemInexistente() {

        assertThrows(
                ItemCarrinhoNaoEncontradoException.class,
                () -> service.removerItem(999L, 1L)
        );
    }

    private Carrinho criarCarrinho(Long id, Long idCliente) {
        Carrinho carrinho = new Carrinho();
        carrinho.setId(id);
        carrinho.setIdCliente(idCliente);
        return carrinho;
    }

    private ItemCarrinho criarItem(
            Long id,
            Long idCarrinho,
            Long idProduto,
            Integer quantidade
    ) {
        ItemCarrinho item = new ItemCarrinho();
        item.setId(id);
        item.setIdCarrinho(idCarrinho);
        item.setIdProduto(idProduto);
        item.setQuantidade(quantidade);
        return item;
    }

    private ItemCarrinhoRequestDTO criarRequest(
            Long idCarrinho,
            Long idProduto,
            Integer quantidade
    ) {
        ItemCarrinhoRequestDTO request = new ItemCarrinhoRequestDTO();
        request.setIdCarrinho(idCarrinho);
        request.setIdProduto(idProduto);
        request.setQuantidade(quantidade);
        return request;
    }

    static class FakeItemRepository {

        private final Map<Long, ItemCarrinho> banco = new HashMap<>();
        private long sequencia = 1L;
        private int salvos = 0;
        private int exclusoes = 0;

        private final ItemCarrinhoRepository repository =
                (ItemCarrinhoRepository) Proxy.newProxyInstance(
                        ItemCarrinhoRepository.class.getClassLoader(),
                        new Class<?>[]{ItemCarrinhoRepository.class},
                        (proxy, method, args) -> {

                            switch (method.getName()) {

                                case "findByIdCarrinho":
                                    Long idCarrinho = (Long) args[0];

                                    return banco.values().stream()
                                            .filter(i -> i.getIdCarrinho()
                                                    .equals(idCarrinho))
                                            .toList();

                                case "findById":
                                    return Optional.ofNullable(
                                            banco.get(args[0])
                                    );

                                case "save":
                                    ItemCarrinho item = (ItemCarrinho) args[0];

                                    if (item.getId() == null) {
                                        item.setId(sequencia++);
                                    }

                                    banco.put(item.getId(), item);
                                    salvos++;

                                    return item;

                                case "delete":
                                    ItemCarrinho removido =
                                            (ItemCarrinho) args[0];

                                    banco.remove(removido.getId());
                                    exclusoes++;

                                    return null;

                                default:
                                    throw new UnsupportedOperationException(
                                            method.getName()
                                    );
                            }
                        }
                );

        ItemCarrinhoRepository getRepository() {
            return repository;
        }

        void adicionar(ItemCarrinho item) {
            banco.put(item.getId(), item);
        }

        int quantidadeSalvos() {
            return salvos;
        }

        int quantidadeItens() {
            return banco.size();
        }

        int quantidadeExclusoes() {
            return exclusoes;
        }
    }

    static class FakeCarrinhoRepository {

        private final Map<Long, Carrinho> banco = new HashMap<>();

        private final CarrinhoRepository repository =
                (CarrinhoRepository) Proxy.newProxyInstance(
                        CarrinhoRepository.class.getClassLoader(),
                        new Class<?>[]{CarrinhoRepository.class},
                        (proxy, method, args) -> {

                            if (method.getName().equals("findById")) {
                                return Optional.ofNullable(
                                        banco.get(args[0])
                                );
                            }

                            throw new UnsupportedOperationException(
                                    method.getName()
                            );
                        }
                );

        CarrinhoRepository getRepository() {
            return repository;
        }

        void adicionar(Carrinho carrinho) {
            banco.put(carrinho.getId(), carrinho);
        }
    }
}
