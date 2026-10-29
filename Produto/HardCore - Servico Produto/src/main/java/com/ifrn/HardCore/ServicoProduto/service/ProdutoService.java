package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoResponseDTO;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    private Produto produto;

    public ProdutoService(Produto produto) {
        this.produto = produto;
    }





    public Produto ToEntity(ProdutoResponseDTO dto){
        Produto prod = new  Produto();

        prod.setId(dto.getId());
        prod.setNome(dto.getNome());
        prod.setMarca(dto.getMarca());
        prod.setCategoria(dto.getCategoria());
        prod.setPreco(dto.getPreco());

        return prod;
    }

    public ProdutoResponseDTO ToResponseDTo(Produto prod){
        ProdutoResponseDTO dto = new ProdutoResponseDTO();

        dto.setId(prod.getId());
        dto.setNome(prod.getNome());
        dto.setMarca(prod.getMarca());
        dto.setCategoria(prod.getCategoria());
        dto.setPreco(prod.getPreco());

        return dto;
    }
}
