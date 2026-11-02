package com.br.usuarios.usuarios.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.br.usuarios.usuarios.model.Usuario;
import com.br.usuarios.usuarios.model.UsuarioEnum;

@Repository
public interface UsuarioRepository extends JpaRepository <Usuario, Long>{
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findById(Long id);
    List<Usuario> findByPerfil(UsuarioEnum perfil);
}