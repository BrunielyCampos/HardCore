package com.br.usuarios.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.br.usuarios.usuarios.exception.UsuarioNaoEncontradoException;
import com.br.usuarios.administrador.exception.AdminNaoEncontradoException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<String> handleUsuarioNaoEncontrado(UsuarioNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(AdminNaoEncontradoException.class)
    public ResponseEntity<String> handleAdminNaoEncontrado(AdminNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            if (error instanceof FieldError fieldError) {
                String errorMessage = fieldError.getDefaultMessage();
                errors.put(fieldError.getField(),
                        errorMessage != null ? errorMessage : "Valor inválido");
            } else {
                String errorMessage = error.getDefaultMessage();
                errors.put(error.getObjectName(),
                        errorMessage != null ? errorMessage : "Valor inválido");
            }
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Throwable root = ex;
        while (root.getCause() != null) {
            root = root.getCause();
        }

        String rootMessage = root.getMessage();
        if (rootMessage == null || rootMessage.isBlank()) {
            rootMessage = root.getClass().getSimpleName();
        }

        System.err.println("ERRO REAL: " + root.getClass().getName() + " -> " + rootMessage);

        Map<String, String> erro = new HashMap<>();
        erro.put("erro", ex.getClass().getSimpleName());
        erro.put("causaRaiz", root.getClass().getName());
        erro.put("mensagem", rootMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}