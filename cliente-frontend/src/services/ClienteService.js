import axios from "axios";

const REST_API_BASE_URL = "http://localhost:7072/api/cliente";

// Agregar token JWT automáticamente
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

// Peticiones protegidas con JWT
export const listaClientes = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

export const crearCliente = (cliente) =>
  axios.post(REST_API_BASE_URL, cliente, { headers: authHeader() });

export const getCliente = (clienteId) =>
  axios.get(`${REST_API_BASE_URL}/${clienteId}`, { headers: authHeader() });

export const updateCliente = (clienteId, cliente) =>
  axios.put(`${REST_API_BASE_URL}/${clienteId}`, cliente, { headers: authHeader() });

export const deleteCliente = (clienteId) =>
  axios.delete(`${REST_API_BASE_URL}/${clienteId}`, { headers: authHeader() });

export const buscarClientes = (nombre) =>
  axios.get(`${REST_API_BASE_URL}/buscar/${nombre}`, { headers: authHeader() });
