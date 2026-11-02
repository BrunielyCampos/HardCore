package com.ifrn.HardCore.ServicoProduto.exception;

public class PrateleiraNaoEncontradaException extends RuntimeException{

    public PrateleiraNaoEncontradaException(Long id){
        super("Não foi possivel encontrar a prateleira!" + id);
    }
}
