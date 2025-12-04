package itch.tecnm.proyecto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import itch.tecnm.proyecto.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
	// 🔍 Buscar clientes cuyo nombre contenga cierta cadena (insensible a mayúsculas/minúsculas)
    List<Cliente> findByNombreClienteContainingIgnoreCase(String nombreCliente);
}
