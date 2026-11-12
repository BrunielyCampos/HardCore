package com.hardcore.pedidos.carrinho.mapper;

import com.hardcore.pedidos.carrinho.dto.CarrinhoRequestDTO;
import com.hardcore.pedidos.carrinho.dto.CarrinhoResponseDTO;
import com.hardcore.pedidos.carrinho.model.Carrinho;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CarrinhoMapper {

    @Mapping(target = "id", ignore = true)
    Carrinho toEntity(CarrinhoRequestDTO dto);

    CarrinhoResponseDTO toDTO(Carrinho carrinho);
}