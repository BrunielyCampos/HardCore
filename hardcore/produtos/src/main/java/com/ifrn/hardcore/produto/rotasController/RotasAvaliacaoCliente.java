package com.ifrn.hardcore.produto.rotasController;

public interface RotasAvaliacaoCliente {
    String AVALIACAO_BASE = "/avaliacoes";
    String CADASTRAR = "/cadastrar";
    String LISTAR_POR_IDS = "/listar/ids";
    String BUSCAR_POR_ID = "/{id}";
    String BUSCAR_POR_PRODUTO = "/produtos/{produtoId}/avaliacoes";
    String DELETAR = "/{id}";
}