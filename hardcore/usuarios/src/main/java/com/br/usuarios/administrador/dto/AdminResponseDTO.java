package com.br.usuarios.administrador.dto;

import lombok.Data;

@Data
public class AdminResponseDTO {
    private Long id;
    private String email;
    private String senha;
}