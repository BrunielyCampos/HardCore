package com.ifrn.HardCore.ServicoProduto.rotasController;

public interface RotasPrateleira {

    String PRATELEIRA_BASE = "/prateleira";

    String CADASTRAR = PRATELEIRA_BASE;
    String LISTAR = PRATELEIRA_BASE;
    String BUSCAR_POR_PRODUTO = PRATELEIRA_BASE + "/{produtoId}";
    String TRANSFERIR = PRATELEIRA_BASE + "/{produtoId}/transferir";
    String REMOVER_PRODUTO = PRATELEIRA_BASE + "/{produtoId}";
}
