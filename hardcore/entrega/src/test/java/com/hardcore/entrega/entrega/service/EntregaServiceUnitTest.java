package com.hardcore.entrega.entrega.service;

import com.hardcore.entrega.entrega.dto.EntregaRequestDTO;
import com.hardcore.entrega.entrega.dto.EntregaResponseDTO;
import com.hardcore.entrega.entrega.exception.EntregaNaoEncontradaException;
import com.hardcore.entrega.entrega.mapper.EntregaMapper;
import com.hardcore.entrega.entrega.model.Entrega;
import com.hardcore.entrega.entrega.model.EntregaEnum;
import com.hardcore.entrega.entrega.repository.EntregaRepository;
import com.hardcore.entrega.integracao.UsuarioClient;
import com.hardcore.entrega.rabbitmq.EntregaStatusProducer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;

import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class EntregaServiceUnitTest {

    private EntregaService entregaService;
    private FakeEntregaRepository entregaRepo;

    @BeforeEach
    void setUp() {
        entregaRepo = new FakeEntregaRepository();

        EntregaMapper mapper = new EntregaMapper() {
            @Override
            public Entrega toEntity(EntregaRequestDTO dto) {
                return new Entrega(null, dto.getIdPedido(), dto.getIdEntregador(),
                        dto.getEnderecoDestino(), EntregaEnum.PENDENTE, null);
            }
            @Override
            public EntregaResponseDTO toDTO(Entrega e) {
                EntregaResponseDTO dto = new EntregaResponseDTO();
                dto.setId(e.getId());
                dto.setIdPedido(e.getIdPedido());
                dto.setIdEntregador(e.getIdEntregador());
                dto.setEnderecoDestino(e.getEnderecoDestino());
                dto.setEstadoEntrega(e.getEstadoEntrega());
                dto.setConfirmacaoCliente(e.getConfirmacaoCliente());
                return dto;
            }
        };

        // Stubs simples sem Mockito para dependências externas
        NotificacaoEntregaProducer notifStub = new NotificacaoEntregaProducer(null) {
            @Override public void enviarNotificacaoParaEntregador(Long idEntregador, String mensagem) {}
        };
        UsuarioClient usuarioStub = new UsuarioClient("http://localhost:8081", null) {
            @Override public void validarEntregador(Long id) {}
        };
        EntregaStatusProducer statusStub = new EntregaStatusProducer(null) {
            @Override public void publicar(Entrega entrega) {}
        };

        entregaService = new EntregaService(mapper, entregaRepo, notifStub, usuarioStub, statusStub);
    }

    @Test
    @DisplayName("RF12 / CT-ENT-02: Deve atribuir entrega com endereço de destino")
    void deveAtribuirEntregaComEndereco() {
        EntregaRequestDTO req = new EntregaRequestDTO();
        req.setIdPedido(100L);
        req.setIdEntregador(7L);
        req.setEnderecoDestino("Rua das Flores, 120, Nova Cruz - RN");

        EntregaResponseDTO resp = entregaService.atribuirEntrega(req);

        assertNotNull(resp.getId());
        assertEquals(100L, resp.getIdPedido());
        assertEquals("Rua das Flores, 120, Nova Cruz - RN", resp.getEnderecoDestino());
    }

    @Test
    @DisplayName("RN08 / CT-ENT-05 e CT-ENT-08: Polegar positivo do cliente deve atualizar para ENTREGA_FEITA")
    void deveAtualizarParaEntregaFeitaQuandoClienteConfirmaPositivo() {
        Entrega e = entregaRepo.save(new Entrega(null, 101L, 7L, "Rua A, 10", EntregaEnum.EM_ENTREGA, null));

        entregaService.confirmarRecebimento(e.getId(), true);

        Entrega atualizada = entregaRepo.findById(e.getId()).orElseThrow();
        assertTrue(atualizada.getConfirmacaoCliente());
        assertEquals(EntregaEnum.ENTREGA_FEITA, atualizada.getEstadoEntrega());
    }

    @Test
    @DisplayName("RN08 / CT-ENT-06: Polegar negativo do cliente deve manter estado EM_ENTREGA")
    void deveManterEmEntregaQuandoClienteConfirmaNegativo() {
        Entrega e = entregaRepo.save(new Entrega(null, 102L, 7L, "Rua B, 20", EntregaEnum.EM_ENTREGA, null));

        entregaService.confirmarRecebimento(e.getId(), false);

        Entrega atualizada = entregaRepo.findById(e.getId()).orElseThrow();
        assertFalse(atualizada.getConfirmacaoCliente());
        assertEquals(EntregaEnum.EM_ENTREGA, atualizada.getEstadoEntrega());
    }

    @Test
    @DisplayName("RF15 / CT-ENT-07: Notificação do entregador deve marcar entrega como ENTREGA_FEITA")
    void deveMarcarEntregaFeitaQuandoEntregadorNotifica() {
        Entrega e = entregaRepo.save(new Entrega(null, 103L, 7L, "Rua C, 30", EntregaEnum.EM_ENTREGA, null));

        entregaService.notificarEntregaEfetuada(e.getId());

        assertEquals(EntregaEnum.ENTREGA_FEITA, entregaRepo.findById(e.getId()).orElseThrow().getEstadoEntrega());
    }

    @Test
    @DisplayName("Fluxo de Exceção: Deve lançar EntregaNaoEncontradaException para ID inexistente")
    void deveLancarExcecaoParaEntregaInexistente() {
        assertThrows(
                EntregaNaoEncontradaException.class,
                () -> entregaService.confirmarRecebimento(999L, true)
        );
    }

    @Test
    @DisplayName("Deve buscar entrega pelo ID do pedido")
    void deveBuscarEntregaPorPedido() {
        Entrega entrega = entregaRepo.save(
                new Entrega(null, 104L, 8L, "Rua D, 40", EntregaEnum.PENDENTE, null)
        );

        EntregaResponseDTO resposta =
                entregaService.buscarEntregaPorPedido(104L);

        assertNotNull(resposta);
        assertEquals(entrega.getId(), resposta.getId());
        assertEquals(104L, resposta.getIdPedido());
    }

    @Test
    @DisplayName("Deve lançar exceção quando não encontrar entrega pelo pedido")
    void deveLancarExcecaoQuandoEntregaDoPedidoNaoExistir() {
        assertThrows(
                EntregaNaoEncontradaException.class,
                () -> entregaService.buscarEntregaPorPedido(999L)
        );
    }

    @Test
    @DisplayName("Deve listar entregas de um entregador")
    void deveBuscarEntregasPorEntregador() {
        entregaRepo.save(
                new Entrega(null, 105L, 8L, "Rua E, 50", EntregaEnum.PENDENTE, null)
        );

        entregaRepo.save(
                new Entrega(null, 106L, 8L, "Rua F, 60", EntregaEnum.EM_ENTREGA, null)
        );

        List<EntregaResponseDTO> resultado =
                entregaService.buscarPorEntregador(8L);

        assertEquals(2, resultado.size());
        assertEquals(105L, resultado.get(0).getIdPedido());
        assertEquals(106L, resultado.get(1).getIdPedido());
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando entregador não possuir entregas")
    void deveRetornarListaVaziaQuandoNaoExistiremEntregas() {
        List<EntregaResponseDTO> resultado =
                entregaService.buscarPorEntregador(999L);

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("Deve cancelar uma entrega")
    void deveCancelarEntrega() {
        Entrega entrega = entregaRepo.save(
                new Entrega(null, 107L, 9L, "Rua G, 70", EntregaEnum.EM_ENTREGA, null)
        );

        entregaService.cancelarEntrega(entrega.getId());

        Entrega atualizada =
                entregaRepo.findById(entrega.getId()).orElseThrow();

        assertEquals(EntregaEnum.CANCELADA, atualizada.getEstadoEntrega());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cancelar entrega inexistente")
    void deveLancarExcecaoAoCancelarEntregaInexistente() {
        assertThrows(
                EntregaNaoEncontradaException.class,
                () -> entregaService.cancelarEntrega(999L)
        );
    }


    static class FakeEntregaRepository implements EntregaRepository {
        private final Map<Long, Entrega> db = new HashMap<>();
        private long seq = 1L;
        @Override public <S extends Entrega> S save(S e) { if (e.getId() == null) e.setId(seq++); db.put(e.getId(), e); return e; }
        @Override public Optional<Entrega> findById(Long id) { return Optional.ofNullable(db.get(id)); }
        @Override public Optional<Entrega> findByIdPedido(Long idPedido) {
            return db.values().stream().filter(e -> e.getIdPedido().equals(idPedido)).findFirst();
        }
        @Override public List<Entrega> findByIdEntregador(Long idEntregador) {
            return db.values().stream().filter(e -> e.getIdEntregador().equals(idEntregador)).toList();
        }
        @Override public List<Entrega> findAll() { return new ArrayList<>(db.values()); }
        @Override public void flush() {}
        @Override public <S extends Entrega> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Entrega> List<S> saveAllAndFlush(Iterable<S> entities) { return List.of(); }
        @Override public void deleteAllInBatch(Iterable<Entrega> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> ids) {}
        @Override public void deleteAllInBatch() {}
        @Override public Entrega getOne(Long id) { return db.get(id); }
        @Override public Entrega getById(Long id) { return db.get(id); }
        @Override public Entrega getReferenceById(Long id) { return db.get(id); }
        @Override public <S extends Entrega> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Entrega> List<S> findAll(Example<S> example) { return List.of(); }
        @Override public <S extends Entrega> List<S> findAll(Example<S> example, Sort sort) { return List.of(); }
        @Override public <S extends Entrega> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends Entrega> long count(Example<S> example) { return 0; }
        @Override public <S extends Entrega> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Entrega, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Entrega> List<S> saveAll(Iterable<S> entities) { return List.of(); }
        @Override public List<Entrega> findAllById(Iterable<Long> ids) { return List.of(); }
        @Override public boolean existsById(Long id) { return db.containsKey(id); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(Long id) { db.remove(id); }
        @Override public void delete(Entrega entity) { db.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends Long> ids) {}
        @Override public void deleteAll(Iterable<? extends Entrega> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public List<Entrega> findAll(Sort sort) { return findAll(); }
        @Override public Page<Entrega> findAll(Pageable pageable) { return Page.empty(); }
    }
}