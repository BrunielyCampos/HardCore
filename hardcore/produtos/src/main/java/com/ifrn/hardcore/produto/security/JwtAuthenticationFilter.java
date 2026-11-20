
package com.ifrn.hardcore.produto.security;

import com.ifrn.hardcore.produto.service.SecurityTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecurityTokenService securityTokenService;

    public JwtAuthenticationFilter(SecurityTokenService securityTokenService) {
        this.securityTokenService = securityTokenService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
    
        String token = recuperarToken(request);
    
        if (token != null) {
            try {
                String email =
                        securityTokenService.validarTokenETrazerSubject(token);
            
                if (email != null) {
                    String perfil =
                            securityTokenService.extrairPerfil(token);
                
                    boolean tokenServico =
                            securityTokenService.validarToken(token)
                                    .get("tipoToken", String.class) != null
                            && securityTokenService.validarToken(token)
                                    .get("tipoToken", String.class)
                                    .equals("SERVICO");
                
                    Long autorId = null;
                    String autorTipo = null;
                
                    if ("ROLE_ADMIN".equals(perfil)) {
                        autorId = securityTokenService.extrairAdminId(token);
                        autorTipo = "ADMIN";
                    } else if (!tokenServico) {
                        autorId = securityTokenService.extrairUsuarioId(token);
                        autorTipo = "USUARIO";
                    }
                
                    if (perfil != null &&
                            (tokenServico || autorId != null)) {
                            
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        List.of(new SimpleGrantedAuthority(perfil))
                                );
                            
                        if (!tokenServico) {
                            AutorAutenticado autor =
                                    new AutorAutenticado(autorId, autorTipo);
                        
                            authentication.setDetails(autor);
                        }
                    
                        SecurityContextHolder.getContext()
                                .setAuthentication(authentication);
                    } else {
                        SecurityContextHolder.clearContext();
                    }
                }
            
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }
    
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader != null &&
                authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }

        return null;
    }
}