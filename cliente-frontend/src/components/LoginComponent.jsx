import React, { useState } from "react";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const iniciarSesion = (e) => {
    e.preventDefault();
    setErrorMsg("");

    login({ username, password })
      .then((usuario) => {
        console.log("Usuario logueado:", usuario);

        // ⭐ Validar estatus desde el usuario guardado en el backend
        if (usuario.estatus === 0) {
          setErrorMsg("⚠️ Tu cuenta está suspendida. Contacta al administrador.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("usuario");
          return;
        }

        navigate("/");
      })
      .catch((err) => {
        const msg = err.response?.data;

        if (msg?.includes("inactivo")) {
          setErrorMsg("⚠️ Tu cuenta está suspendida ⚠️");
        } else if (msg?.includes("no encontrado")) {
          setErrorMsg("❌ El usuario no existe ❌");
        } else if (msg?.includes("incorrecta")) {
          setErrorMsg("‼️ La contraseña es incorrecta ‼️");
        } else {
          setErrorMsg("‼️ Usuario o contraseña incorrectos ‼️");
        }
      });
  };


  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="text-center mb-4">Iniciar Sesión</h2>

      <form className="p-4 shadow rounded" style={{ backgroundColor: "#fff7e6" }}>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button
          type="submit"
          className="btn text-white w-100"
          style={{ backgroundColor: "#f28724" }}
          onClick={iniciarSesion}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};
