package com.br.usuarios.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class SecurityTokenService {

    private final Key chaveAssinatura;
    private final long EXPIRATION_TIME = 86400000;

    public SecurityTokenService(
            @Value("${JWT_SECRET}") String secret) {

        this.chaveAssinatura = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String gerarToken(
            String email,
            String perfil,
            Long usuarioId) {

        return Jwts.builder()
                .setSubject(email)
                .claim("perfil", perfil)
                .claim("usuarioId", usuarioId)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(chaveAssinatura)
                .compact();
    }

    public String gerarTokenAdmin(
            String email,
            String perfil,
            Long adminId) {

        return Jwts.builder()
                .setSubject(email)
                .claim("perfil", perfil)
                .claim("adminId", adminId)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(chaveAssinatura)
                .compact();
    }

    public String validarTokenETrazerSubject(String token) {
        try {
            return validarToken(token).getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public String extrairPerfil(String token) {
        return validarToken(token).get("perfil", String.class);
    }

    private Claims validarToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(chaveAssinatura)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}