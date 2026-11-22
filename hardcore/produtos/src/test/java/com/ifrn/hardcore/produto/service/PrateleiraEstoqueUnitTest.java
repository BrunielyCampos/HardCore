package com.ifrn.hardcore.produto.service;

import com.ifrn.hardcore.produto.DTO.EstoqueRequestDTO;
import com.ifrn.hardcore.produto.DTO.EstoqueResponseDTO;
import com.ifrn.hardcore.produto.DTO.PrateleiraResponseDTO;
import com.ifrn.hardcore.produto.Entity.Estoque;
import com.ifrn.hardcore.produto.Entity.Prateleira;
import com.ifrn.hardcore.produto.Entity.Produto;
import com.ifrn.hardcore.produto.repository.EstoqueRepository;
import com.ifrn.hardcore.produto.repository.PrateleiraRepository;
import com.ifrn.hardcore.produto.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;

import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class PrateleiraEstoqueUnitTest {

    private EstoqueService estoqueService;
    private PrateleiraService prateleiraService;
    private Produto produtoBase;

    @BeforeEach
    void setUp() {
        FakeProdutoRepository produtoRepo = new FakeProdutoRepository();
        FakeEstoqueRepository estoqueRepo = new FakeEstoqueRepository();
        FakePrateleiraRepository prateleiraRepo = new FakePrateleiraRepository();

        produtoBase = new Produto(1L, "SSD SATA 480GB Kingston", "Kingston", "Armazenamento", 249.90, null);
        produtoRepo.save(produtoBase);

        estoqueService = new EstoqueService(estoqueRepo, produtoRepo);
        prateleiraService = new PrateleiraService(prateleiraRepo, estoqueRepo, produtoRepo);
    }

    @Test
    @DisplayName("RF5 / CT-EST-01: Deve cadastrar estoque inicial para um produto")
    void deveCadastrarEstoqueParaProduto() {
        EstoqueResponseDTO resp = estoqueService.cadastrarEstoque(new EstoqueRequestDTO(20, 1L));

        assertNotNull(resp.getId());
        assertEquals(20, resp.getQuantidadeProduto());
        assertEquals(1L, resp.getProduto_id());
    }

    @Test
    @DisplayName("RF5 / Fluxo de Exceção: Deve impedir cadastro duplicado de estoque para o mesmo produto")
    void deveImpedirCadastroDuplicadoDeEstoque() {
        estoqueService.cadastrarEstoque(new EstoqueRequestDTO(10, 1L));

        IllegalArgumentException erro = assertThrows(
                IllegalArgumentException.class,
                () -> estoqueService.cadastrarEstoque(new EstoqueRequestDTO(5, 1L))
        );

        assertEquals("Esse produto já possui um registro de estoque.", erro.getMessage());
    }

    @Test
    @DisplayName("RF8 / CT-EST-05: Deve transferir unidades do estoque para a prateleira")
    void deveTransferirDoEstoqueParaPrateleira() {
        estoqueService.cadastrarEstoque(new EstoqueRequestDTO(20, 1L));

        PrateleiraResponseDTO pratResp = prateleiraService.transferirParaPrateleira(1L, 5);
        EstoqueResponseDTO estResp = estoqueService.buscarPorProdutoId(1L);

        assertEquals(5, pratResp.getQuantidade_produto());
        assertEquals(15, estResp.getQuantidadeProduto());
    }

    @Test
    @DisplayName("RF8 / CT-EST-09: Deve recusar transferência acima do saldo disponível no estoque")
    void deveRecusarTransferenciaAcimaDoSaldoEstoque() {
        estoqueService.cadastrarEstoque(new EstoqueRequestDTO(6, 1L));

        IllegalArgumentException erro = assertThrows(
                IllegalArgumentException.class,
                () -> prateleiraService.transferirParaPrateleira(1L, 7)
        );

        assertEquals("Quantidade inválida ou estoque insuficiente.", erro.getMessage());
        assertEquals(6, estoqueService.buscarPorProdutoId(1L).getQuantidadeProduto());
    }

    @Test
    @DisplayName("RF6: Deve impedir exclusão de item da prateleira enquanto houver saldo > 0")
    void deveImpedirExclusaoDePrateleiraComSaldoPositivo() {
        estoqueService.cadastrarEstoque(new EstoqueRequestDTO(10, 1L));
        prateleiraService.transferirParaPrateleira(1L, 3);

        IllegalArgumentException erro = assertThrows(
                IllegalArgumentException.class,
                () -> prateleiraService.deleteProdutoPrateleira(1L)
        );

        assertTrue(erro.getMessage().contains("não pode ser deletado"));
    }

    // --- Repositórios Fake em Memória (JUnit 5 puro, sem Mockito) ---
    static class FakeProdutoRepository implements ProdutoRepository {
        private final Map<Long, Produto> db = new HashMap<>();
        @Override public <S extends Produto> S save(S entity) { db.put(entity.getId(), entity); return entity; }
        @Override public Optional<Produto> findById(Long id) { return Optional.ofNullable(db.get(id)); }
        @Override public List<Produto> findByCategoriaAllIgnoreCase(String c) { return List.of(); }
        @Override public List<Produto> findByMarcaAllIgnoreCase(String m) { return List.of(); }
        @Override public List<Produto> findAll() { return new ArrayList<>(db.values()); }
        @Override public void flush() {}
        @Override public <S extends Produto> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Produto> List<S> saveAllAndFlush(Iterable<S> entities) { return List.of(); }
        @Override public void deleteAllInBatch(Iterable<Produto> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> ids) {}
        @Override public void deleteAllInBatch() {}
        @Override public Produto getOne(Long id) { return db.get(id); }
        @Override public Produto getById(Long id) { return db.get(id); }
        @Override public Produto getReferenceById(Long id) { return db.get(id); }
        @Override public <S extends Produto> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Produto> List<S> findAll(Example<S> example) { return List.of(); }
        @Override public <S extends Produto> List<S> findAll(Example<S> example, Sort sort) { return List.of(); }
        @Override public <S extends Produto> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends Produto> long count(Example<S> example) { return 0; }
        @Override public <S extends Produto> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Produto, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Produto> List<S> saveAll(Iterable<S> entities) { return List.of(); }
        @Override public List<Produto> findAllById(Iterable<Long> ids) { return List.of(); }
        @Override public boolean existsById(Long id) { return db.containsKey(id); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(Long id) { db.remove(id); }
        @Override public void delete(Produto entity) { db.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends Long> ids) {}
        @Override public void deleteAll(Iterable<? extends Produto> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public List<Produto> findAll(Sort sort) { return findAll(); }
        @Override public Page<Produto> findAll(Pageable pageable) { return Page.empty(); }
    }

    static class FakeEstoqueRepository implements EstoqueRepository {
        private final Map<Long, Estoque> db = new HashMap<>();
        private long seq = 1L;
        @Override public <S extends Estoque> S save(S e) { if (e.getId() == null) e.setId(seq++); db.put(e.getId(), e); return e; }
        @Override public Optional<Estoque> findByProdutoId(Long produtoId) {
            return db.values().stream().filter(e -> e.getProduto() != null && e.getProduto().getId().equals(produtoId)).findFirst();
        }
        @Override public int reservarQuantidade(Long produtoId, int quantidade) { return 0; }
        @Override public int liberarQuantidade(Long produtoId, int quantidade) { return 0; }
        @Override public List<Estoque> findAllByOrderByQuantidadeProdutoAsc(Pageable pageable) { return List.of(); }
        @Override public List<Estoque> findAllByOrderByQuantidadeProdutoDesc(Pageable pageable) { return List.of(); }
        @Override public List<Estoque> findAll() { return new ArrayList<>(db.values()); }
        @Override public Optional<Estoque> findById(Long id) { return Optional.ofNullable(db.get(id)); }
        @Override public void flush() {}
        @Override public <S extends Estoque> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Estoque> List<S> saveAllAndFlush(Iterable<S> entities) { return List.of(); }
        @Override public void deleteAllInBatch(Iterable<Estoque> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> ids) {}
        @Override public void deleteAllInBatch() {}
        @Override public Estoque getOne(Long id) { return db.get(id); }
        @Override public Estoque getById(Long id) { return db.get(id); }
        @Override public Estoque getReferenceById(Long id) { return db.get(id); }
        @Override public <S extends Estoque> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Estoque> List<S> findAll(Example<S> example) { return List.of(); }
        @Override public <S extends Estoque> List<S> findAll(Example<S> example, Sort sort) { return List.of(); }
        @Override public <S extends Estoque> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends Estoque> long count(Example<S> example) { return 0; }
        @Override public <S extends Estoque> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Estoque, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Estoque> List<S> saveAll(Iterable<S> entities) { return List.of(); }
        @Override public List<Estoque> findAllById(Iterable<Long> ids) { return List.of(); }
        @Override public boolean existsById(Long id) { return db.containsKey(id); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(Long id) { db.remove(id); }
        @Override public void delete(Estoque entity) { db.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends Long> ids) {}
        @Override public void deleteAll(Iterable<? extends Estoque> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public List<Estoque> findAll(Sort sort) { return findAll(); }
        @Override public Page<Estoque> findAll(Pageable pageable) { return Page.empty(); }
    }

    static class FakePrateleiraRepository implements PrateleiraRepository {
        private final Map<Long, Prateleira> db = new HashMap<>();
        private long seq = 1L;
        @Override public <S extends Prateleira> S save(S p) { if (p.getId() == null) p.setId(seq++); db.put(p.getId(), p); return p; }
        @Override public Optional<Prateleira> findByProdutoId(Long id) {
            return db.values().stream().filter(p -> p.getProduto() != null && p.getProduto().getId().equals(id)).findFirst();
        }
        @Override public Optional<Prateleira> findFirstByOrderByIdAsc() { return db.values().stream().findFirst(); }
        @Override public void delete(Prateleira entity) { db.remove(entity.getId()); }
        @Override public List<Prateleira> findAll() { return new ArrayList<>(db.values()); }
        @Override public Optional<Prateleira> findById(Long id) { return Optional.ofNullable(db.get(id)); }
        @Override public void flush() {}
        @Override public <S extends Prateleira> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Prateleira> List<S> saveAllAndFlush(Iterable<S> entities) { return List.of(); }
        @Override public void deleteAllInBatch(Iterable<Prateleira> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> ids) {}
        @Override public void deleteAllInBatch() {}
        @Override public Prateleira getOne(Long id) { return db.get(id); }
        @Override public Prateleira getById(Long id) { return db.get(id); }
        @Override public Prateleira getReferenceById(Long id) { return db.get(id); }
        @Override public <S extends Prateleira> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Prateleira> List<S> findAll(Example<S> example) { return List.of(); }
        @Override public <S extends Prateleira> List<S> findAll(Example<S> example, Sort sort) { return List.of(); }
        @Override public <S extends Prateleira> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends Prateleira> long count(Example<S> example) { return 0; }
        @Override public <S extends Prateleira> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Prateleira, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Prateleira> List<S> saveAll(Iterable<S> entities) { return List.of(); }
        @Override public List<Prateleira> findAllById(Iterable<Long> ids) { return List.of(); }
        @Override public boolean existsById(Long id) { return db.containsKey(id); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(Long id) { db.remove(id); }
        @Override public void deleteAllById(Iterable<? extends Long> ids) {}
        @Override public void deleteAll(Iterable<? extends Prateleira> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public List<Prateleira> findAll(Sort sort) { return findAll(); }
        @Override public Page<Prateleira> findAll(Pageable pageable) { return Page.empty(); }
    }
}