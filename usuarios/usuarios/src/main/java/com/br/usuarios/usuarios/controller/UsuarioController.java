package com.br.usuarios.usuarios.controller;

import com.br.usuarios.usuarios.dto.UsuarioRequestDTO;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import com.br.usuarios.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioResponseDTO> criarConta(@RequestBody @Valid UsuarioRequestDTO requestDTO) {
        UsuarioResponseDTO responseDTO = usuarioService.criarConta(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        UsuarioResponseDTO responseDTO = usuarioService.buscarUsuarioPorId(id);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> fazerLogin(@RequestParam String email, @RequestParam String senha) {
        UsuarioResponseDTO responseDTO = usuarioService.fazerLogin(email, senha);
        return ResponseEntity.ok(responseDTO);
    }
}