package com.ifrn.HardCore.ServicoProduto.rotasController;

public interface RotasAvaliacaoCliente {

    String AVALIACAO_BASE = "/avaliacoes";

    String CADASTRAR = AVALIACAO_BASE;
    String LISTAR_POR_IDS = AVALIACAO_BASE + "/ids";
    String BUSCAR_POR_ID = AVALIACAO_BASE + "/{id}";
    String BUSCAR_POR_PRODUTO = "/produtos/{produtoId}/avaliacoes";
    String DELETAR = AVALIACAO_BASE + "/{id}";
}
