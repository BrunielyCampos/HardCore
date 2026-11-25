package com.ifrn.hardcore.produto.service;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import com.ifrn.hardcore.produto.DTO.AvaliacaoClienteRequestDTO;
import com.ifrn.hardcore.produto.DTO.AvaliacaoClienteResponseDTO;
import com.ifrn.hardcore.produto.Entity.AvaliacaoCliente;
import com.ifrn.hardcore.produto.Entity.Produto;
import com.ifrn.hardcore.produto.exception.AvaliacaoNaoEncontradaException;
import com.ifrn.hardcore.produto.exception.ProdutoNaoEncontradoException;
import com.ifrn.hardcore.produto.repository.AvaliacaoRepository;
import com.ifrn.hardcore.produto.repository.ProdutoRepository;

import java.util.List;

@Service
public class AvaliacaoClienteService {

    private final AvaliacaoRepository repository;
    private final ProdutoRepository produtoRepository;

    public AvaliacaoClienteService(
            AvaliacaoRepository repository,
            ProdutoRepository produtoRepository) {

        this.repository = repository;
        this.produtoRepository = produtoRepository;
    }

    public AvaliacaoClienteResponseDTO criarAvaliacao(
            AvaliacaoClienteRequestDTO dto,
            Long autorId,
            String autorTipo) {

        AvaliacaoCliente avaliacao =
                repository.save(toEntity(dto, autorId, autorTipo));

        return toResponseDTO(avaliacao);
    }

    public List<AvaliacaoClienteResponseDTO> listarAvaliacao(
            List<Long> ids) {

        List<AvaliacaoCliente> avaliacaoCliente =
                repository.findAllById(ids);

        return avaliacaoCliente.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public AvaliacaoClienteResponseDTO buscarAvaliacaoPorId(Long id) {

        AvaliacaoCliente avaliacaoCliente =
                repository.findById(id)
                        .orElseThrow(
                                () -> new AvaliacaoNaoEncontradaException(id)
                        );

        return toResponseDTO(avaliacaoCliente);
    }

    public List<AvaliacaoClienteResponseDTO> buscarPorIdProduto(
            Long id) {

        List<AvaliacaoCliente> avaliacoes =
                repository.findAllByProdutoId(id);

        return avaliacoes.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void deletePorId(Long id) {

        AvaliacaoCliente avaliacao =
                repository.findById(id)
                        .orElseThrow(
                                () -> new AvaliacaoNaoEncontradaException(id)
                        );

        repository.delete(avaliacao);
    }

    public AvaliacaoCliente toEntity(
            @Valid AvaliacaoClienteRequestDTO dto,
            Long autorId,
            String autorTipo) {

        Produto produto =
                produtoRepository.findById(dto.getProduto_id())
                        .orElseThrow(
                                () -> new ProdutoNaoEncontradoException(
                                        dto.getProduto_id()
                                )
                        );

        AvaliacaoCliente avaliacao = new AvaliacaoCliente();

        avaliacao.setAvaliacao(dto.getAvaliacao());
        avaliacao.setCampoComentario(dto.getCampoComentario());
        avaliacao.setProduto(produto);
        avaliacao.setAutorId(autorId);
        avaliacao.setAutorTipo(autorTipo);

        return avaliacao;
    }

    public AvaliacaoClienteResponseDTO toResponseDTO(
            AvaliacaoCliente avaliacao) {

        Long produtoId = avaliacao.getProduto() != null
                ? avaliacao.getProduto().getId()
                : null;

        return new AvaliacaoClienteResponseDTO(
                avaliacao.getId(),
                avaliacao.getAvaliacao(),
                avaliacao.getCampoComentario(),
                produtoId,
                avaliacao.getAutorId(),
                avaliacao.getAutorTipo()
        );
    }
}