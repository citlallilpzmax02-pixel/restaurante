import axios from "axios";

const REST_API_BASE_URL = "https://fonda-production-64ad.up.railway.app/api/tipoProducto";

// Agregar token JWT a cada petición
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

// CRUD COMPLETO CON JWT

// Listar tipos de productos
export const listaTiposProductos = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

// Crear tipo de producto
export const crearTipoProducto = (tipoProducto) =>
  axios.post(REST_API_BASE_URL, tipoProducto, {
    headers: authHeader(),
  });

// Obtener tipo por ID
export const getTipoProducto = (tipoId) =>
  axios.get(`${REST_API_BASE_URL}/${tipoId}`, {
    headers: authHeader(),
  });

// Actualizar tipo de producto
export const updateTipoProducto = (tipoId, tipoProducto) =>
  axios.put(`${REST_API_BASE_URL}/${tipoId}`, tipoProducto, {
    headers: authHeader(),
  });

// Eliminar tipo de producto
export const deleteTipoProducto = (tipoId) =>
  axios.delete(`${REST_API_BASE_URL}/${tipoId}`, {
    headers: authHeader(),
  });
