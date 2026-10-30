package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.ProdutoNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.EstoqueRepository;
import com.ifrn.HardCore.ServicoProduto.repository.ProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

@Service
public class EstoqueService {
    private EstoqueRepository repository;
    private ProdutoRepository produtoRepository;

    public EstoqueService(EstoqueRepository estoque) {

        this.repository = estoque;
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
