package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.EstoqueNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.exception.ProdutoNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.EstoqueRepository;
import com.ifrn.HardCore.ServicoProduto.repository.ProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstoqueService {
    private EstoqueRepository repository;
    private ProdutoRepository produtoRepository;

    public EstoqueService(EstoqueRepository repository, ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
    }

    public EstoqueResponseDTO cadastrarEstoque(EstoqueRequestDTO dto){
        Estoque salvo = repository.save(toEntity(dto));

        if (repository.findByProdutoId(dto.getProduto_id()).isPresent()) {
            throw new IllegalArgumentException("Esse produto já possui um registro de estoque.");
        }

        return toResponseDTO(salvo);
    }

    public List<EstoqueResponseDTO> listarEstoque(){
        List<Estoque> estoques = repository.findAll();

        return estoques.stream().map(this::toResponseDTO).toList();
    }

    public EstoqueResponseDTO buscarPorId(Long id){
        Estoque estoque = repository.findById(id).orElseThrow(() -> new EstoqueNaoEncontradoException(id));

        return toResponseDTO(estoque);
    }

    public EstoqueResponseDTO atualizarQtdProduto(int quantidadeProduto, Long id_Produto){
        Estoque estoque =
                repository.findByProdutoId(id_Produto).orElseThrow(() -> new EstoqueNaoEncontradoException(id_Produto));

          estoque.setQuantidadeProduto(quantidadeProduto);
          Estoque salvo = repository.save(estoque);

          return toResponseDTO(salvo);
    }


    public List<EstoqueResponseDTO> listarPorMaiorQtdDispinivel(int qtd){
         if(qtd < 0) {
            throw new IllegalArgumentException("Quantidade passada Invalida!");
        }

         return repository.findByQuantidadeProdutoGreaterThanEqual(qtd).stream().map(this::toResponseDTO).toList();
    }


    public List<EstoqueResponseDTO> listarPorMenorQtdDispinivel(int qtd){
         if(qtd < 0) {
            throw new IllegalArgumentException("Quantidade passada Invalida!");
        }

        return repository.findByQuantidadeProdutoLessThanEqual(qtd).stream().map(this::toResponseDTO).toList();
    }

    public Estoque toEntity(@Valid EstoqueRequestDTO dto){
        Produto produto = produtoRepository.findById(dto.getProduto_id()).orElseThrow(() -> new ProdutoNaoEncontradoException(dto.getProduto_id()));
        return new Estoque (null, dto.getQuantidadeProduto(), produto);
    }

    public EstoqueResponseDTO toResponseDTO(Estoque estoque){
        Long produtoId = (estoque.getProduto() != null) ? estoque.getProduto().getId() : null;
        return new EstoqueResponseDTO(estoque.getId(), estoque.getQuantidadeProduto(), produtoId);
    }
}
