package itch.tecnm.proyecto.security;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JwtUtil {

    private final String SECRET = "VGhpcy1pcy1teS1zZWNyZXQtc2VjdXJhLXN1cGVyLWxhcmdhLTEyMzQ1"; // MISMA DEL SECURITY MS

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
