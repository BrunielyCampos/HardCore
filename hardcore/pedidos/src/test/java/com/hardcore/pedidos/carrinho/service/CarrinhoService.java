
package com.hardcore.pedidos.carrinho.service;

import com.hardcore.pedidos.carrinho.dto.CarrinhoRequestDTO;
import com.hardcore.pedidos.carrinho.dto.CarrinhoResponseDTO;
import com.hardcore.pedidos.carrinho.exception.CarrinhoNaoEncontradoException;
import com.hardcore.pedidos.carrinho.mapper.CarrinhoMapper;
import com.hardcore.pedidos.carrinho.model.Carrinho;
import com.hardcore.pedidos.carrinho.repository.CarrinhoRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class CarrinhoServiceUnitTest {

    private CarrinhoService carrinhoService;
    private FakeCarrinhoRepository fakeRepository;

    @BeforeEach
    void setUp() {

        fakeRepository = new FakeCarrinhoRepository();

        CarrinhoMapper mapper = new CarrinhoMapper() {

            @Override
            public Carrinho toEntity(CarrinhoRequestDTO dto) {
                Carrinho carrinho = new Carrinho();
                carrinho.setId(null);
                carrinho.setIdCliente(dto.getIdCliente());
                return carrinho;
            }

            @Override
            public CarrinhoResponseDTO toDTO(Carrinho carrinho) {
                return new CarrinhoResponseDTO(
                        carrinho.getId(),
                        carrinho.getIdCliente()
                );
            }
        };

        carrinhoService = new CarrinhoService(
                mapper,
                fakeRepository.getRepository()
        );
    }

    @Test
    @DisplayName("Deve criar carrinho para cliente que ainda não possui um")
    void deveCriarCarrinhoParaClienteSemCarrinho() {

        CarrinhoRequestDTO request = new CarrinhoRequestDTO();
        request.setIdCliente(1L);

        CarrinhoResponseDTO response =
                carrinhoService.criarCarrinho(request);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals(1L, response.getIdCliente());
        assertEquals(1, fakeRepository.getQuantidadeSalvos());
    }

    @Test
    @DisplayName("Não deve criar outro carrinho para cliente que já possui um")
    void naoDeveCriarCarrinhoDuplicado() {

        Carrinho existente = new Carrinho();
        existente.setId(1L);
        existente.setIdCliente(1L);

        fakeRepository.adicionarCarrinho(existente);

        CarrinhoRequestDTO request = new CarrinhoRequestDTO();
        request.setIdCliente(1L);

        assertThrows(
                IllegalStateException.class,
                () -> carrinhoService.criarCarrinho(request)
        );

        assertEquals(0, fakeRepository.getQuantidadeSalvos());
    }

    @Test
    @DisplayName("Deve buscar carrinho existente pelo ID do cliente")
    void deveBuscarCarrinhoExistente() {

        Carrinho carrinho = new Carrinho();
        carrinho.setId(10L);
        carrinho.setIdCliente(5L);

        fakeRepository.adicionarCarrinho(carrinho);

        CarrinhoResponseDTO response =
                carrinhoService.buscarCarrinhoPorCliente(5L);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals(5L, response.getIdCliente());
    }

    @Test
    @DisplayName("Deve lançar exceção quando o carrinho não existir")
    void deveLancarExcecaoQuandoCarrinhoNaoExistir() {

        assertThrows(
                CarrinhoNaoEncontradoException.class,
                () -> carrinhoService.buscarCarrinhoPorCliente(999L)
        );
    }

    // Repositório falso em memória: não acessa o banco de dados.
    static class FakeCarrinhoRepository {

        private final Map<Long, Carrinho> banco = new HashMap<>();
        private long sequencia = 1L;
        private int quantidadeSalvos = 0;

        private final CarrinhoRepository repository =
                (CarrinhoRepository) Proxy.newProxyInstance(
                        CarrinhoRepository.class.getClassLoader(),
                        new Class<?>[]{CarrinhoRepository.class},
                        (proxy, method, args) -> {

                            switch (method.getName()) {

                                case "findByIdCliente":
                                    Long idCliente = (Long) args[0];

                                    return banco.values()
                                            .stream()
                                            .filter(c -> c.getIdCliente()
                                                    .equals(idCliente))
                                            .findFirst();

                                case "save":
                                    Carrinho carrinho = (Carrinho) args[0];

                                    if (carrinho.getId() == null) {
                                        carrinho.setId(sequencia++);
                                    }

                                    banco.put(carrinho.getId(), carrinho);
                                    quantidadeSalvos++;

                                    return carrinho;

                                default:
                                    throw new UnsupportedOperationException(
                                            "Método não implementado no Fake: "
                                                    + method.getName()
                                    );
                            }
                        }
                );

        CarrinhoRepository getRepository() {
            return repository;
        }

        void adicionarCarrinho(Carrinho carrinho) {
            banco.put(carrinho.getId(), carrinho);
        }

        int getQuantidadeSalvos() {
            return quantidadeSalvos;
        }
    }
}
