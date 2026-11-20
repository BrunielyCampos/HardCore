package com.br.usuarios.administrador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminLoginResponseDTO {
    private String token;
}