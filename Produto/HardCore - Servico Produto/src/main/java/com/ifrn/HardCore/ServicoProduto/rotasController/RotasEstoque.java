package com.ifrn.HardCore.ServicoProduto.rotasController;

public interface RotasEstoque {
    String ESTOQUE_BASE = "/estoque";

    String LISTAR = ESTOQUE_BASE;
    String CADASTRAR = ESTOQUE_BASE;
    String ATUALIZAR_QUANTIDADE = ESTOQUE_BASE + "/{produtoId}/quantidade";
    String MAIOR_QUANTIDADE = ESTOQUE_BASE + "/maior-quantidade";
    String MENOR_QUANTIDADE = ESTOQUE_BASE + "/menor-quantidade";
}
