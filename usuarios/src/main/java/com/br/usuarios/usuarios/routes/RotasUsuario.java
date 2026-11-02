package com.br.usuarios.usuarios.routes;

public interface RotasUsuario {
    String USUARIO_BASE = "/usuarios";
    String CADASTRO = USUARIO_BASE + "/cadastro";
    String LOGIN = USUARIO_BASE + "/login";
    String BUSCAR_POR_ID = USUARIO_BASE + "/{id}";
}