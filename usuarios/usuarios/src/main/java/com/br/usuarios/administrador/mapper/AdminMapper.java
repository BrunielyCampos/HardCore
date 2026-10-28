package com.br.usuarios.administrador.mapper;

import com.br.usuarios.administrador.dto.AdminRequestDTO;
import com.br.usuarios.administrador.dto.AdminResponseDTO;
import com.br.usuarios.administrador.model.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    @Mapping(target = "id", ignore = true)
    Admin toEntity(AdminRequestDTO dto);

    AdminResponseDTO toDTO(Admin admin);
}