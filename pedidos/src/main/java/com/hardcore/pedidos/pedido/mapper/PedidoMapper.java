package com.hardcore.pedidos.pedido.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.hardcore.pedidos.pedido.dto.PedidoRequestDTO;
import com.hardcore.pedidos.pedido.dto.PedidoResponseDTO;
import com.hardcore.pedidos.pedido.model.EstadoCompraEnum;
import com.hardcore.pedidos.pedido.model.Pedido;

@Mapper(componentModel = "spring", imports = {EstadoCompraEnum.class})
public interface PedidoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataCompra", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "estado", expression = "java(EstadoCompraEnum.A_COMPRAR)")
    @Mapping(target = "abacatePayCheckoutId", ignore = true)
    @Mapping(target = "estadoPagamento", ignore = true)
    @Mapping(target = "urlPagamento", ignore = true)
    Pedido toEntity(PedidoRequestDTO dto);

    PedidoResponseDTO toDTO(Pedido pedido);
}