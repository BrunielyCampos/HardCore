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

    public PrateleiraService(PrateleiraRepository repository) {
        this.repository = repository;
    }

    public PrateleiraResponseDTO criarPrateleira(PrateleiraRequestDTO dto){
        Prateleira salva = repository.save(ToEntity(dto));

        return ToResponseDTo(salva);
    }

    public List<PrateleiraResponseDTO> listarPrateleira(){
        List<Prateleira> prateleiras = repository.findAll();

        return prateleiras.stream().map(this::ToResponseDTo).toList();
    }

    public PrateleiraResponseDTO listarProdutosPrateleiraById(Long id){
        Prateleira produto =
                repository.findByProdutosId(id).orElseThrow(() -> new PrateleiraNaoEncontradaException(id));

        return ToResponseDTo(produto);
    }

    @Transactional
    public PrateleiraResponseDTO transferirParaPrateleira(Long produtoId, int quantidade) {

        Estoque estoque =
                estoqueRepository.findByProdutoId(produtoId).orElseThrow(() -> new EstoqueNaoEncontradoException(produtoId));

        if (quantidade <= 0 || estoque.getQuantidadeProduto() < quantidade){
            throw new IllegalArgumentException("Quantidade passada invalida ou estoque do produto insuficiente.");
        }

        Prateleira pratAux = repository.findFirstByOrderByIdAsc().orElseThrow(PrateleiraNaoEncontradaException::new);

        Produto produto = estoque.getProduto();

        if (produto.getPrateleira() == null){
            produto.setPrateleira(pratAux);
            pratAux.getProdutos().add(produto);
        }

        estoque.setQuantidadeProduto(
                    estoque.getQuantidadeProduto() - quantidade);

           pratAux.setQuantidade_produto(pratAux.getQuantidade_produto() + quantidade);

            estoqueRepository.save(estoque);
            produtoRepository.save(produto);

        return ToResponseDTo(pratAux);
    }

    public void deleteProdutoPrateleira(Long produto_id){
       Produto produto =
               produtoRepository.findById(produto_id).orElseThrow(() -> new PrateleiraNaoEncontradaException(produto_id));
        if (p != 0){
            throw new IllegalArgumentException("Esse produto não pode ser deletado, ainda há unidade dele para a " +
                    "venda!");
        }


    }

    public Prateleira ToEntity(PrateleiraRequestDTO dto){
        return new Prateleira(null,dto.getQuantidade_produto());
    }

    public PrateleiraResponseDTO ToResponseDTo(Prateleira prat){
        PrateleiraResponseDTO dto = new PrateleiraResponseDTO();

        dto.setId(prat.getId());
        dto.setQuantidade_produto(prat.getQuantidade_produto());

        if (prat.getProdutos() != null) {
            List<Long> ids = prat.getProdutos().stream()
                    .map(Produto::getId)
                    .collect(Collectors.toList());
            dto.setProdutoIds(ids);
        }

        return dto;
    }
}
