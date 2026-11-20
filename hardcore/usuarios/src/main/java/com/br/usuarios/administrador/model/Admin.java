package com.br.usuarios.administrador.model;

import java.util.List;
import com.br.usuarios.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "administrador")
@Data
@RequiredArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<Usuario> usuarios;
}