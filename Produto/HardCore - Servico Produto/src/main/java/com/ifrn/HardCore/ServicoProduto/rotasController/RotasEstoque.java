package com.ifrn.HardCore.ServicoProduto.rotasController;

public interface RotasEstoque {
    String ESTOQUE_BASE = "/estoque";

    String CADASTRAR = ESTOQUE_BASE;
    String LISTAR = ESTOQUE_BASE + "/";
    String LISTAR_POR_ID = ESTOQUE_BASE + "/{produto_id}";
    String ATUALIZAR_QUANTIDADE = ESTOQUE_BASE + "/{produto_id}/quantidade";
    String MAIOR_QUANTIDADE = ESTOQUE_BASE + "/maior-quantidade";
    String MENOR_QUANTIDADE = ESTOQUE_BASE + "/menor-quantidade";
}
