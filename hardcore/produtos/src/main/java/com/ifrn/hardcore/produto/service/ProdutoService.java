package com.ifrn.hardcore.produto.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ifrn.hardcore.produto.DTO.ProdutoRequestDTO;
import com.ifrn.hardcore.produto.DTO.ProdutoResponseDTO;
import com.ifrn.hardcore.produto.Entity.AvaliacaoCliente;
import com.ifrn.hardcore.produto.Entity.Estoque;
import com.ifrn.hardcore.produto.Entity.Produto;
import com.ifrn.hardcore.produto.exception.ProdutoNaoEncontradoException;
import com.ifrn.hardcore.produto.repository.EstoqueRepository;
import com.ifrn.hardcore.produto.repository.PrateleiraRepository;
import com.ifrn.hardcore.produto.repository.ProdutoRepository;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;
    private final PrateleiraRepository prateleiraRepository;
    private final EstoqueRepository estoqueRepository;

    public ProdutoService(ProdutoRepository repository, PrateleiraRepository prateleiraRepository, EstoqueRepository estoqueRepository) {
        this.repository = repository;
        this.prateleiraRepository = prateleiraRepository;
        this.estoqueRepository = estoqueRepository;
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarTodos() {
        return repository.findAll().stream().map(this::ToResponseDTO).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = repository.findById(id).orElseThrow(() -> new ProdutoNaoEncontradoException(id));
        return ToResponseDTO(produto);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarPorIds(List<Long> ids) {
        List<Produto> produtos = repository.findAllById(ids);
        return produtos.stream().map(this::ToResponseDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> buscarPorCategoria(String categoria) {
        List<Produto> produtos = repository.findByCategoriaAllIgnoreCase(categoria);
        return produtos.stream().map(this::ToResponseDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> buscarPorMarca(String marca) {
        List<Produto> produtosMarca = repository.findByMarcaAllIgnoreCase(marca);
        return produtosMarca.stream().map(this::ToResponseDTO).toList();
    }

    public ProdutoResponseDTO cadastrarProduto(ProdutoRequestDTO dto) {
        Produto salvo = repository.save(toEntity(dto));
        return ToResponseDTO(salvo);
    }

    @Transactional
    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ProdutoNaoEncontradoException(id));

        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setCategoria(dto.getCategoria());
        produto.setPreco(dto.getPreco());
        produto.setImagemPrincipal(dto.getImagemPrincipal());

        Produto salvo = repository.save(produto);
        return ToResponseDTO(salvo);
    }

    @Transactional
    public void deletarPorId(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ProdutoNaoEncontradoException(id));

        Estoque estoque = estoqueRepository.findByProdutoId(id).orElse(null);
        if (estoque != null && estoque.getQuantidadeProduto() > 0) {
            throw new IllegalArgumentException(
                    "Não é possível excluir um produto que possui quantidade em estoque."
            );
        }

        if (produto.getPrateleira() != null) {
            if (produto.getPrateleira().getQuantidade_produto() > 0) {
                throw new IllegalArgumentException(
                        "Não é possível excluir um produto que ainda possui unidades na prateleira."
                );
            }
            prateleiraRepository.delete(produto.getPrateleira());
        }

        if (estoque != null) {
            estoqueRepository.delete(estoque);
        }
        repository.delete(produto);
    }

    public Produto toEntity(ProdutoRequestDTO dto) {
        return new Produto(
                null,
                dto.getNome(),
                dto.getMarca(),
                dto.getCategoria(),
                dto.getPreco(),
                dto.getImagemPrincipal(),
                null
        );
    }

    public ProdutoResponseDTO ToResponseDTO(Produto prod) {
        Long idPrateleira = prod.getPrateleira() != null ? prod.getPrateleira().getId() : null;

        List<AvaliacaoCliente> avals = prod.getAvaliacoes();
        int totalAvaliacoes = (avals != null) ? avals.size() : 0;
        double mediaAvaliacoes = 0.0;

        if (totalAvaliacoes > 0) {
            mediaAvaliacoes = avals.stream()
                    .filter(a -> a.getAvaliacao() != null)
                    .mapToInt(AvaliacaoCliente::getAvaliacao)
                    .average()
                    .orElse(0.0);
        }

        return new ProdutoResponseDTO(
                prod.getId(),
                prod.getNome(),
                prod.getMarca(),
                prod.getCategoria(),
                prod.getPreco(),
                prod.getImagemPrincipal(),
                idPrateleira,
                mediaAvaliacoes,
                totalAvaliacoes
        );
    }
}