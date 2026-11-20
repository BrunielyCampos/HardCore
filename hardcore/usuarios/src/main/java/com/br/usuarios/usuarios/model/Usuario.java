package com.br.usuarios.usuarios.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import com.br.usuarios.administrador.model.Admin;

@Data
@Entity
@RequiredArgsConstructor
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

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;
}