package itch.tecnm.proyecto.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import itch.tecnm.proyecto.entity.Usuario;

@Component
public class JwtUtil {

    private final String SECRET = "VGhpcy1pcy1teS1zZWNyZXQtc2VjdXJhLXN1cGVyLWxhcmdhLTEyMzQ1";

    public String generateToken(Usuario usuario) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", usuario.getId());
        claims.put("nombre", usuario.getNombre());
        claims.put("rol", usuario.getPerfil());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 8)) // 8 horas
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
    }
}
