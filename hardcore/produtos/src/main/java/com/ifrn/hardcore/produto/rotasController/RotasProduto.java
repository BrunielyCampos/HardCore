package com.ifrn.hardcore.produto.rotasController;

public interface RotasProduto {
    String PRODUTO_BASE = "/produtos";
    String LISTAR_TODOS = PRODUTO_BASE + "/listar";
    String LISTAR_POR_IDS = PRODUTO_BASE + "/ids";
    String BUSCAR_POR_ID = PRODUTO_BASE + "/{id}";
    String BUSCAR_POR_CATEGORIA = PRODUTO_BASE + "/categoria/{categoria}";
    String BUSCAR_POR_MARCA = PRODUTO_BASE + "/marca/{marca}";
    String CADASTRAR = PRODUTO_BASE + "/cadastrar";
    String ATUALIZAR = PRODUTO_BASE + "/{id}";
    String DELETAR = PRODUTO_BASE + "/{id}";
}
