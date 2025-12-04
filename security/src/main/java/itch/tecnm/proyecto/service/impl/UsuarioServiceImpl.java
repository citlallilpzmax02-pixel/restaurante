package itch.tecnm.proyecto.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import itch.tecnm.proyecto.dto.UsuarioDto;
import itch.tecnm.proyecto.entity.Usuario;
import itch.tecnm.proyecto.mapper.UsuarioMapper;
import itch.tecnm.proyecto.repository.UsuarioRepository;
import itch.tecnm.proyecto.service.UsuarioService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // =====================================================
    // 🔹 Crear usuario
    // =====================================================
    @Override
    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {

        // Validar si el username ya existe
        if (usuarioRepository.existsByUsername(usuarioDto.getUsername())) {
            throw new RuntimeException("El username ya está en uso.");
        }

        // Convertir DTO → Entidad
        Usuario usuario = UsuarioMapper.mapToUsuario(usuarioDto);

        // Encriptar contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));

        // Guardar en BD
        Usuario guardado = usuarioRepository.save(usuario);

        // Entidad → DTO
        return UsuarioMapper.mapToUsuarioDto(guardado);
    }

    // =====================================================
    // 🔹 Buscar por ID
    // =====================================================
    @Override
    public UsuarioDto getUsuarioById(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        return UsuarioMapper.mapToUsuarioDto(usuario);
    }

    // =====================================================
    // 🔹 Listar todos
    // =====================================================
    @Override
    public List<UsuarioDto> getAllUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper::mapToUsuarioDto)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioDto updateUsuario(Integer usuarioId, UsuarioDto usuarioDto) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        // =====================================================
        // 🔹 Validación: username ya existe en otro usuario
        // =====================================================
        if (usuarioDto.getUsername() != null && !usuarioDto.getUsername().isBlank()) {

            boolean existe = usuarioRepository.existsByUsername(usuarioDto.getUsername());

            // Si el username existe y no es del mismo usuario → ERROR
            if (existe && !usuario.getUsername().equals(usuarioDto.getUsername())) {
                throw new RuntimeException("El username ya está en uso. Elige uno diferente.");
            }

            usuario.setUsername(usuarioDto.getUsername());
        }

        // =====================================================
        // 🔹 Actualizar nombre (si viene)
        // =====================================================
        if (usuarioDto.getNombre() != null && !usuarioDto.getNombre().isBlank()) {
            usuario.setNombre(usuarioDto.getNombre());
        }

        // =====================================================
        // 🔹 Actualizar perfil (si viene)
        // =====================================================
        if (usuarioDto.getPerfil() != null && !usuarioDto.getPerfil().isBlank()) {
            usuario.setPerfil(usuarioDto.getPerfil());
        }

        // =====================================================
        // 🔹 Actualizar estatus (si viene, 0 o 1)
        // =====================================================
        if (usuarioDto.getEstatus() != null) {
            usuario.setEstatus(usuarioDto.getEstatus());
        }

        // =====================================================
        // 🔹 Actualizar contraseña (si viene)
        // =====================================================
        if (usuarioDto.getPassword() != null && !usuarioDto.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));
        }

        // ❌ JAMÁS tocar fechaRegistro

        Usuario actualizado = usuarioRepository.save(usuario);
        return UsuarioMapper.mapToUsuarioDto(actualizado);
    }


    // =====================================================
    // 🔹 Eliminar usuario
    // =====================================================
    @Override
    public void deleteUsuario(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        usuarioRepository.delete(usuario);
    }

    // =====================================================
    // 🔹 Buscar por username (para login)
    // =====================================================
    @Override
    public UsuarioDto getUsuarioByUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));

        return UsuarioMapper.mapToUsuarioDto(usuario);
    }
    
	 // =====================================================
	 // ⭐ Buscar entidad completa por username (para login)
	 // =====================================================
	 @Override
	 public Usuario getByUsernameEntity(String username) {
	     return usuarioRepository.findByUsername(username)
	             .orElse(null); // Return null si no existe
	 }
	
	 // =====================================================
	 // ⭐ Validar contraseña (raw vs encriptada)
	 // =====================================================
	 @Override
	 public boolean passwordMatches(String rawPassword, String encodedPassword) {

	     // ⚠️ Quitar prefijo {bcrypt} si existe
	     if (encodedPassword.startsWith("{bcrypt}")) {
	         encodedPassword = encodedPassword.substring("{bcrypt}".length());
	     }

	     return passwordEncoder.matches(rawPassword, encodedPassword);
	 }
/*
	// =====================================================
	// 🔧 Método temporal para generar hashes de contraseña
	// =====================================================
	public void generarPassword(String raw) {
	    String hash = passwordEncoder.encode(raw);
	    System.out.println("HASH para '" + raw + "' → " + hash);
	}
	
	@PostConstruct
	public void generarHashesIniciales() {
	    System.out.println("\n========= GENERANDO HASHES =========");

	    generarPassword("pjoel1");     // contraseña de joel
	    generarPassword("palber1");    // contraseña de alberto
	    generarPassword("padmin1");    // contraseña de admin

	    System.out.println("=====================================\n");
	}*/
}