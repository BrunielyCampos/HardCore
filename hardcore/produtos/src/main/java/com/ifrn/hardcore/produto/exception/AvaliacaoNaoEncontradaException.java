package com.ifrn.hardcore.produto.exception;

public class AvaliacaoNaoEncontradaException extends RuntimeException{

    public AvaliacaoNaoEncontradaException (Long id){
        super("Avaliacao de Produto não encotrada!" + id);
    }
}