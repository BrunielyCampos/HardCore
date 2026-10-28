package com.br.usuarios.administrador.service;

import com.br.usuarios.administrador.dto.AdminRequestDTO;
import com.br.usuarios.administrador.dto.AdminResponseDTO;
import com.br.usuarios.administrador.exception.AdminNaoEncontradoException;
import com.br.usuarios.administrador.mapper.AdminMapper;
import com.br.usuarios.administrador.model.Admin;
import com.br.usuarios.administrador.repository.AdminRepository;
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
public class AdminService {

    private final AdminRepository adminRepository;
    private final UsuarioRepository usuarioRepository;
    private final AdminMapper adminMapper;
    private final UsuarioMapper usuarioMapper;

    public AdminResponseDTO fazerLoginAdmin(AdminRequestDTO requestDTO) {
        Admin admin = adminRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(() -> new AdminNaoEncontradoException("Admin não encontrado com o e-mail: " + requestDTO.getEmail()));

        if (!admin.getSenha().equals(requestDTO.getSenha())) {
            throw new RuntimeException("Senha incorreta!"); // Ou pode criar uma SenhaInvalidaException se preferir padronizar
        }

        return adminMapper.toDTO(admin);
    }

    public UsuarioResponseDTO promoverGerente(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o ID: " + idUsuario));
        
        usuario.setPerfil(UsuarioEnum.GERENTE);
        Usuario salvo = usuarioRepository.save(usuario);
        
        return usuarioMapper.toDTO(salvo);
    }

    public UsuarioResponseDTO promoverEntregador(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado com o ID: " + idUsuario));
        
        usuario.setPerfil(UsuarioEnum.ENTREGADOR);
        Usuario salvo = usuarioRepository.save(usuario);
        
        return usuarioMapper.toDTO(salvo);
    }
}