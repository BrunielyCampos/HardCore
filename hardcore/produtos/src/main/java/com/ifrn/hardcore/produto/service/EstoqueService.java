package com.ifrn.hardcore.produto.service;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ifrn.hardcore.produto.DTO.EstoqueRequestDTO;
import com.ifrn.hardcore.produto.DTO.EstoqueResponseDTO;
import com.ifrn.hardcore.produto.Entity.Estoque;
import com.ifrn.hardcore.produto.Entity.Produto;
import com.ifrn.hardcore.produto.exception.EstoqueNaoEncontradoException;
import com.ifrn.hardcore.produto.exception.ProdutoNaoEncontradoException;
import com.ifrn.hardcore.produto.repository.EstoqueRepository;
import com.ifrn.hardcore.produto.repository.ProdutoRepository;
import java.util.List;

@Service
public class EstoqueService {
    private final EstoqueRepository repository;
    private final ProdutoRepository produtoRepository;

    public EstoqueService(EstoqueRepository repository, ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
    }

    
    @Transactional
    public EstoqueResponseDTO cadastrarEstoque(EstoqueRequestDTO dto) {
    
        if (repository.findByProdutoId(dto.getProduto_id()).isPresent()) {
            throw new IllegalArgumentException(
                "Esse produto já possui um registro de estoque."
            );
        }
    
        Estoque estoque = toEntity(dto);
        Estoque salvo = repository.save(estoque);
    
        return toResponseDTO(salvo);
    }


    public List<EstoqueResponseDTO> listarEstoque(){
        List<Estoque> estoques = repository.findAll();

        return estoques.stream().map(this::toResponseDTO).toList();
    }

    public EstoqueResponseDTO buscarPorProdutoId(Long produtoId){
        Estoque estoque = repository.findByProdutoId(produtoId)
                .orElseThrow(() -> new EstoqueNaoEncontradoException(produtoId));
        return toResponseDTO(estoque);
    }

    public EstoqueResponseDTO atualizarQtdProduto(int quantidadeProduto, Long id_Produto){
        if (quantidadeProduto < 0) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser negativa.");
        }
        Estoque estoque = repository.findByProdutoId(id_Produto)
                .orElseThrow(() -> new EstoqueNaoEncontradoException(id_Produto));

        estoque.setQuantidadeProduto(quantidadeProduto);
          Estoque salvo = repository.save(estoque);

          return toResponseDTO(salvo);
    }
  
    public List<EstoqueResponseDTO> listarPorMaiorQtdDisponivel(int qtd) {
        if (qtd <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }

        return repository.findAllByOrderByQuantidadeProdutoDesc(
                org.springframework.data.domain.PageRequest.of(0, qtd)
        ).stream().map(this::toResponseDTO).toList();
    }

    public List<EstoqueResponseDTO> listarPorMenorQtdDisponivel(int qtd) {
        if (qtd <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }
    
        return repository.findAllByOrderByQuantidadeProdutoAsc(
                org.springframework.data.domain.PageRequest.of(0, qtd)
        ).stream().map(this::toResponseDTO).toList();
    }

    public Estoque toEntity(@Valid EstoqueRequestDTO dto){
        Produto produto = produtoRepository.findById(dto.getProduto_id()).orElseThrow(() -> new ProdutoNaoEncontradoException(dto.getProduto_id()));
        return new Estoque (null, dto.getQuantidadeProduto(), produto);
    }

    @Transactional
    public void reservarEstoque(Long produtoId, int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade para reserva deve ser maior que zero.");
        }
        int atualizados = repository.reservarQuantidade(produtoId, quantidade);
        if (atualizados == 0) {
            throw new IllegalArgumentException("Produto sem estoque suficiente: " + produtoId);
        }
    }

    @Transactional
    public void liberarEstoque(Long produtoId, int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade para liberação deve ser maior que zero.");
        }
        int atualizados = repository.liberarQuantidade(produtoId, quantidade);
        if (atualizados == 0) {
            throw new EstoqueNaoEncontradoException(produtoId);
        }
    }

    public EstoqueResponseDTO toResponseDTO(Estoque estoque){
        Long produtoId = (estoque.getProduto() != null) ? estoque.getProduto().getId() : null;
        return new EstoqueResponseDTO(estoque.getId(), estoque.getQuantidadeProduto(), produtoId);
    }
}