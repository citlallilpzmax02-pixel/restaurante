import axios from "axios";

const REST_API_BASE_URL = "https://reservaciones-production-6aad.up.railway.app/api/atender";

// Agregar JWT automáticamente
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

// CRUD con token JWT

export const listaAtenciones = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

export const crearAtencion = (atencion) =>
  axios.post(REST_API_BASE_URL, atencion, { headers: authHeader() });

export const getAtencion = (atencionId) =>
  axios.get(`${REST_API_BASE_URL}/${atencionId}`, { headers: authHeader() });

export const updateAtencion = (atencionId, atencion) =>
  axios.put(`${REST_API_BASE_URL}/${atencionId}`, atencion, { headers: authHeader() });

export const deleteAtencion = (atencionId) =>
  axios.delete(`${REST_API_BASE_URL}/${atencionId}`, { headers: authHeader() });
