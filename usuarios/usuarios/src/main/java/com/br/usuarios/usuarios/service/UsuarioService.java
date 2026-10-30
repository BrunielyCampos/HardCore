package com.br.usuarios.usuarios.service;

import com.br.usuarios.security.SecurityTokenService;
import com.br.usuarios.usuarios.dto.UsuarioLoginRequestDTO;
import com.br.usuarios.usuarios.dto.UsuarioLoginResponseDTO;
import com.br.usuarios.usuarios.dto.UsuarioRequestDTO;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import com.br.usuarios.usuarios.exception.UsuarioNaoEncontradoException;
import com.br.usuarios.usuarios.mapper.UsuarioMapper;
import com.br.usuarios.usuarios.model.Usuario;
import com.br.usuarios.usuarios.model.UsuarioEnum;
import com.br.usuarios.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    @Autowired
    private final UsuarioMapper usuarioMapper;
    private final SecurityTokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public UsuarioResponseDTO criarConta(UsuarioRequestDTO requestDTO) {
        Usuario usuario = usuarioMapper.toEntity(requestDTO);
        usuario.setPerfil(UsuarioEnum.CLIENTE);
        usuario.setId(null);
        Usuario salvo = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(salvo);
    }

    public UsuarioLoginResponseDTO fazerLogin(UsuarioLoginRequestDTO requestDTO) {
        Usuario usuario = usuarioRepository.findByEmail(requestDTO.getEmail())
            .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o e-mail: " + requestDTO.getEmail()));

        if (!usuario.getSenha().equals(requestDTO.getSenha())) {
            throw new RuntimeException("Senha incorreta!");
        }

        String role = "ROLE_" + usuario.getPerfil().name();
        String token = tokenService.gerarToken(usuario.getEmail(), role);
        return new UsuarioLoginResponseDTO(token);
    }

    public UsuarioResponseDTO buscarUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o ID: " + id));
        
        return usuarioMapper.toDTO(usuario);
    }
}