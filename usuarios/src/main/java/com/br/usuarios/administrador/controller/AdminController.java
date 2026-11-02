package com.br.usuarios.administrador.controller;

import com.br.usuarios.administrador.dto.AdminRequestDTO;
import com.br.usuarios.administrador.dto.AdminLoginResponseDTO;
import com.br.usuarios.administrador.service.AdminService;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.br.usuarios.administrador.routes.RotasAdmin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping(RotasAdmin.LOGIN)
    public ResponseEntity<AdminLoginResponseDTO> fazerLoginAdmin(@RequestBody @Valid AdminRequestDTO requestDTO) {
        return ResponseEntity.ok(adminService.fazerLoginAdmin(requestDTO));
    }

    @GetMapping(RotasAdmin.LISTAR_USUARIOS)
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodosUsuarios() {
        return ResponseEntity.ok(adminService.listarTodosUsuarios());
    }

    @GetMapping(RotasAdmin.LISTAR_ENTREGADORES)
    public ResponseEntity<List<UsuarioResponseDTO>> listarApenasEntregadores() {
        return ResponseEntity.ok(adminService.listarApenasEntregadores());
    }

    @PatchMapping(RotasAdmin.PROMOVER_GERENTE)
    public ResponseEntity<UsuarioResponseDTO> promoverGerente(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.promoverGerente(id));
    }

    @PatchMapping(RotasAdmin.PROMOVER_ENTREGADOR)
    public ResponseEntity<UsuarioResponseDTO> promoverEntregador(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.promoverEntregador(id));
    }
}