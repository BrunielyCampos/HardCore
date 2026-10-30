package com.br.usuarios.administrador.service;

import com.br.usuarios.administrador.dto.AdminLoginResponseDTO;
import com.br.usuarios.administrador.dto.AdminRequestDTO;
import com.br.usuarios.administrador.exception.AdminNaoEncontradoException;
import com.br.usuarios.administrador.model.Admin;
import com.br.usuarios.administrador.repository.AdminRepository;
import com.br.usuarios.security.SecurityTokenService;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import com.br.usuarios.usuarios.exception.UsuarioNaoEncontradoException;
import com.br.usuarios.usuarios.mapper.UsuarioMapper;
import com.br.usuarios.usuarios.model.Usuario;
import com.br.usuarios.usuarios.model.UsuarioEnum;
import com.br.usuarios.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final SecurityTokenService tokenService;

    public AdminLoginResponseDTO fazerLoginAdmin(AdminRequestDTO requestDTO) {
        Admin admin = adminRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(() -> new AdminNaoEncontradoException("Admin não encontrado com o e-mail: " + requestDTO.getEmail()    ));

        if (!admin.getSenha().equals(requestDTO.getSenha())) {
            throw new RuntimeException("Senha incorreta!");
        }

        String token = tokenService.gerarToken(admin.getEmail(), "ROLE_ADMIN");
        return new AdminLoginResponseDTO(token);
    }

    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .toList();
    }

    public List<UsuarioResponseDTO> listarApenasEntregadores() {
        return usuarioRepository.findByPerfil(UsuarioEnum.ENTREGADOR)
                .stream()
                .map(usuarioMapper::toDTO)
                .toList();
    }

    public UsuarioResponseDTO promoverGerente(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o ID: " + idUsuario));
        
        usuario.setPerfil(UsuarioEnum.GERENTE);
        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    public UsuarioResponseDTO promoverEntregador(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o ID: " + idUsuario));
        
        usuario.setPerfil(UsuarioEnum.ENTREGADOR);
        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }
}