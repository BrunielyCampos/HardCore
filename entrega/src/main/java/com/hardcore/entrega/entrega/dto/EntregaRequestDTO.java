package com.hardcore.entrega.entrega.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EntregaRequestDTO {
    @NotNull(message = "O ID do pedido é obrigatório.")
    private Long idPedido;

    @NotNull(message = "O ID do entregador é obrigatório.")
    private Long idEntregador;

    @NotBlank(message = "O endereço de destino é obrigatório.")
    private String enderecoDestino;
}