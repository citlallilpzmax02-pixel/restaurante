import React, { useState, useEffect } from "react";
import {
  crearEmpleado,
  getEmpleado,
  updateEmpleado,
} from "../services/EmpleadoService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getUsuario, updateUsuario } from "../services/SecurityService";

export const EmpleadoComponent = () => {
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");

  const [errors, setErrors] = useState({
    nombre: "",
    puesto: "",
  });

  const navegar = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const idUsuario = searchParams.get("idUsuario");
  const nombreFromUsuario = searchParams.get("nombre");
  const puestoFromUsuario = searchParams.get("puesto");

  // Prellenar desde usuario
  useEffect(() => {
    if (nombreFromUsuario) setNombre(nombreFromUsuario);
    if (puestoFromUsuario) setPuesto(puestoFromUsuario);
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    if (!id) return;

    getEmpleado(id)
      .then(({ data }) => {
        setNombre(data.nombre ?? "");
        setPuesto(data.puesto ?? "");
      })
      .catch(console.error);
  }, [id]);

  // Validación
  function validaForm() {
    let valida = true;
    const copy = { ...errors };

    if (!String(nombre).trim()) {
      copy.nombre = "El nombre es requerido";
      valida = false;
    } else copy.nombre = "";

    if (!String(puesto).trim()) {
      copy.puesto = "El puesto es requerido";
      valida = false;
    } else copy.puesto = "";

    setErrors(copy);
    return valida;
  }

  function saveEmpleado(e) {
  e.preventDefault();

  if (!validaForm()) return;

  const empleado = {
    idEmpleado: id ? Number(id) : idUsuario ? Number(idUsuario) : undefined,
    nombre,
    puesto,
  };

  // ======================================
  // SI ES EDICIÓN (id != null)
  // ======================================
  if (id) {
    updateEmpleado(id, empleado)
      .then(() => {
        // 1️⃣ Traer usuario correspondiente
        return getUsuario(id);
      })
      .then(({ data }) => {
        // 2️⃣ Crear objeto actualizando SOLO nombre y perfil
        const usuarioActualizado = {
          nombre: nombre,
          username: data.username,
          perfil: puesto,   // puesto === perfil
          estatus: data.estatus,
          password: null,   // no modificar contraseña
        };

        // 3️⃣ Actualizar usuario
        return updateUsuario(id, usuarioActualizado);
      })
      .then(() => {
        alert("Empleado y usuario actualizados correctamente");
        navegar("/empleado/lista");
      })
      .catch(console.error);

    return;
  }

  // ======================================
  // SI ES NUEVO EMPLEADO
  // ======================================
  crearEmpleado(empleado)
    .then(() => navegar("/empleado/lista"))
    .catch(console.error);
}

  function cancelar() {
    navegar("/empleado/lista");
  }

  function pagTitulo() {
    return id ? "Modificar empleado" : "Agregar empleado";
  }

  return (
    <div className="container mt-4">
      <div className="form-header text-center mb-4" style={{ color: "#75421e" }}>
        <h2>{pagTitulo()}</h2>
      </div>

      <form
        className="p-4 shadow rounded mx-auto"
        style={{ backgroundColor: "#fff7e6", maxWidth: "500px" }}
      >
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Nombre del empleado
          </label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!!nombreFromUsuario}
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre}</div>
          )}
        </div>

        {/* Puesto */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Puesto
          </label>
          <select
            className={`form-select ${errors.puesto ? "is-invalid" : ""}`}
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            disabled={!!puestoFromUsuario}
          >
            <option value="">Seleccione un puesto</option>
            <option value="cajero">Cajero</option>
            <option value="cocinero">Cocinero</option>
            <option value="mesero">Mesero</option>
            <option value="administrador">Administrador</option>
            <option value="supervisor">Supervisor</option>
          </select>
          {errors.puesto && (
            <div className="invalid-feedback">{errors.puesto}</div>
          )}
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveEmpleado}
            className="btn text-white"
            style={{ backgroundColor: "#f28724" }}
          >
            {id ? "🔄Actualizar" : "✅Guardar"}
          </button>
          <button
            type="button"
            className="btn"
            style={{ borderColor: "#f28724", color: "#f28724" }}
            onClick={cancelar}
          >
            ❌Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
