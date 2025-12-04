package itch.tecnm.proyecto.mapper;

import itch.tecnm.proyecto.dto.ClienteDto;
import itch.tecnm.proyecto.entity.Cliente;

public class ClienteMapper {
	//Conexión entre la entidad y el DTO
		public static ClienteDto mapToClienteDto(Cliente cliente) {
			return new ClienteDto (
					cliente.getIdCliente(),
					cliente.getNombreCliente(),
					cliente.getTelefonoCliente(),
					cliente.getCorreoCliente()
					);
		}
		
		public static Cliente mapToCliente(ClienteDto clienteDto) {
			return new Cliente (
					clienteDto.getIdCliente(),
					clienteDto.getNombreCliente(),
					clienteDto.getTelefonoCliente(),
					clienteDto.getCorreoCliente()
					);
					
		}
}
