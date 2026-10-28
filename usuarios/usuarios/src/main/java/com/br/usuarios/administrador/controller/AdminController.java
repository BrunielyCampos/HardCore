package com.br.usuarios.administrador.controller;

import com.br.usuarios.administrador.dto.AdminRequestDTO;
import com.br.usuarios.administrador.dto.AdminResponseDTO;
import com.br.usuarios.administrador.service.AdminService;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<AdminResponseDTO> fazerLoginAdmin(@RequestBody @Valid AdminRequestDTO requestDTO) {
        AdminResponseDTO responseDTO = adminService.fazerLoginAdmin(requestDTO);
        return ResponseEntity.ok(responseDTO);
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