package com.ifrn.hardcore.produto.exception;

public class EstoqueNaoEncontradoException extends RuntimeException{

    public EstoqueNaoEncontradoException(Long id){
        super("Não foi possível encontrar o Estoque" + id);
    }
}
