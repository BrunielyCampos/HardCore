package com.hardcore.entrega.entrega.mapper;

import com.hardcore.entrega.entrega.dto.EntregaRequestDTO;
import com.hardcore.entrega.entrega.dto.EntregaResponseDTO;
import com.hardcore.entrega.entrega.model.Entrega;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EntregaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "estadoEntrega", expression = "java(com.hardcore.entrega.entrega.model.EntregaEnum.PENDENTE)")
    @Mapping(target = "confirmacaoCliente", ignore = true)
    Entrega toEntity(EntregaRequestDTO dto);

    EntregaResponseDTO toDTO(Entrega entrega);
}