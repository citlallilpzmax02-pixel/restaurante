package itch.tecnm.proyecto.mapper;

import itch.tecnm.proyecto.dto.UsuarioDto;
import itch.tecnm.proyecto.entity.Usuario;

public class UsuarioMapper {

    // ENTIDAD → DTO
	 public static UsuarioDto mapToUsuarioDto(Usuario usuario) {
	        return new UsuarioDto(
	                usuario.getId(),
	                usuario.getNombre(),
	                usuario.getPerfil(),
	                usuario.getUsername(),
	                usuario.getEstatus(),
	                usuario.getFechaRegistro(),
	                null
	        );
	    }


    // DTO → ENTIDAD
	 public static Usuario mapToUsuario(UsuarioDto dto) {
	        Usuario usuario = new Usuario();
	        usuario.setId(dto.getId());
	        usuario.setNombre(dto.getNombre());
	        usuario.setPerfil(dto.getPerfil());
	        usuario.setUsername(dto.getUsername());
	        usuario.setEstatus(dto.getEstatus());
	        usuario.setPassword(dto.getPassword());
	        // ⭐ fechaRegistro se asigna SOLO en la entidad con @PrePersist
	        return usuario;
	    }

}