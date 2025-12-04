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

import itch.tecnm.proyecto.dto.ClienteDto;
import itch.tecnm.proyecto.service.ClienteService;
import lombok.AllArgsConstructor;
//Para conectar con react
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/cliente")
public class ClienteController {
	
    private ClienteService clienteService;

    // 🔹 Crear cliente — el ID debe venir desde SECURITY → React
    @PostMapping
    public ResponseEntity<ClienteDto> crearCliente(@RequestBody ClienteDto clienteDto) {
        ClienteDto guardarCliente = clienteService.createCliente(clienteDto);
        return new ResponseEntity<>(guardarCliente, HttpStatus.CREATED);
    }

    // 🔹 Obtener por ID
    @GetMapping("{id}")
    public ResponseEntity<ClienteDto> getClienteById(@PathVariable("id") Integer clienteId) {
        ClienteDto clienteDto = clienteService.getClienteById(clienteId);
        return ResponseEntity.ok(clienteDto);
    }

    // 🔹 Obtener todos
    @GetMapping
    public ResponseEntity<List<ClienteDto>> getAllClientes() {
        List<ClienteDto> clientes = clienteService.getAllClientes();
        return ResponseEntity.ok(clientes);
    }

    // 🔹 Update
    @PutMapping("{id}")
    public ResponseEntity<ClienteDto> updateCliente(
            @PathVariable("id") Integer id,
            @RequestBody ClienteDto updateCliente) {

        ClienteDto clienteDto = clienteService.updateCliente(id, updateCliente);
        return ResponseEntity.ok(clienteDto);
    }

    // 🔹 Delete
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteCliente(@PathVariable("id") Integer clienteId) {
        clienteService.deleteCliente(clienteId);
        return ResponseEntity.ok("Registro eliminado");
    }

    // 🔹 Buscar por nombre
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<ClienteDto>> buscarClientesPorNombre(
            @PathVariable("nombre") String nombre) {

        List<ClienteDto> clientes = clienteService.searchClientesByNombre(nombre);
        return ResponseEntity.ok(clientes);
    }
}
