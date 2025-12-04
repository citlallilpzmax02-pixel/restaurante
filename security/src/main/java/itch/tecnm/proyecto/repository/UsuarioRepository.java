package itch.tecnm.proyecto.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import itch.tecnm.proyecto.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Buscar por username (importante para login)
    Optional<Usuario> findByUsername(String username);

    // Validar si ya existe un username
    boolean existsByUsername(String username);
}
