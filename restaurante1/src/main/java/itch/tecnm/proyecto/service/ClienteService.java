package itch.tecnm.proyecto.service;

import java.util.List;

import itch.tecnm.proyecto.dto.ClienteDto;

public interface ClienteService {
	//Agregar un Cliente
		ClienteDto createCliente (ClienteDto clienteDto);
		
		//buscamos cliente por id
		ClienteDto getClienteById(Integer clienteId);
		
		//obtener todos los clientes
		List<ClienteDto> getAllClientes();
		
		//Construir el REST API para modificar
		ClienteDto updateCliente(Integer clienteId, ClienteDto updateCliente);
		
		//Construir DELETE REST API cliente
		void deleteCliente(Integer clienteId);
		
		// Buscar por nombre o parte del nombre
		List<ClienteDto> searchClientesByNombre(String nombreCliente);

}
