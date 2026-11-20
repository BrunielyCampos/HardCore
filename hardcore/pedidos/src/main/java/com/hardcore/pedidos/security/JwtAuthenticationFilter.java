package com.hardcore.pedidos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final javax.crypto.SecretKey chave;

    public JwtAuthenticationFilter(@Value("${JWT_SECRET}") String secret) {
        this.chave = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(chave)
                        .build()
                        .parseClaimsJws(header.substring(7))
                        .getBody();

                String email = claims.getSubject();
                String perfil = claims.get("perfil", String.class);

                Object usuarioIdClaim = claims.get("usuarioId");
                Long usuarioId = null;

                if (usuarioIdClaim instanceof Number) {
                    usuarioId = ((Number) usuarioIdClaim).longValue();
                } else if (usuarioIdClaim instanceof String) {
                    usuarioId = Long.valueOf((String) usuarioIdClaim);
                }

                if (email != null && perfil != null) {

                    var authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(new SimpleGrantedAuthority(perfil))
                            );

                    authentication.setDetails(usuarioId);

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }

            } catch (Exception ignored) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}