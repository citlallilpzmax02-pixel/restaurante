package itch.tecnm.proyecto.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itch.tecnm.proyecto.entity.Usuario;
import itch.tecnm.proyecto.security.JwtUtil;
import itch.tecnm.proyecto.service.UsuarioService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {

        String username = loginData.get("username");
        String password = loginData.get("password");

        Usuario usuario = usuarioService.getByUsernameEntity(username);

        if (usuario == null) {
            System.out.println("❌ LOGIN FALLIDO → Usuario no existe: " + username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }

        if (!usuario.getEstatus().equals(1)) {
            System.out.println("❌ LOGIN FALLIDO → Usuario inactivo: " + username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario inactivo");
        }

        if (!usuarioService.passwordMatches(password, usuario.getPassword())) {
            System.out.println("❌ LOGIN FALLIDO → Contraseña incorrecta para: " + username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        // GENERAR TOKEN
        String token = jwtUtil.generateToken(usuario);

        // ⭐ LOG DE ÉXITO
        System.out.println("✅ LOGIN EXITOSO → Usuario: " + username);
        System.out.println("🔑 TOKEN: " + token.substring(0, 30) + "...");

        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Inicio de sesión exitoso. Token generado correctamente.");
        response.put("token", token);
        response.put("usuario", usuario);

        return ResponseEntity.ok(response);
    }

}
