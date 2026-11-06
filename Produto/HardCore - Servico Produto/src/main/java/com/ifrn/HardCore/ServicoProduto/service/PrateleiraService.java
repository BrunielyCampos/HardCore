package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.EstoqueResponseDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.EstoqueNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.exception.PrateleiraNaoEncontradaException;
import com.ifrn.HardCore.ServicoProduto.exception.ProdutoNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.EstoqueRepository;
import com.ifrn.HardCore.ServicoProduto.repository.PrateleiraRepository;
import com.ifrn.HardCore.ServicoProduto.repository.ProdutoRepository;
import org.hibernate.sql.Delete;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrateleiraService {
    private PrateleiraRepository repository;
    private EstoqueRepository estoqueRepository;
    private ProdutoRepository produtoRepository;

    public PrateleiraService(PrateleiraRepository repository, EstoqueRepository estoqueRepository, ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.estoqueRepository = estoqueRepository;
        this.produtoRepository = produtoRepository;
    }

    public PrateleiraResponseDTO criarPrateleira(PrateleiraRequestDTO dto){
        return transferirParaPrateleira(dto.getProdutoId(), dto.getQuantidade_produto());
    }

    public List<PrateleiraResponseDTO> listarPrateleira(){
        List<Prateleira> prateleiras = repository.findAll();

        return prateleiras.stream().map(this::ToResponseDTo).toList();
    }

    public PrateleiraResponseDTO listarProdutosPrateleiraById(Long id){
        Prateleira produto =
                repository.findByProdutoId(id).orElseThrow(() -> new PrateleiraNaoEncontradaException(id));

        return ToResponseDTo(produto);
    }

    @Transactional
    public PrateleiraResponseDTO transferirParaPrateleira(Long produtoId, int quantidade) {

        Estoque estoque = estoqueRepository.findByProdutoId(produtoId)
                .orElseThrow(() -> new EstoqueNaoEncontradoException(produtoId));

        if (quantidade <= 0 || estoque.getQuantidadeProduto() < quantidade) {
            throw new IllegalArgumentException(
                    "Quantidade inválida ou estoque insuficiente."
            );
        }

        Produto produto = estoque.getProduto();

        Prateleira prateleira = repository.findByProdutoId(produtoId)
                .orElse(null);

        if (prateleira == null) {
            prateleira = new Prateleira(null, quantidade, produto);
        } else {
            prateleira.setQuantidade_produto(
                    prateleira.getQuantidade_produto() + quantidade
            );
        }

        produto.setPrateleira(prateleira);

        estoque.setQuantidadeProduto(
                estoque.getQuantidadeProduto() - quantidade
        );

        repository.save(prateleira);
        estoqueRepository.save(estoque);

        return ToResponseDTo(prateleira);
    }

    public void deleteProdutoPrateleira(Long produto_id){
        Prateleira prateleira = repository.findByProdutoId(produto_id)
                .orElseThrow(() -> new PrateleiraNaoEncontradaException(produto_id));

        if (prateleira.getQuantidade_produto() > 0) {
            throw new IllegalArgumentException(
                    "Esse produto não pode ser deletado, ainda há unidades dele disponíveis para venda!"
            );
        }

        repository.delete(prateleira);
    }

    public Prateleira ToEntity(PrateleiraRequestDTO dto) {
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new ProdutoNaoEncontradoException(dto.getProdutoId()));

        return new Prateleira(null, dto.getQuantidade_produto(), produto);
    }

    public PrateleiraResponseDTO ToResponseDTo(Prateleira prat) {
        PrateleiraResponseDTO dto = new PrateleiraResponseDTO();

        dto.setId(prat.getId());
        dto.setQuantidade_produto(prat.getQuantidade_produto());
        dto.setProdutoId(prat.getProduto().getId());

        return dto;
    }
}
