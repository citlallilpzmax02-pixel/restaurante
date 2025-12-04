package itch.tecnm.proyecto.service;

import java.util.List;

import itch.tecnm.proyecto.dto.UsuarioDto;
import itch.tecnm.proyecto.entity.Usuario;

public interface UsuarioService {

    // Crear un usuario
    UsuarioDto createUsuario(UsuarioDto usuarioDto);

    // Buscar por ID
    UsuarioDto getUsuarioById(Integer usuarioId);

    // Listar todos los usuarios
    List<UsuarioDto> getAllUsuarios();

    // Actualizar usuario
    UsuarioDto updateUsuario(Integer usuarioId, UsuarioDto usuarioDto);

    // Eliminar usuario
    void deleteUsuario(Integer usuarioId);

    // Buscar por username
    UsuarioDto getUsuarioByUsername(String username);
    
    // ⭐ NUEVO: Buscar entidad completa (para login)
    Usuario getByUsernameEntity(String username);

    // ⭐ NUEVO: Comparar contraseñas
    boolean passwordMatches(String rawPassword, String encodedPassword);
}