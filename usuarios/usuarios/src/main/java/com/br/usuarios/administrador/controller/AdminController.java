package com.br.usuarios.administrador.controller;

import com.br.usuarios.administrador.dto.AdminLoginResponseDTO;
import com.br.usuarios.administrador.dto.AdminRequestDTO;
import com.br.usuarios.administrador.service.AdminService;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponseDTO> fazerLoginAdmin(@RequestBody @Valid AdminRequestDTO requestDTO) {
        AdminLoginResponseDTO response = adminService.fazerLoginAdmin(requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodosUsuarios() {
        List<UsuarioResponseDTO> usuarios = adminService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/usuarios/entregadores")
    public ResponseEntity<List<UsuarioResponseDTO>> listarEntregadores() {
        List<UsuarioResponseDTO> entregadores = adminService.listarApenasEntregadores();
        return ResponseEntity.ok(entregadores);
    }

    @PatchMapping("/usuarios/{id}/promover-gerente")
    public ResponseEntity<UsuarioResponseDTO> promoverGerente(@PathVariable Long id) {
        UsuarioResponseDTO responseDTO = adminService.promoverGerente(id);
        return ResponseEntity.ok(responseDTO);
    }

    @PatchMapping("/usuarios/{id}/promover-entregador")
    public ResponseEntity<UsuarioResponseDTO> promoverEntregador(@PathVariable Long id) {
        UsuarioResponseDTO responseDTO = adminService.promoverEntregador(id);
        return ResponseEntity.ok(responseDTO);
    }
}