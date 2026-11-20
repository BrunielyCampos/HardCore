package com.hardcore.pedidos.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class ServiceTokenService {
    private final String secret;

    public ServiceTokenService(@Value("${JWT_SECRET}") String secret) {
        this.secret = secret;
    }

    public String gerarTokenInterno() {
        long agora = System.currentTimeMillis();

        return Jwts.builder()
                .setSubject("pedidos@hardcore")
                .claim("perfil", "ROLE_GERENTE")
                .claim("tipoToken", "SERVICO")
                .setIssuedAt(new Date(agora))
                .setExpiration(new Date(agora + 300_000))
                .signWith(Keys.hmacShaKeyFor(
                        secret.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}