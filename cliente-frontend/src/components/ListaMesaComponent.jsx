import React, { useEffect, useState } from 'react';
import { listaMesas, deleteMesa } from "../services/MesaService";
import { listaReservas } from "../services/ReservaService";
import { useNavigate } from 'react-router-dom';

export const ListaMesaComponent = () => {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const navegar = useNavigate();

  useEffect(() => {
    getAllMesas();
    cargarReservas();
  }, []);
  
  function getAllMesas() {
    listaMesas()
      .then((response) => {
        setMesas(response.data);
      })
      .catch((error) => console.error(error));
  }

  function cargarReservas() {
    listaReservas()
      .then((response) => setReservas(response.data))
      .catch((error) => console.error("Error al cargar reservas:", error));
  }

  function nuevaMesa() {
    navegar('/mesa/crear');
  }

  function actualizarMesa(idMesa) {
    navegar(`/mesa/edita/${idMesa}`);
  }

  // ============================================================
  // 🛑 VALIDACIÓN: verificar si la mesa tiene reservas asociadas
  // ============================================================
  function eliminarMesa(idMesa) {
    // Buscar si la mesa aparece en alguna reserva
    const mesaTieneReserva = reservas.some(reserva => reserva.idMesa === idMesa);

    if (mesaTieneReserva) {
      alert("❌ No se puede eliminar esta mesa porque tiene reservas asociadas.");
      return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar esta mesa?")) return;

    deleteMesa(idMesa)
      .then(() => {
        alert("✔️ Mesa eliminada correctamente.");
        getAllMesas();
      })
      .catch((error) => {
        console.error("Error al eliminar mesa:", error);
        alert("❌ Ocurrió un error al eliminar la mesa.");
      });
  }

  return (
    <div className='container'>
      <button
        className="btn text-white mb-3"
        style={{ backgroundColor: '#f28724' }}
        onClick={nuevaMesa}
      >
        ➕Nueva mesa
      </button>

      <h2 className='text-center titulo-clientes'>Lista de mesas</h2>

      <table className="table table-bordered tabla-clientes">
        <thead>
          <tr>
            <th>ID Mesa</th>
            <th>Número</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Evento</th>
          </tr>
        </thead>

        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.idMesa}>
              <td>{mesa.idMesa}</td>
              <td>{mesa.numero}</td>
              <td>{mesa.capacidad}</td>
              <td>{mesa.ubicacion}</td>
              <td>{mesa.estado ? 'Disponible' : 'Ocupada'}</td>

              <td>
                <button
                  className="btn text-white me-2"
                  style={{ backgroundColor: '#f28724' }}
                  onClick={() => actualizarMesa(mesa.idMesa)}
                >
                  📝Actualizar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarMesa(mesa.idMesa)}
                >
                  🗑️Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
