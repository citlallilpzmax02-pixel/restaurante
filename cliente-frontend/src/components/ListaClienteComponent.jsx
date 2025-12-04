import React, { useEffect, useState } from "react";
import {
  listaClientes,
  deleteCliente,
  buscarClientes,
} from "../services/ClienteService";

import { deleteUsuario } from "../services/SecurityService";  //  IMPORTANTE
import { useNavigate } from "react-router-dom";

export const ListaClienteComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navegar = useNavigate();

  // 🟠 Cargar todos los clientes al inicio
  useEffect(() => {
    getAllClientes();
  }, []);

  // 🔹 Obtener todos los clientes
  function getAllClientes() {
    listaClientes()
      .then((response) => {
        console.log("Clientes recibidos:", response.data);
        setClientes(response.data);
      })
      .catch((error) => console.error("Error al cargar clientes:", error));
  }

  // 🔍 Búsqueda
  function handleBusqueda(e) {
    const valor = e.target.value;
    setBusqueda(valor);

    if (valor.trim() === "") {
      getAllClientes();
    } else {
      buscarClientes(valor)
        .then((response) => setClientes(response.data))
        .catch((error) => console.error("Error al buscar:", error));
    }
  }

  // ➕ Crear nuevo cliente
  function nuevoCliente() {
    navegar("/usuarios/crear");
  }

  // ✏ Editar cliente
  function editarCliente(id) {
    navegar(`/cliente/edita/${id}`);
  }

  //Eliminar cliente + su usuario correspondiente
  function eliminarCliente(idCliente) {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;

    deleteCliente(idCliente)
      .then(() => {
        console.log("Cliente eliminado");

        // 🧨 Intentar eliminar usuario con el mismo ID
        return deleteUsuario(idCliente);
      })
      .then(() => {
        console.log("Usuario asociado eliminado");
        alert("Cliente y usuario eliminados correctamente");
        getAllClientes();
      })
      .catch((error) => {
        console.error("Error al eliminar cliente o usuario:", error);
        alert("Ocurrió un error al eliminar los datos.");
      });
  }


  return (
    <div className="container">
      {/* Botón nuevo */}
      <button
        className="btn text-white mb-3"
        style={{ backgroundColor: "#f28724" }}
        onClick={nuevoCliente}
      >
        ➕Nuevo cliente
      </button>

      <h2 className="text-center titulo-clientes">Lista de clientes</h2>

      {/* Barra de búsqueda */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="🔎Buscar cliente por nombre..."
          value={busqueda}
          onChange={handleBusqueda}
        />
        <button
          type="button"
            className="btn"
            style={{ borderColor: "#f28724", color: "#75421e" }}
          onClick={() => {
            setBusqueda("");
            getAllClientes();
          }}
        >
          🧹Limpiar
        </button>
      </div>

      {/* Tabla */}
      <table className="table table-bordered tabla-clientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                ❌No hay clientes registrados
              </td>
            </tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente.idCcliente}>
                <td>{cliente.idCliente}</td>
                <td>{cliente.nombreCliente}</td>
                <td>{cliente.telefonoCliente}</td>
                <td>{cliente.correoCliente}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2 text-white"
                    style={{ backgroundColor: "#f28724" }}
                    onClick={() => editarCliente(cliente.idCliente)}
                  >
                    📝Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarCliente(cliente.idCliente)}
                  >
                    🗑️Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
