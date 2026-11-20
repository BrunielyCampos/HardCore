package com.hardcore.entrega.entrega.controller;

import com.hardcore.entrega.entrega.dto.EntregaRequestDTO;
import com.hardcore.entrega.entrega.dto.EntregaResponseDTO;
import com.hardcore.entrega.entrega.routes.RotasEntrega;
import com.hardcore.entrega.entrega.service.EntregaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class EntregaController {

    private final EntregaService entregaService;

    @PostMapping(RotasEntrega.ATRIBUIR)
    public ResponseEntity<EntregaResponseDTO> atribuirEntrega(@RequestBody @Valid EntregaRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(entregaService.atribuirEntrega(requestDTO));
    }

    @GetMapping(RotasEntrega.BUSCAR_POR_PEDIDO)
    public ResponseEntity<EntregaResponseDTO> buscarPorPedido(@PathVariable Long idPedido) {
        return ResponseEntity.ok(entregaService.buscarEntregaPorPedido(idPedido));
    }

    @GetMapping(RotasEntrega.BUSCAR_POR_ENTREGADOR)
    public ResponseEntity<List<EntregaResponseDTO>> buscarPorEntregador(@PathVariable Long idEntregador) {
        return ResponseEntity.ok(entregaService.buscarPorEntregador(idEntregador));
    }

    @PatchMapping(RotasEntrega.NOTIFICAR_EFETUADA)
    public ResponseEntity<Void> notificarEntregaEfetuada(@PathVariable Long id) {
        entregaService.notificarEntregaEfetuada(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(RotasEntrega.CONFIRMAR_RECEBIMENTO)
    public ResponseEntity<Void> confirmarRecebimento(@PathVariable Long id, @RequestParam Boolean recebeu) {
        entregaService.confirmarRecebimento(id, recebeu);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(RotasEntrega.CANCELAR)
    public ResponseEntity<Void> cancelarEntrega(@PathVariable Long id) {
        entregaService.cancelarEntrega(id);
        return ResponseEntity.noContent().build();
    }
}