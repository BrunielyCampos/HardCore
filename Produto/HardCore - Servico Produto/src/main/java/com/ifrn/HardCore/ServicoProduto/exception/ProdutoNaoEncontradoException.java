package com.ifrn.HardCore.ServicoProduto.exception;

public class ProdutoNaoEncontradoException extends RuntimeException{

    public ProdutoNaoEncontradoException (Long id){
        super("Não foi possível encontra o produto!" + id);
    }
}
