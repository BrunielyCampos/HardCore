package com.br.usuarios.usuarios.dto;

import com.br.usuarios.usuarios.model.UsuarioEnum;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.util.Date;

@Data
@RequiredArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String contaBancaria;
    private String pix;
    private String endereco;
    private Date dataNascimento;
    private UsuarioEnum perfil;
}