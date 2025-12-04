import axios from "axios";

const REST_API_BASE_URL = "http://localhost:7074/api/mesa";

// Agregar token JWT
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

// CRUD protegido con JWT
export const listaMesas = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

export const crearMesa = (mesa) =>
  axios.post(REST_API_BASE_URL, mesa, { headers: authHeader() });

export const getMesa = (mesaId) =>
  axios.get(`${REST_API_BASE_URL}/${mesaId}`, { headers: authHeader() });

export const updateMesa = (mesaId, mesa) =>
  axios.put(`${REST_API_BASE_URL}/${mesaId}`, mesa, { headers: authHeader() });

export const deleteMesa = (mesaId) =>
  axios.delete(`${REST_API_BASE_URL}/${mesaId}`, { headers: authHeader() });
