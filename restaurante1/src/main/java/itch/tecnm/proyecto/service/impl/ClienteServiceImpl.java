package itch.tecnm.proyecto.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import itch.tecnm.proyecto.dto.ClienteDto;
import itch.tecnm.proyecto.entity.Cliente;
import itch.tecnm.proyecto.mapper.ClienteMapper;
import itch.tecnm.proyecto.repository.ClienteRepository;
import itch.tecnm.proyecto.service.ClienteService;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private ClienteRepository clienteRepository;

    // ===========================================================
    // ⚠️ CREATE — ahora el idCliente debe venir desde el frontend
    // ===========================================================
    @Override
    public ClienteDto createCliente(ClienteDto clienteDto) {

        // 🔥 Validar que el ID venga desde React
        if (clienteDto.getIdCliente() == null) {
            throw new RuntimeException(
                "El idCliente no puede ser nulo. Debe recibirse desde usuario (security)."
            );
        }

        Cliente cliente = ClienteMapper.mapToCliente(clienteDto);

        Cliente savedCliente = clienteRepository.save(cliente);

        return ClienteMapper.mapToClienteDto(savedCliente);
    }

    // ===========================================================
    // GET
    // ===========================================================
    @Override
    public ClienteDto getClienteById(Integer clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId).orElse(null);
        return ClienteMapper.mapToClienteDto(cliente);
    }

    // ===========================================================
    // LIST
    // ===========================================================
    @Override
    public List<ClienteDto> getAllClientes() {

        List<Cliente> clientes = clienteRepository.findAll();

        return clientes.stream()
                .map(ClienteMapper::mapToClienteDto)
                .collect(Collectors.toList());
    }

    // ===========================================================
    // UPDATE
    // ===========================================================
    @Override
    public ClienteDto updateCliente(Integer clienteId, ClienteDto updateCliente) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setNombreCliente(updateCliente.getNombreCliente());
        cliente.setTelefonoCliente(updateCliente.getTelefonoCliente());
        cliente.setCorreoCliente(updateCliente.getCorreoCliente());

        Cliente updateClienteObj = clienteRepository.save(cliente);

        return ClienteMapper.mapToClienteDto(updateClienteObj);
    }

    // ===========================================================
    // DELETE
    // ===========================================================
    @Override
    public void deleteCliente(Integer clienteId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        clienteRepository.delete(cliente);
    }

    // ===========================================================
    // SEARCH
    // ===========================================================
    @Override
    public List<ClienteDto> searchClientesByNombre(String nombreCliente) {
        List<Cliente> clientes = clienteRepository
                .findByNombreClienteContainingIgnoreCase(nombreCliente);

        return clientes.stream()
                .map(ClienteMapper::mapToClienteDto)
                .collect(Collectors.toList());
    }
}
