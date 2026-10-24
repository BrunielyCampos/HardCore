package com.br.usuarios.usuarios.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    private String contaBancaria;
    private String pix;
    private String endereco;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UsuarioEnum perfil;

    public Usuario() {
    }

    public Usuario(Long id, String nome, String email, String senha, String contaBancaria, String pix, String endereco,
            Date dataNascimento, UsuarioEnum perfil) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.contaBancaria = contaBancaria;
        this.pix = pix;
        this.endereco = endereco;
        this.dataNascimento = dataNascimento;
        this.perfil = perfil;
    }
}