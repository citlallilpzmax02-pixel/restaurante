import axios from "axios";

const REST_API_BASE_URL = "http://localhost:7074/api/empleado";

// Agregar token JWT
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

//  CRUD protegido con JWT
export const listaEmpleados = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

export const crearEmpleado = (empleado) =>
  axios.post(REST_API_BASE_URL, empleado, { headers: authHeader() });

export const getEmpleado = (empleadoId) =>
  axios.get(`${REST_API_BASE_URL}/${empleadoId}`, { headers: authHeader() });

export const updateEmpleado = (empleadoId, empleado) =>
  axios.put(`${REST_API_BASE_URL}/${empleadoId}`, empleado, {
    headers: authHeader(),
  });

export const deleteEmpleado = (empleadoId) =>
  axios.delete(`${REST_API_BASE_URL}/${empleadoId}`, {
    headers: authHeader(),
  });

//  Búsquedas específicas
export const buscarEmpleadoPorNombre = (nombre) =>
  axios.get(`${REST_API_BASE_URL}/buscar/nombre/${nombre}`, {
    headers: authHeader(),
  });

export const buscarEmpleadoPorPuesto = (puesto) =>
  axios.get(`${REST_API_BASE_URL}/buscar/puesto/${puesto}`, {
    headers: authHeader(),
  });
