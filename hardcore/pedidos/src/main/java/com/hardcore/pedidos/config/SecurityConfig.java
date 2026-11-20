package com.hardcore.pedidos.config;

import com.hardcore.pedidos.security.JwtAuthenticationFilter;
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

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/webhooks/abacatepay", "/error")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/pagamentos/webhook/registrar")
                        .hasAuthority("ROLE_ADMIN")

                        .requestMatchers(HttpMethod.POST, "/pedidos/criar")
                        .authenticated()

                        .requestMatchers(HttpMethod.GET,
                                "/carrinho/cliente/*",
                                "/pedidos/*",
                                "/pedidos/cliente/*")
                        .hasAuthority("ROLE_GERENTE")

                        .requestMatchers(
                                "/pedidos/*/status",
                                "/pedidos/*/entregador")
                        .hasAuthority("ROLE_GERENTE")

                        .requestMatchers("/itens-pedido/**").authenticated()

                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(
            JwtAuthenticationFilter filter) {

        FilterRegistrationBean<JwtAuthenticationFilter> registration =
                new FilterRegistrationBean<>(filter);

        registration.setEnabled(false);
        return registration;
    }
}