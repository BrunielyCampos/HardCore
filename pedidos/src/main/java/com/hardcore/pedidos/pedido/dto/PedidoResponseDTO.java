package com.hardcore.pedidos.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import com.hardcore.pedidos.pedido.model.EstadoCompraEnum;
import com.hardcore.pedidos.pedido.model.EstadoPagamentoEnum;
import com.hardcore.pedidos.pedido.model.TipoPagamentoEnum;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoResponseDTO {
    private Long id;
    private Long idCliente;
    private Double valorCompra;
    private Date dataCompra;
    private EstadoCompraEnum estado;
    private TipoPagamentoEnum tipoPagamento;
    private EstadoPagamentoEnum estadoPagamento;
    private String abacatePayCheckoutId;
    private String urlPagamento;
}