import React, { useState, useEffect } from 'react';
import { crearReserva, getReserva, updateReserva } from '../services/ReservaService';
import { listaMesas } from '../services/MesaService';
import { listaClientes } from '../services/ClienteService';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsuarioLogueado } from "../services/AuthService";

export const ReservaComponent = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mesa, setMesa] = useState('');
  const [cliente, setCliente] = useState('');
  const [mesas, setMesas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [errors, setErrors] = useState({
    fecha: '',
    hora: '',
    mesa: '',
    cliente: ''
  });

  const usuario = getUsuarioLogueado();
  const rol = usuario?.perfil;


  const navegar = useNavigate();
  const { id } = useParams();

  // Handlers
  const actualizaFecha = (e) => setFecha(e.target.value);
  const actualizaHora = (e) => setHora(e.target.value);
  const actualizaMesa = (e) => setMesa(e.target.value);
  const actualizaCliente = (e) => setCliente(e.target.value);

  // Validación
  function validaForm() {
    let valida = true;
    const copy = { ...errors };

    if (String(fecha).trim())   copy.fecha   = ''; else { copy.fecha   = 'La fecha es requerida'; valida = false; }
    if (String(hora).trim())    copy.hora    = ''; else { copy.hora    = 'La hora es requerida'; valida = false; }
    if (String(mesa).trim())    copy.mesa    = ''; else { copy.mesa    = 'Debe seleccionar una mesa'; valida = false; }
    if (String(cliente).trim()) copy.cliente = ''; else { copy.cliente = 'Debe seleccionar un cliente'; valida = false; }

    setErrors(copy);
    return valida;
  }

  // Cargar datos si es edición
  useEffect(() => {
    if (!id) return;
    getReserva(id)
      .then(({ data }) => {
        setFecha(data.fecha ?? '');
        // Si viene "HH:mm:ss" lo recortamos a "HH:mm" para el input time
        const h = data.hora || '';
        setHora(h.length >= 5 ? h.substring(0, 5) : '');
        // Aceptar tanto DTO plano (idMesa) como entidad anidada (mesa.idMesa)
        const idMesaFromDto = data.idMesa;
        const idMesaFromEntity = data.mesa?.idMesa ?? data.mesa?.id_mesa;
        setMesa(
          idMesaFromDto != null
            ? String(idMesaFromDto)
            : (idMesaFromEntity != null ? String(idMesaFromEntity) : '')
        );
        // Cliente siempre plano en tu backend
        setCliente(data.idCliente != null ? String(data.idCliente) : '');
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Cargar listas
  useEffect(() => {
  // Cargar mesas disponibles
  listaMesas()
    .then((res) => {
      const mesasDisponibles = res.data.filter(mesa => mesa.estado === true);
      setMesas(mesasDisponibles);
    })
    .catch(console.error);

  // Cargar clientes (solo si NO es cliente)
  listaClientes()
    .then((res) => {
      setClientes(res.data);

      // ⭐ AUTO-ASIGNAR cliente si el usuario logueado es CLIENTE
      if (rol === "cliente") {
        console.log("Asignando cliente automáticamente:", usuario.id);
        setCliente(String(usuario.id));  // ← AQUÍ SE ASIGNA
      }
    })
    .catch(console.error);

}, []);


  // Guardar / Actualizar
  function saveReserva(e) {
    e.preventDefault();
    if (!validaForm()) return;

    const reserva = {
      fecha,
      hora,
      idMesa: Number(mesa),
      idCliente: Number(cliente)
    };

    const op = id ? updateReserva(id, reserva) : crearReserva(reserva);

    op
      .then(() => navegar('/reserva/lista'))
      .catch((error) => {
        console.error(error);
        // 🔸 Mostrar mensaje exacto del backend
        const mensaje = error.response?.data || "❌ Ocurrió un error inesperado.";
        alert(mensaje);
      });
  }


  // Cancelar
  function cancelar() {
    navegar('/reserva/lista');
  }

  // Título dinámico
  function pagTitulo() {
    return <h2 className="text-center">{id ? 'Modificar reserva' : 'Registrar reserva'}</h2>;
  }

  return (
    <div className="container mt-4">
      <div className="form-header text-center mb-4" style={{ color: '#75421e' }}>
        {pagTitulo()}
      </div>

      <form className="p-4 shadow rounded mx-auto" style={{ backgroundColor: '#fff7e6', maxWidth: '500px' }}>
        {/* Fecha */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Fecha de reserva:
          </label><br />
          <input
            type="date"
            required
            min={new Date().toISOString().split("T")[0]} // 🔒 evita fechas pasadas
            value={fecha}
            onChange={actualizaFecha}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f28724]"
          />
          {errors.fecha && <div className="invalid-feedback d-block">{errors.fecha}</div>}
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Hora de reserva:
          </label><br />
          <input
            type="time"
            required
            value={hora}
            onChange={actualizaHora}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f28724]"
            min="9:00"
            max="22:00"
            step="900"
          />
          {errors.hora && <div className="invalid-feedback d-block">{errors.hora}</div>}
        </div>

        {/* Mesa */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>Mesa</label>
          <select
            className={`form-select ${errors.mesa ? 'is-invalid' : ''}`}
            value={mesa}
            onChange={actualizaMesa}
          >
            <option value="">Seleccione una mesa</option>
            {mesas.map((m) => {
              const idValor = m.idMesa ?? m.id_mesa; // tolerar ambas formas
              return (
                <option key={idValor} value={idValor}>
                  Mesa {m.numero} — {m.ubicacion}
                </option>
              );
            })}
          </select>
          {errors.mesa && <div className="invalid-feedback">{errors.mesa}</div>}
        </div>

        {/* Cliente */}
        {rol === "cliente" ? (
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: '#f28724' }}>Cliente</label>
            <input
              type="text"
              className="form-control"
              value={usuario.nombre}
              disabled
            />
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: '#f28724' }}>Cliente</label>
            <select
              className={`form-select ${errors.cliente ? 'is-invalid' : ''}`}
              value={cliente}
              onChange={actualizaCliente}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombreCliente}
                </option>
              ))}
            </select>
            {errors.cliente && <div className="invalid-feedback">{errors.cliente}</div>}
          </div>
        )}


        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveReserva}
            className="btn text-white"
            style={{ backgroundColor: '#f28724' }}
          >
            {id ? '🔄Actualizar' : '✅Guardar'}
          </button>
          <button
            type="button"
            className="btn"
            style={{ borderColor: '#f28724', color: '#f28724' }}
            onClick={cancelar}
          >
            ❌Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
