import axios from "axios";

const REST_API_BASE_URL = "https://fonda-production-64ad.up.railway.app/api/venta";

// Función para agregar token JWT
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

//CRUD COMPLETO PROTEGIDO

// Listar ventas
export const listaVentas = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

// Crear venta
export const crearVenta = (venta) =>
  axios.post(REST_API_BASE_URL, venta, {
    headers: authHeader(),
  });

// Buscar venta por ID
export const getVenta = (ventaId) =>
  axios.get(`${REST_API_BASE_URL}/${ventaId}`, {
    headers: authHeader(),
  });

// Actualizar venta
export const updateVenta = (ventaId, venta) =>
  axios.put(`${REST_API_BASE_URL}/${ventaId}`, venta, {
    headers: authHeader(),
  });

// Eliminar venta
export const deleteVenta = (ventaId) =>
  axios.delete(`${REST_API_BASE_URL}/${ventaId}`, {
    headers: authHeader(),
  });

// Buscar ventas por fecha
export const buscarVentaPorFecha = (fecha) =>
  axios.get(`${REST_API_BASE_URL}/fecha/${fecha}`, {
    headers: authHeader(),
  });
