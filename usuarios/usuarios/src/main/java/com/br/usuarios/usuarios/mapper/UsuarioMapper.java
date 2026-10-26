package com.br.usuarios.usuarios.mapper;

import com.br.usuarios.usuarios.dto.UsuarioRequestDTO;
import com.br.usuarios.usuarios.dto.UsuarioResponseDTO;
import com.br.usuarios.usuarios.model.Usuario;
import com.br.usuarios.usuarios.model.UsuarioEnum;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = {UsuarioEnum.class})
public interface UsuarioMapper {

    @Mapping(target = "perfil", expression = "java(UsuarioEnum.CLIENTE)")
    @Mapping(target = "id", ignore = true)
    Usuario toEntity(UsuarioRequestDTO dto);
    
    UsuarioResponseDTO toDTO(Usuario usuario);
}