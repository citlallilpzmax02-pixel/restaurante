import React, { useEffect, useState } from 'react';
import {
    listaReservas,
    deleteReserva,
    updateReserva,
    buscarReservaPorFecha,
} from '../services/ReservaService';
import { listaMesas, updateMesa } from '../services/MesaService';
import { listaClientes } from '../services/ClienteService';
import { listaVentas } from '../services/VentaService';   
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogueado } from "../services/AuthService";

export const ListaReservaComponent = () => {
    const [reservas, setReservas] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [fechaBusqueda, setFechaBusqueda] = useState('');
    const navegar = useNavigate();
    const usuario = getUsuarioLogueado();
    const rol = usuario?.perfil;
    const idCliente = usuario?.id;

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    async function cargarDatosIniciales() {
        // Ejecutar primero getAllReservas para que el proceso de gestión de mesas
        // tenga las mesas actualizadas antes de que getMesas las cargue para la vista.
        await getAllReservas(); 
        await Promise.all([getMesas(), getClientes()]);
    }

    // =====================================================
    //   CARGA RESERVAS + GESTIONA ESTADO DE MESAS
    // =====================================================
    async function getAllReservas() {
        listaReservas()
            .then((response) => {
                let datos = response.data;

                if (rol === "cliente") {
                    datos = datos.filter(r => r.idCliente === idCliente);
                }

                setReservas(datos);

                // Llama a la función centralizada
                gestionarEstadoMesas(datos);
            })
            .catch((error) => console.error('Error al cargar reservas:', error));
    }

    // =====================================================
    // NUEVA LÓGICA CENTRALIZADA: Determina el estado de TODAS las mesas
    // =====================================================
    async function gestionarEstadoMesas(reservasActuales) {
        const hoy = new Date().toISOString().split("T")[0]; 
        const mesasOcupadasIds = new Set();
        
        // 1. Identificar TODAS las mesas que deben estar OCUPADAS (reserva Conf./Pendiente hoy o futuro)
        reservasActuales.forEach(reserva => {
            if (reserva.estado !== 'Cancelada' && reserva.idMesa) {
                // Si la reserva es de hoy o futura, la mesa debe estar ocupada (estado: false)
                if (reserva.fecha >= hoy) {
                    mesasOcupadasIds.add(reserva.idMesa);
                } 
            }
        });

        // 2. Obtener el estado actual de las mesas para hacer solo las llamadas necesarias
        const mesasActuales = (await listaMesas()).data;
        const promesasActualizacion = [];

        mesasActuales.forEach(mesa => {
            const debeEstarOcupada = mesasOcupadasIds.has(mesa.idMesa);

            // Caso A: Debe estar OCUPADA pero su estado es LIBRE (mesa.estado = true) -> Ocuparla (estado: false)
            if (debeEstarOcupada && mesa.estado) {
                 console.log(`[Ocupando] Mesa ${mesa.numero} (${mesa.idMesa}). Tiene reserva activa hoy/futuro.`);
                 promesasActualizacion.push(updateMesa(mesa.idMesa, { estado: false }));
            }
            
            // Caso B: Debe estar LIBRE pero su estado es OCUPADA (mesa.estado = false) -> Liberarla (estado: true)
            if (!debeEstarOcupada && !mesa.estado) {
                console.log(`[Liberando] Mesa ${mesa.numero} (${mesa.idMesa}). No tiene reservas activas hoy/futuro.`);
                promesasActualizacion.push(updateMesa(mesa.idMesa, { estado: true })); 
            }
        });
        
        try {
            await Promise.all(promesasActualizacion);
            console.log(`✔ Proceso de gestión de estado de mesas completado. Mesas actualizadas: ${promesasActualizacion.length}`);
            // Recargar las mesas para que el frontend muestre el estado correcto
            getMesas(); 
        } catch (error) {
            console.error("❌ Error en el proceso de gestión de estado de mesas:", error);
        }
    }

    function getMesas() {
        listaMesas()
            .then((response) => setMesas(response.data))
            .catch((error) => console.error('Error al cargar mesas:', error));
    }

    function getClientes() {
        listaClientes()
            .then((response) => setClientes(response.data))
            .catch((error) => console.error('Error al cargar clientes:', error));
    }

    function nuevaReserva() {
        navegar('/reserva/crear');
    }

    function actualizarReserva(idReserva) {
        navegar(`/reserva/edita/${idReserva}`);
    }

    function eliminarReserva(idReserva) {
        if (window.confirm('¿Seguro que deseas cancelar esta reserva?')) {
            deleteReserva(idReserva)
                .then(() => {
                    alert('✅ La reserva fue cancelada correctamente.');
                    getAllReservas();
                })
                .catch((error) => {
                    console.error('Error al eliminar reserva:', error);
                    const mensaje = error.response?.data || '❌ Ocurrió un error al cancelar la reserva.';
                    alert(mensaje);
                });
        }
    }

    function cambiarEstado(idReserva, nuevoEstado) {
        const reserva = reservas.find((r) => r.idReserva === idReserva);
        if (!reserva) return;

        const actualizada = { ...reserva, estado: nuevoEstado };

        updateReserva(idReserva, actualizada)
            .then(() => getAllReservas())
            .catch((error) => {
                console.error(error);
                const mensaje = error.response?.data || '❌ No se pudo cambiar el estado.';
                alert(mensaje);
            });
    }

    // =====================================================
    //   REALIZAR VENTA (detección de venta existente)
    // =====================================================
    async function realizarVenta(idReserva) {
        try {
            // 1️⃣ Obtener todas las ventas
            const { data: ventas } = await listaVentas();

            // 2️⃣ Buscar si ya existe una venta con esta reserva
            const ventaExistente = ventas.find(
                v => Number(v.idReserva) === Number(idReserva)
            );

            if (ventaExistente) {
                alert("⚠️ Esta reserva ya tiene una venta registrada. Serás dirigido a actualizarla.");
                navegar(`/venta/edita/${ventaExistente.idVenta}`);
                return;
            }

            // 3️⃣ No existe → crear nueva venta
            navegar(`/venta/crear/${idReserva}`);

        } catch (error) {
            console.error("Error verificando venta existente:", error);
            alert("❌ No se pudo verificar si la reserva ya tenía una venta.");
        }
    }

    /* Buscar reservas por fecha
    function buscarPorFecha(e) {
        e.preventDefault();
        if (!fechaBusqueda) {
            getAllReservas();
            return;
        }
        buscarReservaPorFecha(fechaBusqueda)
            .then((res) => setReservas(res.data))
            .catch((err) => console.error('Error al buscar reservas:', err));
    }*/
    function buscarPorFecha(e) {
        e.preventDefault();
        if (!fechaBusqueda) {
            getAllReservas();  // Si no hay fecha de búsqueda, se cargan todas las reservas
            return;
        }
        buscarReservaPorFecha(fechaBusqueda)
            .then((res) => {
                let reservasFiltradas = res.data;

                // Si el rol es "cliente", filtrar solo las reservas del cliente logueado
                if (rol === "cliente") {
                    reservasFiltradas = reservasFiltradas.filter(r => r.idCliente === idCliente);
                }

                setReservas(reservasFiltradas);  // Actualiza las reservas a mostrar
            })
            .catch((err) => console.error('Error al buscar reservas:', err));
    }


    function limpiarBusqueda() {
        setFechaBusqueda('');
        getAllReservas();
    }

    // =====================================================
    //        VALIDACIONES PARA VENTA DESDE RESERVA
    // =====================================================
    function puedeRealizarVenta(reserva) {
        const ahora = new Date();
        const limiteDia = new Date(reserva.fecha + 'T23:00:00');

        const esMismoDia = ahora.toISOString().split('T')[0] === reserva.fecha;
        const dentroLimite = ahora <= limiteDia;

        return esMismoDia && dentroLimite;
    }

    function motivoVentaBloqueada(reserva) {
        const hoyISO = new Date().toISOString().split('T')[0];
        const ahora = new Date();
        const limiteDia = new Date(reserva.fecha + 'T23:00:00');

        if (reserva.fecha < hoyISO) {
            return '⚠️ La fecha de la reserva ya ha vencido y no se puede realizar la venta.';
        }
        if (reserva.fecha > hoyISO) {
            return 'Solo puedes realizar la venta el día de la reserva.';
        }
        if (ahora > limiteDia) {
            return '⚠️ Ya pasó el horario límite (23:00) de la reserva.';
        }

        return '⚠️ No se puede realizar la venta en este momento.';
    }

    return (
        <div className="container">
            <button
                className="btn text-white mb-3"
                style={{ backgroundColor: '#f28724' }}
                onClick={nuevaReserva}
            >
                ➕Nueva reserva
            </button>

            <h2 className="text-center titulo-clientes mb-3">Lista de reservas</h2>

            {/* ... CÓDIGO DE FILTRO DE BÚSQUEDA ... */}
            {/* 🔍 Búsqueda por fecha */}
          <div className="d-flex justify-content-center mb-4">
            <form
              className="d-flex align-items-center flex-wrap justify-content-center"
              onSubmit={buscarPorFecha}
              style={{ gap: '8px' }}
            >
              <label
                className="fw-semibold mb-0"
                style={{ color: '#75421e', minWidth: '130px', textAlign: 'right' }}
              >
                Buscar por fecha:
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f28724]"
                value={fechaBusqueda}
                onChange={(e) => setFechaBusqueda(e.target.value)}
                style={{ maxWidth: '200px' }}
              />
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: '#f28724' }}
              >
                🔎Buscar
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limpiarBusqueda}
              >
                🧹Limpiar
              </button>
            </form>
          </div>

            <table className="table table-bordered tabla-clientes">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Mesa</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {reservas.length > 0 ? (
                        reservas.map((reserva) => {
                            const mesa = mesas.find((m) => m.idMesa === reserva.idMesa);
                            const cliente = clientes.find((c) => c.idCliente === reserva.idCliente);
                            const habilitado = puedeRealizarVenta(reserva);

                            return (
                                <tr key={reserva.idReserva}>
                                    <td>{reserva.idReserva}</td>
                                    <td>{reserva.fecha}</td>
                                    <td>{reserva.hora}</td>
                                    <td>{mesa ? `Número: ${mesa.numero}, Ubicación: ${mesa.ubicacion}` : 'Sin mesa'}</td>
                                    <td>{cliente ? cliente.nombreCliente : 'Sin cliente'}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                reserva.estado === 'Confirmada'
                                                    ? 'bg-success'
                                                    : reserva.estado === 'Cancelada'
                                                    ? 'bg-danger'
                                                    : 'bg-warning text-dark'
                                            }`}
                                        >
                                            {reserva.estado}
                                        </span>
                                    </td>

                                    <td>
                                        {reserva.estado === 'Pendiente' && (
                                            <>
                                                <button
                                                    className="btn btn-sm text-white me-2"
                                                    style={{ backgroundColor: '#f28724' }}
                                                    onClick={() => actualizarReserva(reserva.idReserva)}
                                                >
                                                    📝Actualizar
                                                </button>

                                                {rol !== "cliente" && (
                                                    <button
                                                        className="btn btn-success btn-sm me-2"
                                                        onClick={() => cambiarEstado(reserva.idReserva, 'Confirmada')}
                                                    >
                                                        ✅Confirmar
                                                    </button>
                                                )}

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminarReserva(reserva.idReserva)}
                                                >
                                                    🗑️Cancelar
                                                </button>
                                            </>
                                        )}

                                        {reserva.estado === 'Confirmada' && (
                                            <>
                                                {habilitado ? (
                                                    <button
                                                        className="btn btn-primary btn-sm me-2"
                                                        onClick={() => realizarVenta(reserva.idReserva)}
                                                    >
                                                        🛒Realizar venta
                                                    </button>
                                                ) : (
                                                    <span
                                                        className="d-inline-block me-2"
                                                        title={motivoVentaBloqueada(reserva)}
                                                        onClick={() => alert(motivoVentaBloqueada(reserva))}
                                                        style={{ cursor: 'not-allowed' }}
                                                    >
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            disabled
                                                            style={{ pointerEvents: 'none', opacity: 0.65 }}
                                                        >
                                                            🛒Realizar venta
                                                        </button>
                                                    </span>
                                                )}

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminarReserva(reserva.idReserva)}
                                                >
                                                    🗑️Cancelar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                {fechaBusqueda
                                    ? `❌No hay reservas registradas para el ${fechaBusqueda}.`
                                    : '❌No hay reservas registradas.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};