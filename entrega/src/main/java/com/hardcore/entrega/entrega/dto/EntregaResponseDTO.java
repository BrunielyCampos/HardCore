package com.hardcore.entrega.entrega.dto;

import com.hardcore.entrega.entrega.model.EntregaEnum;
import lombok.Data;

@Data
public class EntregaResponseDTO {
    private Long id;
    private Long idPedido;
    private Long idEntregador;
    private String enderecoDestino;
    private EntregaEnum estadoEntrega;
    private Boolean confirmacaoCliente;
}