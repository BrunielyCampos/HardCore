package com.ifrn.hardcore.produto.rotasController;

public interface RotasEstoque {
    String ESTOQUE_BASE = "/estoque";
    String CADASTRAR = ESTOQUE_BASE + "/cadastrar";
    String LISTAR = ESTOQUE_BASE + "/listar";
    String LISTAR_POR_ID = ESTOQUE_BASE + "/{produto_id}";
    String ATUALIZAR_QUANTIDADE = ESTOQUE_BASE + "/{produto_id}/quantidade";
    String MAIOR_QUANTIDADE = ESTOQUE_BASE + "/maior-quantidade";
    String MENOR_QUANTIDADE = ESTOQUE_BASE + "/menor-quantidade";
    String RESERVAR = ESTOQUE_BASE + "/{produto_id}/reservar";
    String LIBERAR = ESTOQUE_BASE + "/{produto_id}/liberar";
}
