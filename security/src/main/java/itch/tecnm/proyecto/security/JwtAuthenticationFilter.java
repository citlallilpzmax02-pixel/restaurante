package itch.tecnm.proyecto.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7);

            Claims claims = jwtUtil.extractAllClaims(token);

            String username = claims.getSubject();
            String rol = claims.get("rol", String.class);

            // Convertir a autoridad de Spring
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(rol);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(username, null, java.util.List.of(authority));

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            System.out.println("❌ Token inválido: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
