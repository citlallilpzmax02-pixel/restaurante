import React, { useEffect, useState } from 'react';
import { listaVentas, deleteVenta, buscarVentaPorFecha } from '../services/VentaService';
import { listaClientes } from '../services/ClienteService';
import { listaEmpleados } from '../services/EmpleadoService';
import { listaAtenciones } from '../services/AtenderService';
import { listaReservas } from "../services/ReservaService";
import { useNavigate } from 'react-router-dom';
import { DetalleVentaComponent } from './DetalleVentaComponent';

export const ListaVentaComponent = () => {

  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [atenciones, setAtenciones] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [fechaBusqueda, setFechaBusqueda] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const navegar = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    try {
      const [
        ventasRes,
        clientesRes,
        empleadosRes,
        atencionesRes,
        reservasRes
      ] = await Promise.all([
        listaVentas(),
        listaClientes(),
        listaEmpleados(),
        listaAtenciones(),
        listaReservas()
      ]);

      setClientes(clientesRes.data);
      setEmpleados(empleadosRes.data);
      setAtenciones(atencionesRes.data);
      setReservas(reservasRes.data);

      let ventasFinales = ventasRes.data;

      if (usuario?.perfil === "mesero") {
        ventasFinales = ventasFinales.filter(v =>
          atencionesRes.data.some(a =>
            Number(a.idVenta ?? a.idventa) === Number(v.idVenta) &&
            Number(a.idEmpleado ?? a.idempleado) === Number(usuario.id)
          )
        );
      }

      setVentas(ventasFinales);

    } catch (error) {
      console.error("Error cargando datos: ", error);
    }
  }
    // ============================
    //     BUSCAR POR FECHA
    // ============================
    async function buscarPorFecha(e) {
      e.preventDefault();

      if (!fechaBusqueda) {
        cargarTodo();
        return;
      }

      try {
        const { data } = await buscarVentaPorFecha(fechaBusqueda);

        let ventasFiltradas = data;

        // ⭐ MESERO: solo ver las suyas aun en búsqueda
        if (usuario?.perfil === "mesero") {
          ventasFiltradas = ventasFiltradas.filter(v =>
            atenciones.some(a =>
              Number(a.idVenta ?? a.idventa) === Number(v.idVenta) &&
              Number(a.idEmpleado ?? a.idempleado) === Number(usuario.id)
            )
          );
        }

        setVentas(ventasFiltradas);

      } catch (err) {
        console.error("Error al buscar ventas:", err);
      }
    }

  // ================================================
  // LÓGICA PARA PERMITIR O BLOQUEAR LA EDICIÓN
  // ================================================
  function ventaEditable(venta) {
    const hoy = new Date().toISOString().split("T")[0];
    const fechaVenta = new Date(venta.fechaVenta).toISOString().split("T")[0];

    // Caso 1: Venta SIN reserva → editable solo HOY
    if (!venta.idReserva) {
      return fechaVenta === hoy;
    }

    // Caso 2: Venta CON reserva → se valida contra reservas
    const reserva = reservas.find(r => r.idReserva === venta.idReserva);
    if (!reserva) return false;

    return reserva.fecha === hoy;
  }

  function motivoVentaBloqueada(venta) {
    const hoy = new Date().toISOString().split("T")[0];
    const fechaVenta = new Date(venta.fechaVenta).toISOString().split("T")[0];

    if (!venta.idReserva) {
      if (fechaVenta < hoy) return "⚠ La fecha de la venta ya venció.";
      return "Solo puedes editar la venta el mismo día.";
    }

    const reserva = reservas.find(r => r.idReserva === venta.idReserva);
    if (!reserva) return "Información de reserva no encontrada.";

    if (reserva.fecha < hoy) return "⚠ La fecha de la reserva ya pasó.";
    if (reserva.fecha > hoy) return "Solo puedes editar la venta el día de la reserva.";

    return "⚠ Venta bloqueada.";
  }

  // ===========================
  // ACCIONES
  // ===========================
  function nuevaVenta() {
    navegar('/venta/crear');
  }

  function actualizarVenta(idVenta) {
    navegar(`/venta/edita/${idVenta}`);
  }

  function verDetalle(idVenta) {
    setVentaSeleccionada(idVenta);
    setShowModal(true);
  }

  function eliminarVenta(idVenta) {
    if (!window.confirm("¿Seguro que deseas eliminar esta venta?")) return;

    deleteVenta(idVenta)
      .then(() => {
        alert("Venta eliminada");
        cargarTodo();
      })
      .catch(err => console.error("Error al eliminar venta:", err));
  }

  function formatearFecha(f) {
    try {
      return new Date(f).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return f;
    }
  }

  function obtenerNombreCliente(id) {
    const cli = clientes.find(c => c.idCliente === id);
    return cli ? cli.nombreCliente : `Cliente #${id}`;
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="titulo-clientes text-center flex-grow-1">
          Lista de Ventas
        </h2>

        {(usuario.perfil === "administrador" || usuario.perfil === "cajero") && (
          <button className="btn text-white" style={{ backgroundColor: "#f28724" }} onClick={nuevaVenta}>
            ➕Nueva venta
          </button>
        )}
      </div>
          {/* 🔍 Filtro por fecha */}
        <div className="d-flex justify-content-center mb-4">
          <form
            className="d-flex align-items-center flex-wrap justify-content-center"
            onSubmit={buscarPorFecha}
            style={{ gap: "8px" }}          >
            <label
              className="fw-semibold mb-0"
              style={{ color: "#75421e", minWidth: "130px", textAlign: "right" }}            >
              Buscar por fecha:            </label>
            <input
              type="date"
              value={fechaBusqueda}
              onChange={(e) => setFechaBusqueda(e.target.value)}
              style={{ maxWidth: "200px" }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"            />
            <button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: "#f28724" }}            >
              🔎Buscar            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setFechaBusqueda("");
                cargarTodo();
              }}            >
              🧹Limpiar
            </button>
          </form>
        </div>
      {/* TABLA */}
      <table className="table table-bordered tabla-clientes align-middle">
        <thead className="table-light text-center">
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Reserva</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ventas.length > 0 ? (
            ventas.map(venta => (
              <tr key={venta.idVenta}>
                <td className="text-center">{venta.idVenta}</td>
                <td>{formatearFecha(venta.fechaVenta)}</td>
                <td>{obtenerNombreCliente(venta.idCliente)}</td>
                <td className="text-center">{venta.idReserva ? `#${venta.idReserva}` : "Sin reserva"}</td>
                <td className="text-end">${venta.total?.toFixed(2)}</td>

                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">

                    <button className="btn btn-sm text-white"
                      style={{ backgroundColor: "#2c3e50" }}
                      onClick={() => verDetalle(venta.idVenta)}>
                      👁️Ver detalle
                    </button>

                    {/* EDITAR */}
                    {["mesero", "cajero", "administrador"].includes(usuario.perfil) && (
                      ventaEditable(venta) ? (
                        <button
                          className="btn btn-sm text-white"
                          style={{ backgroundColor: "#f28724" }}
                          onClick={() => actualizarVenta(venta.idVenta)}
                        >
                          📝Editar
                        </button>
                      ) : (
                        <span
                          className="d-inline-block"
                          title={motivoVentaBloqueada(venta)}
                          onClick={() => alert(motivoVentaBloqueada(venta))}
                          style={{ cursor: "not-allowed" }}
                        >
                          <button className="btn btn-sm btn-secondary" disabled style={{ opacity: 0.65 }}>
                            🔒 Venta cerrada
                          </button>
                        </span>
                      )
                    )}

                    {(usuario.perfil === "administrador" || usuario.perfil === "cajero") && (
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarVenta(venta.idVenta)}>
                        🗑️Eliminar
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">❌ No hay ventas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>

      <DetalleVentaComponent
        show={showModal}
        handleClose={() => setShowModal(false)}
        ventaId={ventaSeleccionada}
      />
    </div>
  );
};
