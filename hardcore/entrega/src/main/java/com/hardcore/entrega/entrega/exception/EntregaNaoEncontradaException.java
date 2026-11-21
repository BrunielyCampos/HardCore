package com.hardcore.entrega.entrega.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class EntregaNaoEncontradaException extends RuntimeException {
    public EntregaNaoEncontradaException(String message) {
        super(message);
    }
}