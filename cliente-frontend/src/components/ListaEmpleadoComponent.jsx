import React, { useEffect, useState } from "react";
import {
  listaEmpleados,
  deleteEmpleado,
  buscarEmpleadoPorNombre,
  buscarEmpleadoPorPuesto,
} from "../services/EmpleadoService";
import { useNavigate } from "react-router-dom";
import { deleteUsuario } from "../services/SecurityService";  

export const ListaEmpleadoComponent = () => {
  const [empleados, setEmpleados] = useState([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [puestoSeleccionado, setPuestoSeleccionado] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    getAllEmpleados();
  }, []);

  function getAllEmpleados() {
    listaEmpleados()
      .then((response) => setEmpleados(response.data))
      .catch((error) => console.error("Error al cargar empleados:", error));
  }

  function realizarBusqueda(e) {
    e?.preventDefault();

    if (criterio === "nombre") {
      if (!busqueda.trim()) {
        getAllEmpleados();
        return;
      }
      buscarEmpleadoPorNombre(busqueda)
        .then((response) => setEmpleados(response.data))
        .catch((error) => console.error("Error al buscar empleados:", error));
    } else if (criterio === "puesto") {
      if (!puestoSeleccionado) {
        getAllEmpleados();
        return;
      }
      buscarEmpleadoPorPuesto(puestoSeleccionado)
        .then((response) => setEmpleados(response.data))
        .catch((error) => console.error("Error al buscar por puesto:", error));
    }
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setPuestoSeleccionado("");
    setCriterio("nombre");
    getAllEmpleados();
  }

  function nuevoEmpleado() {
    navegar("/usuarios/crear");
  }

  function actualizarEmpleado(id) {
    navegar(`/empleado/edita/${id}`);
  }

  function eliminarEmpleado(idEmpleado) {
  if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

  deleteEmpleado(idEmpleado)
    .then(() => {
      console.log("Empleado eliminado");

      // Eliminar usuario asociado
      return deleteUsuario(idEmpleado);
    })
    .then(() => {
      alert("Empleado y usuario eliminados correctamente");
      getAllEmpleados();
    })
    .catch((error) => {
      console.error("Error al eliminar empleado/usuario:", error);
      alert("Ocurrió un error al eliminar los datos.");
    });
}


  return (
    <div className="container">
      {/* 🔸 Botón nuevo */}
      <button
        className="btn text-white mb-3"
        style={{ backgroundColor: "#f28724" }}
        onClick={nuevoEmpleado}
      >
        ➕Nuevo empleado
      </button>

      <h2 className="text-center titulo-clientes">Lista de empleados</h2>

      {/* 🔍 Filtros de búsqueda */}
      <form
        className="d-flex justify-content-center align-items-center flex-wrap mb-4"
        onSubmit={realizarBusqueda}
        style={{ gap: "8px" }}
      >
        {/* 🔶 Etiqueta del filtro */}
        <label
          className="fw-semibold mb-0"
          style={{ color: "#75421e", minWidth: "140px", textAlign: "right" }}
        >
          ☰Filtro de búsqueda:
        </label>

        {/* 🔶 Selector del criterio */}
        <select
          className="form-select"
          style={{ maxWidth: "180px" }}
          value={criterio}
          onChange={(e) => {
            setCriterio(e.target.value);
            setBusqueda("");
            setPuestoSeleccionado("");
          }}
        >
          <option value="nombre">Nombre</option>
          <option value="puesto">Puesto</option>
        </select>

        {/* 🔶 Campo dinámico según criterio */}
        {criterio === "nombre" ? (
          <input
            type="text"
            className="form-control"
            placeholder="Escribe el nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ maxWidth: "300px" }}
          />
        ) : (
          <select
            className="form-select"
            value={puestoSeleccionado}
            onChange={(e) => setPuestoSeleccionado(e.target.value)}
            style={{ maxWidth: "300px" }}
          >
            <option value="">Selecciona un puesto</option>
            <option value="cocinero">Cocinero</option>
            <option value="mesero">Mesero</option>
            <option value="cajero">Cajero</option>
            <option value="administrador">Administrador</option>
            <option value="supervisor">Supervisor</option>
          </select>
        )}

        {/* 🔶 Botones */}
        <button
          type="submit"
          className="btn text-white"
          style={{ backgroundColor: "#f28724" }}
        >
          🔎Buscar
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={limpiarBusqueda}
        >
          🧹Limpiar
        </button>
      </form>

      
      <table className="table table-bordered tabla-clientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Evento</th>
          </tr>
        </thead>
        <tbody>
          {empleados.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                ❌No hay empleados registrados
              </td>
            </tr>
          ) : (
            empleados.map((empleado) => (
              <tr key={empleado.idEmpleado}>
                <td>{empleado.idEmpleado}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.puesto}</td>
                <td>
                  <button
                    className="btn text-white me-2"
                    style={{ backgroundColor: "#f28724" }}
                    onClick={() => actualizarEmpleado(empleado.idEmpleado)}
                  >
                    📝Actualizar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarEmpleado(empleado.idEmpleado)}
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
