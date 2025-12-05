package itch.tecnm.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import itch.tecnm.proyecto.security.JwtAuthenticationFilter;
import itch.tecnm.proyecto.security.JwtUtil;
import itch.tecnm.proyecto.config.CorsFilter;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
	//MS SECURITY
    private final JwtUtil jwtUtil;

    private final CorsFilter corsFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtil);

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})  // habilita CORS
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                .requestMatchers("/api/usuarios/by-username/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**")
                    .hasAnyAuthority("administrador", "supervisor")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**")
                    .hasAnyAuthority("administrador", "supervisor")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**")
                    .hasAnyAuthority("administrador", "supervisor")
                .anyRequest().authenticated()
            );

        // 👇 REGISTRAR CORS ANTES DEL JWT FILTER (muy importante)
        http.addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class);

        // 👇 Luego registrar tu filtro JWT
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
