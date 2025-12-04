import React, { useState, useEffect } from "react";
import {
  crearUsuario,
  getUsuario,
  updateUsuario,
} from "../services/SecurityService";
import { useNavigate, useParams } from "react-router-dom";
import { getCliente, updateCliente, deleteCliente} from "../services/ClienteService";
import { getEmpleado, updateEmpleado, deleteEmpleado, crearEmpleado } from "../services/EmpleadoService";

export const UsuarioComponent = () => {
  const [nombre, setNombre] = useState("");
  const [perfil, setPerfil] = useState("");
  const [username, setUsername] = useState("");
  const [estatus, setEstatus] = useState(1);
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    nombre: "",
    perfil: "",
    username: "",
  });

  const navegar = useNavigate();
  const { id } = useParams();

  // Obtener usuario logueado
  const loggedUser = JSON.parse(localStorage.getItem("usuario"));

  // ================================
  // PERFILES PERMITIDOS SEGÚN ROL
  // ================================
  function perfilesPermitidos() {
    let list;

    if (!loggedUser) {
      list = ["cliente"];
    } else {
      const rol = loggedUser.perfil;

      switch (rol) {
        case "cajero":
          list = ["cliente"];
          break;
        case "supervisor":
          list = ["cliente", "mesero", "cocinero", "cajero"];
          break;
        case "administrador":
          list = [
            "cliente",
            "mesero",
            "cocinero",
            "cajero",
            "administrador",
            "supervisor",
          ];
          break;
        default:
          list = ["cliente"];
      }
    }

    if (id && perfil && !list.includes(perfil)) {
      list.push(perfil);
    }

    return list;
  }

  // ============================
  // VALIDACIONES
  // ============================
  function validaForm() {
    let valido = true;
    const errorscopy = { ...errors };

    if (nombre.trim()) errorscopy.nombre = "";
    else {
      errorscopy.nombre = "El nombre es requerido";
      valido = false;
    }

    if (perfil.trim()) errorscopy.perfil = "";
    else {
      errorscopy.perfil = "El perfil es requerido";
      valido = false;
    }

    if (username.trim()) errorscopy.username = "";
    else {
      errorscopy.username = "El username es requerido";
      valido = false;
    }

    setErrors(errorscopy);
    return valido;
  }

  // ============================
  // Cargar datos si es edición
  // ============================
  useEffect(() => {
    if (!id) return;

    getUsuario(id)
      .then(({ data }) => {
        setNombre(data.nombre ?? "");
        setPerfil(data.perfil ?? "");
        setUsername(data.username ?? "");
        setEstatus(data.estatus ?? 1);
        setPassword("");
      })
      .catch(console.error);
  }, [id]);

  // ============================
  // CREAR O ACTUALIZAR
  // ============================
  function saveUsuario(e) {
    e.preventDefault();
    if (!validaForm()) return;

    const usuario = {
      nombre,
      perfil,
      username,
      estatus,
      password: password || null,
    };

    // ==========================================
    //      SI ES EDICIÓN
    // ==========================================
    if (id) {
      getUsuario(id).then(({ data: usuarioAnterior }) => {
        const perfilAnterior = usuarioAnterior.perfil;

        updateUsuario(id, usuario)
          .then(async () => {
            // ==========================================
            //      SI NO CAMBIÓ EL PERFIL
            // ==========================================
            if (perfilAnterior === perfil) {
              if (perfil === "cliente") {
                const cli = await getCliente(id).catch(() => null);

                if (cli?.data) {
                  await updateCliente(id, {
                    idCliente: id,
                    nombreCliente: nombre,
                    telefonoCliente: cli.data.telefonoCliente,
                    correoCliente: cli.data.correoCliente,
                  });
                }
              }

              if (["cajero","mesero","cocinero","supervisor","administrador"].includes(perfil)) {
                const emp = await getEmpleado(id).catch(() => null);

                if (emp?.data) {
                  await updateEmpleado(id, {
                    idEmpleado: id,
                    nombre,
                    puesto: perfil,
                  });
                }
              }

              return "ok";
            }

            // ==========================================
            //      SI CAMBIÓ DE CLIENTE → EMPLEADO
            // ==========================================
            if (
              perfilAnterior === "cliente" &&
              ["cajero","mesero","cocinero","supervisor","administrador"].includes(perfil)
            ) {
              await deleteCliente(id).catch(() => null);

              await crearEmpleado({
                idEmpleado: id,
                nombre,
                puesto: perfil,
              });

              return "ok";
            }

            // ==========================================
            //      SI CAMBIÓ DE EMPLEADO → CLIENTE
            // ==========================================
            if (
              ["cajero","mesero","cocinero","supervisor","administrador"].includes(perfilAnterior) &&
              perfil === "cliente"
            ) {
              await deleteEmpleado(id).catch(() => null);

              // 🚀 INDICAR QUE HAY REDIRECCIÓN PERSONALIZADA
              navegar(`/cliente/crear?idUsuario=${id}&nombre=${nombre}`);
              return "redirect"; // <-- IMPORTANTE
            }

            return "ok";
          })
          .then((estado) => {
            if (estado !== "redirect") {
              navegar("/usuarios/lista");
            }
          })
          .catch((err) => console.error("ERROR AL ACTUALIZAR USUARIO:", err));
      });

      return;
    }


    // ==========================================
    //       SI ES CREACIÓN (NO SE TOCA)
    // ==========================================
    crearUsuario(usuario)
      .then((response) => {
        const nuevo = response.data;
        const idUsuario = nuevo.id;

        if (perfil === "cliente") {
          navegar(`/cliente/crear?idUsuario=${idUsuario}&nombre=${nombre}`);
        } else {
          navegar(`/empleado/crear?idUsuario=${idUsuario}&nombre=${nombre}&puesto=${perfil}`);
        }
      })
      .catch(console.error);
  }


  function cancelar() {
    const logged = JSON.parse(localStorage.getItem("usuario"));

    // Si NO hay usuario logueado → es un cliente creando su cuenta
    if (!logged) {
      navegar("/");
      return;
    }
    
    // ⭐ Caso 2: Cajero registrando clientes
    if (logged.perfil === "cajero") {
      navegar("/cliente/lista");
      return;
    }

    // ⭐ Caso 3: Admin o Supervisor
    if (logged.perfil === "administrador" || logged.perfil === "supervisor") {
      navegar("/usuarios/lista");
      return;
    }
  }

  function pagTitulo() {
    return id ? "Modificar usuario" : "Agregar usuario";
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
            Nombre completo
          </label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre del usuario"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        {/* Perfil */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Perfil
          </label>

          <select
            className={`form-control ${errors.perfil ? "is-invalid" : ""}`}
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
          >
            <option value="">Seleccione un perfil</option>

            {perfilesPermitidos().map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>

          {errors.perfil && <div className="invalid-feedback">{errors.perfil}</div>}
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Username
          </label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario (login)"
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dejar vacío si no desea cambiarla"
          />
        </div>

        {/* Estatus */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#f28724" }}>
            Estatus
          </label>

          <select
            className="form-control"
            value={estatus}
            onChange={(e) => setEstatus(e.target.value)}
            disabled={!id}
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveUsuario}
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
