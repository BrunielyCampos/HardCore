package com.hardcore.pedidos.pedido.dto;

import com.hardcore.pedidos.pedido.model.TipoPagamentoEnum;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PedidoRequestDTO {
    @NotNull(message = "O ID do cliente é obrigatório")
    private Long idCliente;

    @NotNull(message = "O valor da compra é obrigatório")
    @Positive(message = "O valor da compra deve ser maior que zero")
    private Double valorCompra;

    @NotNull(message = "O tipo de pagamento é obrigatório")
    private TipoPagamentoEnum tipoPagamento;
}