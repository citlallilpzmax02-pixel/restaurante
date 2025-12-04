import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  const rol = usuario?.perfil; // Sacamos el rol directamente

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#f28926" }}>
        <div className="container-fluid">

          {/* LOGO */}
          <div className="d-flex align-items-center">
            <img src="/logo.png" width="60" height="60" alt="Logo" />
            <span className="navbar-brand fw-bold text-white ms-3">Qué Birria</span>
          </div>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav mx-auto">

              <li className="nav-item">
                <Link className="nav-link text-white" to="/">🏠Inicio</Link>
              </li>

              {/* ===========================
                  OPCIONES POR ROL
                 =========================== */}

              {/* CLIENTE */}
              {rol === "cliente" && (
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/reserva/lista">📅Mis Reservas</Link>
                </li>
              )}

              {/* MESERO */}
              {rol === "mesero" && (
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/venta/lista">📊Ventas</Link>
                </li>
              )}

              {/* CAJERO */}
              {rol === "cajero" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/cliente/lista">👥Clientes</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/reserva/lista">📅Reservas</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/venta/lista">📊Ventas</Link>
                  </li>
                </>
              )}

              {/* SUPERVISOR */}
              {rol === "supervisor" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/usuarios/lista">👤Usuarios</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/empleado/lista">👨‍💼Empleados</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/cliente/lista">👥Clientes</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/producto/lista">🍽️Productos</Link>
                  </li>
                </>
                
              )}

              {/* ADMINISTRADOR */}
              {rol === "administrador" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/usuarios/lista">👤Usuarios</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/cliente/lista">👥Clientes</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/empleado/lista">👨‍💼Empleados</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/mesa/lista">📍Mesas</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/tipoProducto/lista">🏷️Tipos de productos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/producto/lista">🍽️Productos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/reserva/lista">📅Reservas</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/venta/lista">📊Ventas</Link>
                  </li>
                  
                </>
              )}

            </ul>

            {/* ZONA DERECHA */}
            <ul className="navbar-nav ms-auto">

              {!usuario && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/login"> 🔐Iniciar sesión</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/usuarios/crear">➕Registrarse</Link>
                  </li>
                </>
              )}

              {usuario && (
                <>
                  <li className="nav-item d-flex align-items-center">
                    <span className="nav-link text-white fw-bold">
                      🤗Bienvenido {usuario.perfil} {usuario.nombre}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={logout}
                      className="btn btn-sm btn-danger ms-2"
                    >
                      ⍈ Cerrar sesión
                    </button>
                  </li>
                </>
              )}

            </ul>

          </div>
        </div>
      </nav>
    </header>
  );
};
