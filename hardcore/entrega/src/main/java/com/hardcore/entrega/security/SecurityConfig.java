package com.hardcore.entrega.security;

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
        return http.csrf(csrf -> csrf.disable())
                
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
            // .authorizeHttpRequests(auth -> auth
            //     .requestMatchers("/error").permitAll()
            //     .requestMatchers(HttpMethod.POST, "/entregas").hasAuthority("ROLE_GERENTE")
            //     .requestMatchers(HttpMethod.PATCH, "/entregas/**").hasAuthority("ROLE_GERENTE")
            //     .requestMatchers(HttpMethod.PATCH, "/entregas/*/notificar-efetuada").hasAuthority("ROLE_ENTREGADOR")
            //     .requestMatchers(HttpMethod.PATCH, "/entregas/*/confirmar-recebimento").hasAuthority("ROLE_CLIENTE")
            //     .requestMatchers(HttpMethod.PATCH, "/entregas/**").hasAuthority("ROLE_GERENTE")
            //     .anyRequest().authenticated())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/", "/index.html", "/ui/**", "/favicon.ico").permitAll()
                .requestMatchers("/error").permitAll()

                .requestMatchers(HttpMethod.POST, "/entregas/atribuir")
                    .hasAuthority("ROLE_GERENTE")

                .requestMatchers(HttpMethod.PATCH, "/entregas/*/notificar-efetuada")
                    .hasAuthority("ROLE_ENTREGADOR")

                .requestMatchers(HttpMethod.PATCH, "/entregas/*/confirmar-recebimento")
                    .hasAuthority("ROLE_CLIENTE")

                .requestMatchers(HttpMethod.PATCH, "/entregas/*/cancelar")
                    .hasAuthority("ROLE_GERENTE")

                .anyRequest().authenticated())
                
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}