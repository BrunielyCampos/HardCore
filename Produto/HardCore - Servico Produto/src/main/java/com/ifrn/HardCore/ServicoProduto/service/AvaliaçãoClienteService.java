package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.AvaliacaoClienteRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.AvaliacaoClienteResponseDTO;
import com.ifrn.HardCore.ServicoProduto.exception.AvaliacaoNaoEncontradaException;
import com.ifrn.HardCore.ServicoProduto.exception.ProdutoNaoEncontradoException;
import com.ifrn.HardCore.ServicoProduto.repository.AvaliacaoRepository;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.AvaliacaoCliente;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import com.ifrn.HardCore.ServicoProduto.repository.ProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliaçãoClienteService {
    private AvaliacaoRepository repository;
    private ProdutoRepository produtoRepository;

    public AvaliaçãoClienteService(AvaliacaoRepository repository, ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
    }

    public AvaliacaoClienteResponseDTO criarAvaliacao(AvaliacaoClienteRequestDTO dto){
        AvaliacaoCliente avaliacao = repository.save(toEntity(dto));

        return toResponseDTO(avaliacao);
    }

    public List<AvaliacaoClienteResponseDTO> listarAvaliacao(List<Long> ids){
        List<AvaliacaoCliente> avaliacaoCliente = repository.findAllById(ids);

        return avaliacaoCliente.stream().map(this::toResponseDTO).toList();
    }

    public AvaliacaoClienteResponseDTO buscarAvaliacaoPorId(Long id){
        AvaliacaoCliente avaliacaoCliente =
                repository.findById(id).orElseThrow(() -> new AvaliacaoNaoEncontradaException(id));

        return toResponseDTO(avaliacaoCliente);
    }

    public List<AvaliacaoClienteResponseDTO> buscarPorIdProduto(Long id) {

        List<AvaliacaoCliente> avaliacoes =
                repository.findAllByProdutoId(id);

        return avaliacoes.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void deletePorId(Long id){
        AvaliacaoCliente avaliacao = repository.findById(id).orElseThrow(() -> new AvaliacaoNaoEncontradaException(id));

        repository.delete(avaliacao);
    }

    public AvaliacaoCliente toEntity(@Valid AvaliacaoClienteRequestDTO dto){
        Produto produto =
                produtoRepository.findById(dto.getProduto_id()).orElseThrow(() -> new ProdutoNaoEncontradoException(dto.getProduto_id()));
        return new AvaliacaoCliente(null, dto.isAvaliacao(), dto.getCampoComentario(), produto);
    }

    public AvaliacaoClienteResponseDTO toResponseDTO(AvaliacaoCliente avaliacao){
        Long produtoId = (avaliacao.getProduto() != null) ? avaliacao.getProduto().getId() : null;

        return new AvaliacaoClienteResponseDTO(avaliacao.getId(), avaliacao.isAvaliacao(),
                avaliacao.getCampoComentario(),produtoId);
    }
}
