package com.ifrn.HardCore.ServicoProduto.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ConfigExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(EstoqueNaoEncontradoException.class)
    public String hadel(EstoqueNaoEncontradoException ex){
        return ex.getMessage();
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ProdutoNaoEncontradoException.class)
    public String hadel(ProdutoNaoEncontradoException ex){
        return ex.getMessage();
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(AvaliacaoNaoEncontradaException.class)
    public String hadel(AvaliacaoNaoEncontradaException ex){
        return ex.getMessage();
    }

}
