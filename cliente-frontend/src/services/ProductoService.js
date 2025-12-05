import axios from "axios";

const REST_API_BASE_URL = "https://fonda-production-64ad.up.railway.app/api/producto";

// Agregar token JWT
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

//  PRODUCTOS CRUD CON JWT

// Obtener todos
export const listaProductos = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

// Obtener por ID
export const getProducto = (productoId) =>
  axios.get(`${REST_API_BASE_URL}/${productoId}`, { headers: authHeader() });

// Eliminar
export const deleteProducto = (productoId) =>
  axios.delete(`${REST_API_BASE_URL}/${productoId}`, { headers: authHeader() });

// Crear producto con imagen
export const crearProducto = (formData) =>
  axios.post(REST_API_BASE_URL, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

//  Actualizar producto con imagen
export const updateProducto = (productoId, formData) =>
  axios.put(`${REST_API_BASE_URL}/${productoId}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

//  Búsquedas
export const buscarProductoPorNombre = (nombre) =>
  axios.get(`${REST_API_BASE_URL}/buscar/nombre/${nombre}`, {
    headers: authHeader(),
  });

export const buscarProductoPorTipo = (idTipo) =>
  axios.get(`${REST_API_BASE_URL}/buscar/tipo/${idTipo}`, {
    headers: authHeader(),
  });

export const buscarProductoPorRangoPrecio = (min, max) =>
  axios.get(`${REST_API_BASE_URL}/buscar/precio`, {
    headers: authHeader(),
    params: { min, max },
  });
