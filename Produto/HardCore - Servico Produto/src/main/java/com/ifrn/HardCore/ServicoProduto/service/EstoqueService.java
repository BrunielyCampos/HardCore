package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.Estoque;
import org.springframework.stereotype.Service;

@Service
public class EstoqueService {

    private Estoque estoque;

    public EstoqueService(Estoque estoque) {
        this.estoque = estoque;
    }


}
