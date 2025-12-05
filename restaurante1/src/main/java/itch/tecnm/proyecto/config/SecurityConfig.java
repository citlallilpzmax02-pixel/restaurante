package itch.tecnm.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import itch.tecnm.proyecto.security.JwtAuthenticationFilter;
import itch.tecnm.proyecto.security.JwtUtil;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtil);

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✔ ACTIVA CORS CORRECTAMENTE

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/cliente/**").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/cliente/**")
                    .hasAnyAuthority("cliente", "cajero", "supervisor", "administrador", "mesero")

                .requestMatchers("/api/cliente/**")
                    .hasAnyAuthority("cajero", "supervisor", "administrador")

                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(
            java.util.List.of(
                "https://frontend-production-5988.up.railway.app"
            )
        );

        config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("*"));
        config.setExposedHeaders(java.util.List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); // ✔ MVC correct
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
