package com.ifrn.HardCore.ServicoProduto.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;


@Service
public class SecurityTokenService {

    private final SecretKey chaveAssinatura;

    public SecurityTokenService(@Value("${jwt.secret}") String secret) {
        this.chaveAssinatura = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public Claims validarToken(String token) {
        return Jwts.parser()
                .verifyWith(chaveAssinatura)
                .build()
                .parseSignedClaims(token)
                .getPayload();
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
}