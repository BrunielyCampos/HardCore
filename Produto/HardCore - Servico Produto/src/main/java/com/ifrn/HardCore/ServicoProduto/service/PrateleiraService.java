package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraRequestDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.PrateleiraResponseDTO;
import com.ifrn.HardCore.ServicoProduto.DTO.ProdutoResponseDTO;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Prateleira;
import com.ifrn.HardCore.ServicoProduto.repository.Entity.Produto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrateleiraService {
    private Prateleira prateleira;


    public PrateleiraService(Prateleira prateleira) {
        this.prateleira = prateleira;
    }

    public Prateleira ToEntity(PrateleiraRequestDTO dto){
        Prateleira prat = new Prateleira();

        prat.setQuantidade_produto(dto.getQuantidade_produto());
        prat.setProdutos(new ArrayList<>());
        return prat;
    }

    public PrateleiraResponseDTO ToResponseDTo(Prateleira prat){
        PrateleiraResponseDTO dto = new PrateleiraResponseDTO();

        dto.setId(prat.getId());
        dto.setQuantidade_produto(prat.getQuantidade_produto());

        if (prateleira.getProdutos() != null) {
            List<Long> ids = prateleira.getProdutos().stream()
                    .map(Produto::getId)
                    .collect(Collectors.toList());
            dto.setProdutoIds(ids);
        }

        return dto;
    }
}
