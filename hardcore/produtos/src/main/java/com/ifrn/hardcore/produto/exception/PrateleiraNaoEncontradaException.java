package com.ifrn.hardcore.produto.exception;

public class PrateleiraNaoEncontradaException extends RuntimeException{

    public PrateleiraNaoEncontradaException(Long id){
        super("Não foi possivel encontrar a prateleira!" + id);
    }

    public PrateleiraNaoEncontradaException(){
        super("Não foi possivel encontrar a prateleira");
    }
}
