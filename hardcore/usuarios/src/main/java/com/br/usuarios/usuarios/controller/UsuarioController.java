package com.br.usuarios.usuarios.controller;

import com.br.usuarios.usuarios.dto.UsuarioLoginRequestDTO;
import com.br.usuarios.usuarios.dto.UsuarioLoginResponseDTO;
import com.br.usuarios.usuarios.dto.UsuarioRequestDTO;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import com.br.usuarios.usuarios.service.UsuarioService;
import com.br.usuarios.usuarios.routes.RotasUsuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping(RotasUsuario.CADASTRO)
    public ResponseEntity<UsuarioResponseDTO> criarConta(@RequestBody @Valid UsuarioRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criarConta(requestDTO));
    }

    @GetMapping(RotasUsuario.LISTAR_ENTREGADORES)
    public ResponseEntity<List<UsuarioResponseDTO>> listarEntregadores() {
        return ResponseEntity.ok(usuarioService.listarEntregadores());
    }

    @GetMapping(RotasUsuario.BUSCAR_POR_ID)
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorId(id));
    }

    @PostMapping(RotasUsuario.LOGIN)
    public ResponseEntity<UsuarioLoginResponseDTO> fazerLogin(@RequestBody @Valid UsuarioLoginRequestDTO requestDTO) {
        return ResponseEntity.ok(usuarioService.fazerLogin(requestDTO));
    }

    @GetMapping(RotasUsuario.VALIDAR_ENTREGADOR)
    public ResponseEntity<Boolean> validarEntregador(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.validarEntregador(id));
    }
}