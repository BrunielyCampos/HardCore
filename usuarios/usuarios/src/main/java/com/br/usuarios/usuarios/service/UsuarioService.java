package com.br.usuarios.usuarios.service;

import com.br.usuarios.usuarios.dto.UsuarioRequestDTO;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import com.br.usuarios.usuarios.exception.UsuarioNaoEncontradoException;
import com.br.usuarios.usuarios.mapper.UsuarioMapper;
import com.br.usuarios.usuarios.model.Usuario;
import com.br.usuarios.usuarios.model.UsuarioEnum;
import com.br.usuarios.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioResponseDTO criarConta(UsuarioRequestDTO requestDTO) {
        Usuario usuario = usuarioMapper.toEntity(requestDTO);
        usuario.setPerfil(UsuarioEnum.CLIENTE);
        usuario.setId(null);
        Usuario salvo = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(salvo);
    }

    public UsuarioResponseDTO fazerLogin(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o e-mail: " + email));
        
        if (!usuario.getSenha().equals(senha)) {
            throw new RuntimeException("Senha incorreta!");
        }
        
        return usuarioMapper.toDTO(usuario);
    }

    public UsuarioResponseDTO buscarUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o ID: " + id));
        
        return usuarioMapper.toDTO(usuario);
    }
}