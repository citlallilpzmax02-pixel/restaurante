package itch.tecnm.proyecto.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itch.tecnm.proyecto.dto.UsuarioDto;
import itch.tecnm.proyecto.service.UsuarioService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Crear usuario
    @PostMapping
    public ResponseEntity<UsuarioDto> createUsuario(@RequestBody UsuarioDto usuarioDto) {
        UsuarioDto nuevoUsuario = usuarioService.createUsuario(usuarioDto);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<UsuarioDto>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> getUsuarioById(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.getUsuarioById(id));
    }

    // Buscar usuario por username
    @GetMapping("/username/{username}")
    public ResponseEntity<UsuarioDto> getUsuarioByUsername(@PathVariable String username) {
        return ResponseEntity.ok(usuarioService.getUsuarioByUsername(username));
    }

    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> updateUsuario(
            @PathVariable Integer id,
            @RequestBody UsuarioDto usuarioDto) {

        UsuarioDto actualizado = usuarioService.updateUsuario(id, usuarioDto);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        usuarioService.deleteUsuario(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/by-username/{username}")
    public ResponseEntity<UsuarioDto> getUsuarioByUsername2(@PathVariable String username) {
        return ResponseEntity.ok(usuarioService.getUsuarioByUsername(username));
    }

    
}