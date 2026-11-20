package com.hardcore.pedidos.carrinho.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hardcore.pedidos.carrinho.dto.CarrinhoRequestDTO;
import com.hardcore.pedidos.carrinho.dto.CarrinhoResponseDTO;
import com.hardcore.pedidos.carrinho.exception.CarrinhoNaoEncontradoException;
import com.hardcore.pedidos.carrinho.mapper.CarrinhoMapper;
import com.hardcore.pedidos.carrinho.model.Carrinho;
import com.hardcore.pedidos.carrinho.repository.CarrinhoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CarrinhoService {

    private final CarrinhoMapper carrinhoMapper;
    private final CarrinhoRepository carrinhoRepository;

    @Transactional
    public CarrinhoResponseDTO criarCarrinho(CarrinhoRequestDTO requestDTO) {
        carrinhoRepository.findByIdCliente(requestDTO.getIdCliente()).ifPresent(c -> {
            throw new IllegalStateException("Já existe um carrinho para este cliente.");
        });

        Carrinho carrinho = carrinhoMapper.toEntity(requestDTO);
        carrinho.setId(null);
        Carrinho salvo = carrinhoRepository.save(carrinho);
        
        return carrinhoMapper.toDTO(salvo);
    }

    public CarrinhoResponseDTO buscarCarrinhoPorCliente(Long idCliente) {
        Carrinho carrinho = carrinhoRepository.findByIdCliente(idCliente)
                .orElseThrow(() -> new CarrinhoNaoEncontradoException("Carrinho não encontrado para o cliente ID: " + idCliente));

        return carrinhoMapper.toDTO(carrinho);
    }
}