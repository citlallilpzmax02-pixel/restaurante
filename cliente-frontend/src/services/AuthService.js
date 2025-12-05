import axios from "axios";

const API_URL = "https://security-production-702c.up.railway.app";

// ===============================
// ⭐ LOGIN (JWT)
// ===============================
export const login = async ({ username, password }) => {
  const response = await axios.post(API_URL, { username, password });

  // El backend regresa: { token, usuario }
  const { token, usuario } = response.data;

  // Guardamos token y usuario
  localStorage.setItem("authToken", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));

  // Configurar token en Axios
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

  // Notificar al header
  window.dispatchEvent(new Event("authChange"));

  return usuario;
};

// ===============================
// ⭐ Obtener usuario actual
// ===============================
export function getUsuarioLogueado() {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
}

// ===============================
// ⭐ LOGOUT
// ===============================
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("usuario");
  delete axios.defaults.headers.common["Authorization"];

  window.dispatchEvent(new Event("authChange"));

  // Redirigir
  window.location.href = "/";
};

// ===============================
// ⭐ Configurar token si había sesión
// (cuando recargas la página)
// ===============================
export function setupAxiosInterceptors() {
  const token = localStorage.getItem("authToken");

  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
}
