package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.PrateleiraNaoEncontradaException;
import com.ifrn.HardCore.ServicoProduto.exception.ProdutoNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.PrateleiraRepository;
import com.ifrn.HardCore.ServicoProduto.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private ProdutoRepository repository;
    private PrateleiraRepository prateleiraRepository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public List<ProdutoResponseDTO> ListarPorId(List<Long> ids){
        List<Produto> produtos = repository.findAllById(ids);

        return produtos.stream().map(this::ToResponseDTo).toList();
    }

    public List<ProdutoResponseDTO> BuscarPorCategoria(String categoria){

        List<Produto> produtos = repository.findByCategoriaAllIgnoreCase(categoria);

        return produtos.stream().map(this::ToResponseDTo).toList();
    }

    public  List<ProdutoResponseDTO> BuscarPorMarca(String marca){
        List<Produto> produtosMarca = repository.findByMarcaAllIgnoreCase(marca);

        return produtosMarca.stream().map(this::ToResponseDTo).toList();
    }

    public ProdutoResponseDTO buscarPorId(Long id){
        Produto produto = repository.findById(id).orElseThrow(() -> new ProdutoNaoEncontradoException(id));
        
        return ToResponseDTo(produto);
    }

    public ProdutoResponseDTO cadastrarProduto(ProdutoRequestDTO dto){
        Produto salvo = repository.save(ToEntity(dto));

        return ToResponseDTo(salvo);
    }

    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto){
        Produto produto = repository.findById(id).orElseThrow(() -> new ProdutoNaoEncontradoException(id));

        produto.setPreco(dto.getPreco());
        produto.setNome(dto.getNome());

        return ToResponseDTo(produto);
    }

    public void deletarPorId(Long id){
        repository.findById(id).orElseThrow(() -> new ProdutoNaoEncontradoException(id));
        repository.deleteById(id);
    }

    public Produto ToEntity(ProdutoRequestDTO dto){

        Prateleira prateleira =
                prateleiraRepository.findById(dto.getIdPrateleira()).orElseThrow(() -> new PrateleiraNaoEncontradaException(dto.getIdPrateleira()));

        return new  Produto(null, dto.getNome(), dto.getMarca(), dto.getCategoria(), dto.getPreco(), prateleira);
    }

    public ProdutoResponseDTO ToResponseDTo(Produto prod){
        Prateleira prateleira = prod.getPrateleira();
        Long idPrateleira = prateleira.getId();

        return new ProdutoResponseDTO(prod.getId(), prod.getNome(), prod.getCategoria(), prod.getMarca(), prod.getPreco(),
                idPrateleira);
    }
}
