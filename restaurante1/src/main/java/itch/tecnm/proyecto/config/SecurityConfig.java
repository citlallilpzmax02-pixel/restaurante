package itch.tecnm.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import itch.tecnm.proyecto.security.JwtAuthenticationFilter;
import itch.tecnm.proyecto.security.JwtUtil;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
	//MS RESTAURANTE1
    private final JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtil);

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // ⭐ CORRECTO

            .authorizeHttpRequests(auth -> auth

            		 // ⭐ REGISTRO DE CLIENTES — SIN TOKEN
                    .requestMatchers(HttpMethod.POST, "/api/cliente/**")
                        .permitAll()

                    // ⭐ GET CLIENTES — usado por reservas (listaClientes)
                    .requestMatchers(HttpMethod.GET, "/api/cliente/**")
                        .hasAnyAuthority("cliente", "cajero", "supervisor", "administrador","mesero")

                    // ⭐ OPERACIONES ADMINISTRATIVAS (PUT, DELETE)
                    .requestMatchers("/api/cliente/**")
                        .hasAnyAuthority("cajero", "supervisor", "administrador")

                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ⭐ ESTE ES EL BEAN NECESARIO PARA QUE CORS FUNCIONE EN SECURITY
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
        config.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
        config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("*"));
        config.setExposedHeaders(java.util.List.of("Authorization"));
        config.setAllowCredentials(true);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

