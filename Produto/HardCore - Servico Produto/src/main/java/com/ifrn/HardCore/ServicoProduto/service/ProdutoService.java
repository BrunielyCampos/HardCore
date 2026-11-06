package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.EstoqueNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.exception.ProdutoNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.EstoqueRepository;
import com.ifrn.HardCore.ServicoProduto.repository.PrateleiraRepository;
import com.ifrn.HardCore.ServicoProduto.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProdutoService {

    private ProdutoRepository repository;
    private PrateleiraRepository prateleiraRepository;
    private EstoqueRepository estoqueRepository;

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

    public List<ProdutoResponseDTO> ListarPorIds(List<Long> ids){
        List<Produto> produtos = repository.findAllById(ids);

        return produtos.stream().map(this::ToResponseDTO).toList();
    }

    public List<ProdutoResponseDTO> BuscarPorCategoria(String categoria){

        List<Produto> produtos = repository.findByCategoriaAllIgnoreCase(categoria);

        return produtos.stream().map(this::ToResponseDTO).toList();
    }

    public  List<ProdutoResponseDTO> BuscarPorMarca(String marca){
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

        Estoque estoque = estoqueRepository.findByProdutoId(id)
                .orElseThrow(() -> new EstoqueNaoEncontradoException(id));

        if (estoque.getQuantidadeProduto() > 0) {
            throw new IllegalArgumentException(
                    "Não é possível excluir um produto que possui quantidade em estoque."
            );
        }

        if (produto.getPrateleira() != null) {
            throw new IllegalArgumentException(
                    "Não é possível excluir um produto que ainda está na prateleira."
            );
        }
        estoqueRepository.delete(estoque);

        repository.delete(produto);
    }

    public Produto toEntity(ProdutoRequestDTO dto) {
        return new Produto(null, dto.getNome(),dto.getMarca(), dto.getCategoria(), dto.getPreco(), null);
    }

    public ProdutoResponseDTO ToResponseDTO(Produto prod){
        Long idPrateleira = prod.getPrateleira() != null ? prod.getPrateleira().getId() : null;

        return new ProdutoResponseDTO(prod.getId(), prod.getNome(), prod.getCategoria(), prod.getMarca(), prod.getPreco(),
                idPrateleira);
    }
}
