package com.hardcore.pedidos.itemcarrinho.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoRequestDTO;
import com.hardcore.pedidos.itemcarrinho.dto.ItemCarrinhoResponseDTO;
import com.hardcore.pedidos.itemcarrinho.model.ItemCarrinho;

@Mapper(componentModel = "spring")
public interface ItemCarrinhoMapper {

    @Mapping(target = "id", ignore = true)
    ItemCarrinho toEntity(ItemCarrinhoRequestDTO dto);

    ItemCarrinhoResponseDTO toDTO(ItemCarrinho itemCarrinho);
}