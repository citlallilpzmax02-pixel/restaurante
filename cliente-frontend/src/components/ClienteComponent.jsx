import React, { useState, useEffect } from "react";
import { crearCliente, getCliente, updateCliente } from "../services/ClienteService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateUsuario, deleteUsuario } from "../services/SecurityService";

export const ClienteComponent = () => {
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [correoCliente, setCorreoCliente] = useState("");

  const [errors, setErrors] = useState({
    nombreCliente: "",
    telefonoCliente: "",
    correoCliente: "",
  });

  const navegar = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const idUsuario = searchParams.get("idUsuario");
  const nombreFromUsuario = searchParams.get("nombre");

  // Prellenar nombre al venir desde usuario
  useEffect(() => {
    if (nombreFromUsuario) {
      setNombreCliente(nombreFromUsuario);
    }
  }, [nombreFromUsuario]);

  // Cargar datos si es edición
  useEffect(() => {
    if (!id) return;

    getCliente(id)
      .then(({ data }) => {
        setNombreCliente(data.nombreCliente ?? "");
        setTelefonoCliente(data.telefonoCliente ?? "");
        setCorreoCliente(data.correoCliente ?? "");
      })
      .catch(console.error);
  }, [id]);

  // Validación
  function validaForm() {
    let valida = true;
    const copy = { ...errors };

    if (!nombreCliente.trim()) {
      copy.nombreCliente = "El nombre es requerido";
      valida = false;
    } else copy.nombreCliente = "";

    if (!telefonoCliente.trim()) {
      copy.telefonoCliente = "El teléfono es requerido";
      valida = false;
    } else copy.telefonoCliente = "";

    if (!correoCliente.trim()) {
      copy.correoCliente = "El correo es requerido";
      valida = false;
    } else copy.correoCliente = "";

    setErrors(copy);
    return valida;
  }

  function saveCliente(e) {
    e.preventDefault();

    if (!validaForm()) return;

    const cliente = {
      idCliente: id ? Number(id) : Number(idUsuario),
      nombreCliente,
      telefonoCliente,
      correoCliente,
    };

    const loggedUser = JSON.parse(localStorage.getItem("usuario"));

    // SI ES EDICIÓN NORMAL
    if (id) {
      updateCliente(id, cliente)
        .then(() => {
          updateUsuario(id, { nombre: nombreCliente })
            .then(() => navegar("/cliente/lista"));
        })
        .catch(console.error);
      return;
    }

    // SI ES CLIENTE NUEVO (CREACIÓN)
    crearCliente(cliente)
      .then(() => {
        // 🔹 Personal del restaurante: admin, supervisor o cajero
        if (loggedUser) {
          navegar("/cliente/lista");
        } 
        // 🔹 Registro público de cliente
        else {
          alert("Registro completado. Ahora puedes iniciar sesión.");
          navegar("/login");
        }
      })
      .catch(console.error);
  }



  async function cancelar() {
    const loggedUser = JSON.parse(localStorage.getItem("usuario"));

    // SI VIENE DESDE REGISTRO DE CLIENTE (NO HAY PERSONAL LOGUEADO)
    if (!loggedUser && idUsuario) {
      const confirmar = window.confirm(
        "No completaste tu registro, tu cuenta será eliminada. ¿Deseas cancelar?"
      );

      if (!confirmar) return;

      // ❗ Eliminar usuario incompleto
      await deleteUsuario(idUsuario).catch(() => null);

      navegar("/");
      return;
    }

    // SI ES ADMIN / SUPERVISOR / CAJERO CREANDO CLIENTES
    if (loggedUser && idUsuario) {
      const confirmar = window.confirm(
        "Este usuario no ha sido registrado completamente. ¿Eliminarlo?"
      );

      if (confirmar) {
        await deleteUsuario(idUsuario).catch(() => null);
      }

      navegar("/cliente/lista");
      return;
    }

    // Si está editando un cliente existente
    navegar("/cliente/lista");
  }

  function pagTitulo() {
    return id ? "Modificar cliente" : "Agregar cliente";
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
            Nombre del Cliente
          </label>
          <input
            type="text"
            className={`form-control ${errors.nombreCliente ? "is-invalid" : ""}`}
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            disabled={!!nombreFromUsuario}
          />
          {errors.nombreCliente && (
            <div className="invalid-feedback">{errors.nombreCliente}</div>
          )}
        </div>

        {/* Teléfono */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Teléfono
          </label>
          <input
            type="tel"
            className={`form-control ${errors.telefonoCliente ? "is-invalid" : ""}`}
            value={telefonoCliente}
            onChange={(e) => setTelefonoCliente(e.target.value)}
          />
          {errors.telefonoCliente && (
            <div className="invalid-feedback">{errors.telefonoCliente}</div>
          )}
        </div>

        {/* Correo */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Correo
          </label>
          <input
            type="email"
            className={`form-control ${errors.correoCliente ? "is-invalid" : ""}`}
            value={correoCliente}
            onChange={(e) => setCorreoCliente(e.target.value)}
          />
          {errors.correoCliente && (
            <div className="invalid-feedback">{errors.correoCliente}</div>
          )}
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveCliente}
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
