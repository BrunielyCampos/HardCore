package com.ifrn.hardcore.produto.rotasController;

public interface RotasPrateleira {
    String PRATELEIRA_BASE = "/prateleira";
    String CADASTRAR = "/cadastrar";
    String LISTAR = "/listar";
    String BUSCAR_POR_PRODUTO = "/{produtoId:[0-9]+}";
    String TRANSFERIR = "/{produtoId:[0-9]+}/transferir";
    String REMOVER_PRODUTO = "/{produtoId:[0-9]+}";
}