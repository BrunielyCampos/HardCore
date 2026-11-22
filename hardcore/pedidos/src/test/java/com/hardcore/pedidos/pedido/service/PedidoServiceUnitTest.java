package com.hardcore.pedidos.pedido.service;

import com.hardcore.pedidos.integracao.UsuarioClient;
import com.hardcore.pedidos.pedido.dto.PedidoRequestDTO;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.exception.PedidoNaoEncontradoException;
import com.hardcore.pedidos.pedido.mapper.PedidoMapper;
import com.hardcore.pedidos.pedido.model.*;
import com.hardcore.pedidos.pedido.repository.PedidoRepository;
import com.hardcore.pedidos.rabbitmq.PedidoPagoEvent;
import com.hardcore.pedidos.rabbitmq.PedidoPagoProducer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class PedidoServiceUnitTest {

    private PedidoService pedidoService;
    private FakePedidoRepository pedidoRepo;

    @BeforeEach
    void setUp() {
        pedidoRepo = new FakePedidoRepository();

        PedidoMapper mapper = new PedidoMapper() {
            @Override
            public Pedido toEntity(PedidoRequestDTO dto) {
                Pedido p = new Pedido();
                p.setIdCliente(dto.getIdCliente());
                p.setValorCompra(dto.getValorCompra());
                p.setTipoPagamento(dto.getTipoPagamento());
                p.setDataCompra(LocalDateTime.now());
                p.setEstado(EstadoCompraEnum.A_COMPRAR);
                p.setEstadoPagamento(EstadoPagamentoEnum.PENDENTE);
                return p;
            }
            @Override
            public PedidoResponseDTO toDTO(Pedido p) {
                return new PedidoResponseDTO(
                        p.getId(), p.getIdCliente(), p.getValorCompra(), null,
                        p.getEstado(), p.getTipoPagamento(), p.getEstadoPagamento(),
                        p.getAbacatePayCheckoutId(), p.getUrlPagamento(), p.getIdEntregador()
                );
            }
        };

        UsuarioClient usuarioStub = new UsuarioClient("http://localhost:8081", null) {
            @Override public boolean validarEntregador(Long id) { return true; }
        };
        PedidoPagoProducer producerStub = new PedidoPagoProducer(null) {
            @Override public void publicar(PedidoPagoEvent event) {}
        };

        pedidoService = new PedidoService(mapper, pedidoRepo, usuarioStub, producerStub);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void autenticarCliente(Long idCliente) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "cliente@hardcore.com", null, List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));
        auth.setDetails(idCliente);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("RF10 / CT-COM-04: Deve criar pedido válido com pagamento PIX para o cliente autenticado")
    void deveCriarPedidoComPixParaClienteAutenticado() {
        autenticarCliente(1L);
        PedidoRequestDTO req = new PedidoRequestDTO();
        req.setIdCliente(1L);
        req.setValorCompra(350.00);
        req.setTipoPagamento(TipoPagamentoEnum.PIX);

        PedidoResponseDTO resp = pedidoService.criarPedido(req);

        assertNotNull(resp.getId());
        assertEquals(1L, resp.getIdCliente());
        assertEquals(TipoPagamentoEnum.PIX, resp.getTipoPagamento());
        assertEquals(EstadoCompraEnum.A_COMPRAR, resp.getEstado());
    }

    @Test
    @DisplayName("RNF5 / RBAC: Deve bloquear criação de pedido em nome de outro cliente")
    void deveBloquearCriacaoDePedidoParaOutroCliente() {
        autenticarCliente(1L);
        PedidoRequestDTO req = new PedidoRequestDTO();
        req.setIdCliente(99L); // ID diferente do autenticado
        req.setValorCompra(500.00);
        req.setTipoPagamento(TipoPagamentoEnum.CARTAO);

        assertThrows(ResponseStatusException.class, () -> pedidoService.criarPedido(req));
    }

    @Test
    @DisplayName("RF11 / RN07 / CT-COM-05: Deve cancelar pedido e alterar estado para COMPRA_CANCELADA")
    void deveCancelarPedidoExistente() {
        Pedido salvo = pedidoRepo.save(new Pedido(null, 1L, 200.0, LocalDateTime.now(),
                EstadoCompraEnum.A_CAMINHO, TipoPagamentoEnum.PIX, EstadoPagamentoEnum.PAGO,
                null, null, 7L, true, null));

        pedidoService.cancelarPedido(salvo.getId());

        assertEquals(EstadoCompraEnum.COMPRA_CANCELADA,
                pedidoRepo.findById(salvo.getId()).orElseThrow().getEstado());
    }

    @Test
    @DisplayName("Fluxo de Exceção: Deve lançar PedidoNaoEncontradoException ao buscar pedido inexistente")
    void deveLancarExcecaoParaPedidoInexistente() {
        assertThrows(PedidoNaoEncontradoException.class, () -> pedidoService.buscarPedidoPorId(999L));
    }

    static class FakePedidoRepository implements PedidoRepository {
        private final Map<Long, Pedido> db = new HashMap<>();
        private long seq = 1L;
        @Override public <S extends Pedido> S save(S p) { if (p.getId() == null) p.setId(seq++); db.put(p.getId(), p); return p; }
        @Override public Optional<Pedido> findById(Long id) { return Optional.ofNullable(db.get(id)); }
        @Override public List<Pedido> findByIdCliente(Long idCliente) {
            return db.values().stream().filter(p -> p.getIdCliente().equals(idCliente)).toList();
        }
        @Override public Optional<Pedido> findByAbacatePayCheckoutId(String id) { return Optional.empty(); }
        @Override public List<Pedido> findAll() { return new ArrayList<>(db.values()); }
        @Override public void flush() {}
        @Override public <S extends Pedido> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Pedido> List<S> saveAllAndFlush(Iterable<S> entities) { return List.of(); }
        @Override public void deleteAllInBatch(Iterable<Pedido> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> ids) {}
        @Override public void deleteAllInBatch() {}
        @Override public Pedido getOne(Long id) { return db.get(id); }
        @Override public Pedido getById(Long id) { return db.get(id); }
        @Override public Pedido getReferenceById(Long id) { return db.get(id); }
        @Override public <S extends Pedido> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Pedido> List<S> findAll(Example<S> example) { return List.of(); }
        @Override public <S extends Pedido> List<S> findAll(Example<S> example, Sort sort) { return List.of(); }
        @Override public <S extends Pedido> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends Pedido> long count(Example<S> example) { return 0; }
        @Override public <S extends Pedido> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Pedido, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Pedido> List<S> saveAll(Iterable<S> entities) { return List.of(); }
        @Override public List<Pedido> findAllById(Iterable<Long> ids) { return List.of(); }
        @Override public boolean existsById(Long id) { return db.containsKey(id); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(Long id) { db.remove(id); }
        @Override public void delete(Pedido entity) { db.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends Long> ids) {}
        @Override public void deleteAll(Iterable<? extends Pedido> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public List<Pedido> findAll(Sort sort) { return findAll(); }
        @Override public Page<Pedido> findAll(Pageable pageable) { return Page.empty(); }
    }
}