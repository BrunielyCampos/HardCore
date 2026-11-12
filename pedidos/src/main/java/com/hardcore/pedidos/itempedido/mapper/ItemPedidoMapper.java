package com.hardcore.pedidos.itempedido.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoRequestDTO;
import com.hardcore.pedidos.itempedido.dto.ItemPedidoResponseDTO;
import com.hardcore.pedidos.itempedido.model.ItemPedido;

@Mapper(componentModel = "spring")
public interface ItemPedidoMapper {

    @Mapping(target = "id", ignore = true)
    ItemPedido toEntity(ItemPedidoRequestDTO dto);

    ItemPedidoResponseDTO toDTO(ItemPedido itemPedido);
}