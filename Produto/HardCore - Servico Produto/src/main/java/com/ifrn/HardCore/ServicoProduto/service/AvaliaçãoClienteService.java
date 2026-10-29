package com.ifrn.HardCore.ServicoProduto.service;

import com.ifrn.HardCore.ServicoProduto.repository.Entity.AvaliacaoCliente;
import org.springframework.stereotype.Service;

@Service
public class AvaliaçãoClienteService {
    private AvaliacaoCliente avlCliente;

    public AvaliaçãoClienteService(AvaliacaoCliente avlCliente) {
        this.avlCliente = avlCliente;
    }
}
