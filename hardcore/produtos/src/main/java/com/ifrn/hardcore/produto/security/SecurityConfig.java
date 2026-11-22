package com.ifrn.hardcore.produto.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter securityFilter;

    public SecurityConfig(JwtAuthenticationFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/", "/index.html", "/ui/**", "/favicon.ico").permitAll()


                        .requestMatchers("/error").permitAll()

                        // Vitrine pública: qualquer visitante ou cliente pode consultar produtos, prateleira, estoque e avaliações do produto
                        .requestMatchers(HttpMethod.GET,
                                "/produtos/**",
                                "/prateleira/**",
                                "/estoque/**",
                                "/avaliacoes/produtos/**")
                        .permitAll()

                        // Qualquer ator autenticado pode cadastrar avaliação.
                        .requestMatchers(HttpMethod.POST,
                                "/avaliacoes/cadastrar")
                        .authenticated()

                        // Somente gerente pode gerenciar avaliações (excluir, etc.).
                        .requestMatchers("/avaliacoes/**")
                        .hasAuthority("ROLE_GERENTE")

                        // Todas as demais rotas (POST, PUT, DELETE) continuam exclusivas do gerente.
                        .anyRequest()
                        .hasAuthority("ROLE_GERENTE")
                )
                .addFilterBefore(
                        securityFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter>
            jwtFilterRegistration(JwtAuthenticationFilter filter) {

        FilterRegistrationBean<JwtAuthenticationFilter> registration =
                new FilterRegistrationBean<>(filter);

        registration.setEnabled(false);

        return registration;
    }
}