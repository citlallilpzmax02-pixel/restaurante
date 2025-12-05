import React, { useEffect, useState } from 'react';
import { getVenta } from '../services/VentaService';
import { listaClientes } from '../services/ClienteService';
import { listaEmpleados } from '../services/EmpleadoService';
import { listaProductos } from '../services/ProductoService';
import { getDetallesByVenta, generarTicketPdf } from '../services/DetalleVentaService'; // ✅ importamos generarTicketPdf
import { listaAtenciones } from '../services/AtenderService';
import { getReserva } from '../services/ReservaService';
import { listaMesas } from '../services/MesaService';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const DetalleVentaComponent = ({ show, handleClose, ventaId }) => {
  const [venta, setVenta] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [atencion, setAtencion] = useState(null);
  const [reservaData, setReservaData] = useState(null);
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    if (ventaId && show) {
      getVenta(ventaId)
        .then(async (res) => {
          setVenta(res.data);
          if (res.data.idReserva) {
            const { data: reservaInfo } = await getReserva(res.data.idReserva);
            setReservaData(reservaInfo);
          }
        })
        .catch((err) => console.error('Error al obtener venta:', err));

      getDetallesByVenta(ventaId)
        .then((res) => setDetalles(res.data))
        .catch((err) => console.error('Error al obtener detalles:', err));

      listaClientes().then((res) => setClientes(res.data)).catch(console.error);
      listaEmpleados().then((res) => setEmpleados(res.data)).catch(console.error);
      listaProductos().then((res) => setProductos(res.data)).catch(console.error);
      listaMesas().then((res) => setMesas(res.data)).catch(console.error);

      listaAtenciones()
        .then((res) => {
          const encontrada = res.data.find(
            (a) => a.idVenta === ventaId || a.idventa === ventaId
          );
          setAtencion(encontrada || null);
        })
        .catch((err) => console.error('Error al obtener atenciones:', err));
    }
  }, [ventaId, show]);

  const obtenerCliente = (idCliente) => {
    const c = clientes.find((cli) => cli.idCliente === idCliente);
    return c ? c.nombreCliente : `Cliente #${idCliente}`;
  };

  const obtenerMesero = () => {
    if (!atencion) return '—';
    const emp = empleados.find(
      (e) => e.idEmpleado === atencion.idEmpleado || e.idempleado === atencion.idEmpleado
    );
    return emp ? emp.nombre : `Empleado #${atencion.idEmpleado}`;
  };

  const obtenerMesa = () => {
    if (!reservaData) return '—';
    const mesa = mesas.find(
      (m) => m.idMesa === reservaData.idMesa || m.idmesa === reservaData.idMesa
    );
    return mesa ? ` ${mesa.numero}` : '—';
  };

  const obtenerProducto = (idProducto) => {
    const p = productos.find(
      (prod) => prod.idProducto === idProducto || prod.id_producto === idProducto
    );
    return p ? p.nombreProducto : '—';
  };

  const formatearFecha = (fecha) => {
    try {
      const f = new Date(fecha);
      return f.toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return fecha;
    }
  };

  // Función para imprimir el contenido del modal
  const imprimirTicket = () => {
    const contenidoModal = document.getElementById('ticketVenta'); // Obtenemos el contenido del modal
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    
    ventanaImpresion.document.write('<html><head><title>Imprimir Ticket</title></head><body>');
    ventanaImpresion.document.write(contenidoModal.innerHTML); // Escribimos el contenido del modal en la nueva ventana
    ventanaImpresion.document.write('</body></html>');

    ventanaImpresion.document.close(); // Necesario para que el contenido cargue
    ventanaImpresion.print(); // Ejecutamos la acción de impresión
  };

  if (!venta) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: '#f28724', color: 'white' }}>
        <Modal.Title>📋Detalle de venta #{venta.idVenta}</Modal.Title>
      </Modal.Header>
      <Modal.Body id="ticketVenta">
        <div className="container text-dark">
          <h4 className="text-center mb-3">🎫TICKET DE VENTA🎫</h4>

          <div className="mb-2">
            <strong>No. Venta:</strong> {venta.idVenta} <br />
            <strong>Fecha:</strong> {formatearFecha(venta.fechaVenta)} <br />
            <strong>Cliente:</strong> {obtenerCliente(venta.idCliente)} <br />
            <strong>Reserva asociada:</strong>{' '}
            {venta.idReserva ? `#${venta.idReserva}` : 'Sin reserva'} <br />
            {venta.idReserva && (
              <>
                <strong>Número de mesa:</strong> {obtenerMesa()} <br />
              </>
            )}
            <strong>Atendido por el mesero:</strong> {obtenerMesero()}
          </div>

          <table className="table table-sm mt-3">
            <thead>
              <tr>
                <th>Cant.</th>
                <th>Producto</th>
                <th>Precio U.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d) => (
                <tr key={d.idDetalle}>
                  <td>{d.cantidad}</td>
                  <td>{obtenerProducto(d.idProducto)}</td>
                  <td>💲{d.precioUnitario?.toFixed(2)}</td>
                  <td>💲{(d.cantidad * d.precioUnitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end mt-3">
            <h5 style={{ color: '#f28724' }}>
              Total: ${venta.total?.toFixed(2)}
            </h5>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <button
          className="btn text-white"
          style={{ backgroundColor: '#f28724' }}
          onClick={imprimirTicket} // Llamamos a la función para imprimir el modal
        >
          🧾 Imprimir ticket
        </button>
        <button className="btn btn-secondary" onClick={handleClose}>
          ➜]Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
};
