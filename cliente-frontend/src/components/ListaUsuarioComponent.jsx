import React, { useEffect, useState } from "react";
import {
  listaUsuarios,
  deleteUsuario,
} from "../services/SecurityService";
import { useNavigate } from "react-router-dom";
import { deleteCliente } from "../services/ClienteService";

export const ListaUsuarioComponent = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navegar = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function cargarUsuarios() {
    listaUsuarios()
      .then((res) => setUsuarios(res.data))
      .catch(console.error);
  }

  function nuevoUsuario() {
    navegar("/usuarios/crear");
  }

  function editarUsuario(id) {
    navegar(`/usuarios/edita/${id}`);
  }

  function eliminarUsuario(id, perfil) {
    if (!window.confirm("¿Eliminar usuario?")) return;

    deleteUsuario(id)
      .then(() => {
        console.log("Usuario eliminado");

        // Eliminar entidad asociada
        if (perfil === "cliente") {
          return deleteCliente(id);
        } else {
          return deleteEmpleado(id);
        }
      })
      .then(() => {
        alert("Usuario y entidad asociada eliminados correctamente");
        cargarUsuarios();
      })
      .catch((error) =>
        console.error("Error al eliminar usuario o entidad asociada:", error)
      );
  }


  return (
    <div className="container mt-4">

      <button
        className="btn text-white mb-3"
        style={{ backgroundColor: "#f28724" }}
        onClick={nuevoUsuario}
      >
        ➕Nuevo usuario
      </button>

      <h2 className="text-center titulo-clientes">Lista de usuarios</h2>

      <table className="table table-bordered tabla-clientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Perfil</th>
            <th>Username</th>
            <th>Estatus</th>
            <th>Fecha registro</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                ❌No hay usuarios registrados
              </td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.perfil}</td>
                <td>{u.username}</td>
                <td>{u.estatus === 1 ? "Activo" : "Inactivo"}</td>
                <td>{u.fechaRegistro}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2 text-white"
                    style={{ backgroundColor: "#f28724" }}
                    onClick={() => editarUsuario(u.id)}
                  >
                    📝Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarUsuario(u.id, u.perfil)}
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
