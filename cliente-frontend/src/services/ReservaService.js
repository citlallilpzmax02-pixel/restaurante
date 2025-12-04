import axios from "axios";

const REST_API_BASE_URL = "http://localhost:7074/api/reserva";

// Agregar token JWT
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

// CRUD DE RESERVAS (PROTEGIDO)

// Obtener reservas
export const listaReservas = () =>
  axios.get(REST_API_BASE_URL, { headers: authHeader() });

// Crear reserva
export const crearReserva = (reserva) =>
  axios.post(REST_API_BASE_URL, reserva, {
    headers: authHeader(),
  });

// Obtener una reserva
export const getReserva = (reservaId) =>
  axios.get(`${REST_API_BASE_URL}/${reservaId}`, {
    headers: authHeader(),
  });

// Actualizar reserva
export const updateReserva = (reservaId, reserva) =>
  axios.put(`${REST_API_BASE_URL}/${reservaId}`, reserva, {
    headers: authHeader(),
  });

// Eliminar reserva
export const deleteReserva = (reservaId) =>
  axios.delete(`${REST_API_BASE_URL}/${reservaId}`, {
    headers: authHeader(),
  });

// Buscar por fecha
export const buscarReservaPorFecha = (fecha) =>
  axios.get(`${REST_API_BASE_URL}/fecha/${fecha}`, {
    headers: authHeader(),
  });
