package com.ifrn.hardcore.produto.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ifrn.hardcore.produto.DTO.ProdutoRequestDTO;
import com.ifrn.hardcore.produto.DTO.ProdutoResponseDTO;
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

    public List<ProdutoResponseDTO> listarTodos() {
        return repository.findAll().stream().map(this::ToResponseDTO).toList();
    }

    public ProdutoResponseDTO buscarPorId(Long id){
        Produto produto = repository.findById(id).orElseThrow(() -> new ProdutoNaoEncontradoException(id));
        return ToResponseDTO(produto);
    }

    public List<ProdutoResponseDTO> listarPorIds(List<Long> ids){
        List<Produto> produtos = repository.findAllById(ids);
        return produtos.stream().map(this::ToResponseDTO).toList();
    }

    public List<ProdutoResponseDTO> buscarPorCategoria(String categoria){
        List<Produto> produtos = repository.findByCategoriaAllIgnoreCase(categoria);
        return produtos.stream().map(this::ToResponseDTO).toList();
    }

    public List<ProdutoResponseDTO> buscarPorMarca(String marca){
        List<Produto> produtosMarca = repository.findByMarcaAllIgnoreCase(marca);
        return produtosMarca.stream().map(this::ToResponseDTO).toList();
    }


    public ProdutoResponseDTO cadastrarProduto(ProdutoRequestDTO dto){
        Produto salvo = repository.save(toEntity(dto));
        return ToResponseDTO(salvo);
    }

    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {

        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ProdutoNaoEncontradoException(id));

        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setCategoria(dto.getCategoria());
        produto.setPreco(dto.getPreco());

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
        return new Produto(null, dto.getNome(),dto.getMarca(), dto.getCategoria(), dto.getPreco(), null);
    }

    public ProdutoResponseDTO ToResponseDTO(Produto prod){
        Long idPrateleira = prod.getPrateleira() != null ? prod.getPrateleira().getId() : null;

        return new ProdutoResponseDTO(prod.getId(), prod.getNome(), prod.getMarca(), prod.getCategoria(), prod.getPreco(),
                idPrateleira);
    }
}