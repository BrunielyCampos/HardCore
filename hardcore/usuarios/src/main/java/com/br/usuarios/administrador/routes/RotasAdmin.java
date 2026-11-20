package com.br.usuarios.administrador.routes;

public interface RotasAdmin {
    String ADMIN_BASE = "/admin";
    String LOGIN = ADMIN_BASE + "/login";
    String LISTAR_USUARIOS = ADMIN_BASE + "/usuarios";
    String LISTAR_ENTREGADORES = ADMIN_BASE + "/usuarios/entregadores";
    String PROMOVER_GERENTE = ADMIN_BASE + "/usuarios/{id}/promover-gerente";
    String PROMOVER_ENTREGADOR = ADMIN_BASE + "/usuarios/{id}/promover-entregador";
}