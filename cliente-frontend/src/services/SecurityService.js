import axios from "axios";

const SECURITY_API_BASE_URL = "https://security-production-702c.up.railway.app";

//  Asegurar que axios use el token JWT
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

// ➤ Obtener todos los usuarios
export const listaUsuarios = () =>
  axios.get(SECURITY_API_BASE_URL, { headers: authHeader() });

// ➤ Crear usuario
export const crearUsuario = (usuario) =>
  axios.post(SECURITY_API_BASE_URL, usuario, { headers: authHeader() });

// ➤ Obtener usuario por ID
export const getUsuario = (usuarioId) =>
  axios.get(`${SECURITY_API_BASE_URL}/${usuarioId}`, { headers: authHeader() });

// ➤ Actualizar usuario
export const updateUsuario = (usuarioId, usuario) =>
  axios.put(`${SECURITY_API_BASE_URL}/${usuarioId}`, usuario, { headers: authHeader() });

// ➤ Eliminar usuario
export const deleteUsuario = (usuarioId) =>
  axios.delete(`${SECURITY_API_BASE_URL}/${usuarioId}`, { headers: authHeader() });
