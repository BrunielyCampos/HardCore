package com.ifrn.hardcore.produto.exception;

public class ProdutoNaoEncontradoException extends RuntimeException{

    public ProdutoNaoEncontradoException (Long id){
        super("Não foi possível encontrar o produto!" + id);
    }
}