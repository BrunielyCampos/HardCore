package com.br.usuarios.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class SecurityTokenService {

    private final Key chaveAssinatura = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long EXPIRATION_TIME = 86400000;

    public String gerarToken(String email, String perfil) {
        return Jwts.builder()
                .setSubject(email)
                .claim("perfil", perfil)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(chaveAssinatura)
                .compact();
    }

    public String validarTokenETrazerSubject(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(chaveAssinatura)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            return null;
        }
    }
    
    public String extrairPerfil(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(chaveAssinatura)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("perfil", String.class);
    }
}