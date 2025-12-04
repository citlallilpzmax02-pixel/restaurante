import React, { useState, useEffect } from 'react';
import { crearVenta, getVenta, updateVenta } from '../services/VentaService';
import { getDetallesByVenta } from '../services/DetalleVentaService'; // ✅
import { listaClientes } from '../services/ClienteService';
import { listaProductos } from '../services/ProductoService';
import { listaEmpleados } from '../services/EmpleadoService';
import { listaAtenciones, crearAtencion } from '../services/AtenderService'; // ✅
import { getReserva } from '../services/ReservaService';
import { useNavigate, useParams } from 'react-router-dom';

export const VentaComponent = () => {
  const [cliente, setCliente] = useState('');
  const [reserva, setReserva] = useState('');
  const [empleado, setEmpleado] = useState('');
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [detalles, setDetalles] = useState([{ idProducto: '', cantidad: 1 }]);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({ cliente: '', detalles: '', empleado: '' });

  const navegar = useNavigate();
  const { id, idReserva } = useParams();

  // 🟠 Si viene desde una reserva, obtener cliente automático
  useEffect(() => {
    if (idReserva) {
      setReserva(idReserva);
      getReserva(idReserva)
        .then(({ data }) => {
          if (data.idCliente) setCliente(String(data.idCliente));
        })
        .catch((err) => console.error('Error al cargar reserva:', err));
    }
  }, [idReserva]);

  // 🟢 Calcular total
  useEffect(() => {
    let totalTemp = 0;
    for (const det of detalles) {
      const prod = productos.find((p) => p.id_producto === Number(det.idProducto));
      if (prod) totalTemp += Number(prod.precioProducto) * Number(det.cantidad || 0);
    }
    setTotal(totalTemp);
  }, [detalles, productos]);

  // 🟣 Cargar catálogos
  useEffect(() => {
    listaClientes().then((res) => setClientes(res.data)).catch(console.error);

    listaProductos()
      .then((response) => {
        const activos = response.data.filter((p) => p.estado === true);
        setProductos(activos);
      })
      .catch(console.error);

    listaEmpleados()
      .then((res) => {
        const meseros = res.data.filter((e) => e.puesto?.toLowerCase() === 'mesero');
        setEmpleados(meseros);
      })
      .catch(console.error);
  }, []);

  // 🔹 NUEVO: cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      // 1️⃣ Cargar datos de la venta
      getVenta(id)
        .then(({ data }) => {
          setCliente(String(data.idCliente));
          setReserva(data.idReserva ? String(data.idReserva) : '');
        })
        .catch((err) => console.error('Error al obtener venta:', err));

      // 2️⃣ Cargar detalles de la venta
      getDetallesByVenta(id)
        .then(({ data }) => {
          const detConvertidos = data.map((d) => ({
            idProducto: d.idProducto,
            cantidad: d.cantidad,
          }));
          setDetalles(detConvertidos);
        })
        .catch((err) => console.error('Error al obtener detalles:', err));

      // 3️⃣ Obtener la atención asociada (para saber el mesero)
      listaAtenciones()
        .then(({ data }) => {
          const registro = data.find((a) => a.idVenta === Number(id));
          if (registro) setEmpleado(String(registro.idEmpleado));
        })
        .catch((err) => console.error('Error al cargar atención:', err));
    }
  }, [id]);

  // 🔍 Validar formulario
  function validaForm() {
    let valido = true;
    const copy = { ...errors };

    if (!cliente.trim()) {
      copy.cliente = 'Debe seleccionar un cliente';
      valido = false;
    } else copy.cliente = '';

    if (!empleado.trim()) {
      copy.empleado = 'Debe seleccionar el mesero que atiende la venta';
      valido = false;
    } else copy.empleado = '';

    if (detalles.length === 0 || detalles.some((d) => !d.idProducto || Number(d.cantidad) <= 0)) {
      copy.detalles = 'Debe agregar al menos un producto válido';
      valido = false;
    } else copy.detalles = '';

    setErrors(copy);
    return valido;
  }

  // ➕➖ Actualizar detalles
  const agregarDetalle = () =>
    setDetalles([...detalles, { idProducto: '', cantidad: 1 }]);

  const eliminarDetalle = (index) => {
    const nuevos = [...detalles];
    nuevos.splice(index, 1);
    setDetalles(nuevos);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevos = [...detalles];
    nuevos[index][campo] = campo === 'cantidad' ? Number(valor) : valor;
    setDetalles(nuevos);
  };

  // 💾 Guardar / actualizar venta
  async function saveVenta(e) {
  e.preventDefault();
  if (!validaForm()) return;

  const venta = {
    idCliente: Number(cliente),
    idReserva: reserva ? Number(reserva) : null,
    detalles: detalles
      .filter(d => d.idProducto && Number(d.cantidad) > 0)
      .map(d => ({ idProducto: Number(d.idProducto), cantidad: Number(d.cantidad) })),
  };

  try {
    // 1) Crear/actualizar venta
    const { data: ventaGuardada } = id
      ? await updateVenta(id, venta)
      : await crearVenta(venta);

    // 2) Armar payload base de atención
    const atenderBase = {
      idEmpleado: Number(empleado),
      idVenta: Number(ventaGuardada.idVenta),
    };

    // 3) Buscar si ya existe atención para esta venta
    const { data: atenciones } = await listaAtenciones();
    const existente = atenciones.find(
      a => Number(a.idVenta ?? a.idventa) === Number(ventaGuardada.idVenta)
    );

    if (existente) {
      const idAtender = Number(existente.idAtender ?? existente.idatender);
      const idEmpleadoExistente = Number(existente.idEmpleado ?? existente.idempleado);

      // 👉 IMPORTANTE: muchos backends exigen idAtender también en el body del PUT
      const atenderPayload = { ...atenderBase, idAtender };

      if (idEmpleadoExistente !== atenderPayload.idEmpleado) {
        await updateAtencion(idAtender, atenderPayload); // PUT /atender/{id}
        console.log('✅ Atención actualizada (mesero cambiado)');
      } else {
        console.log('ℹ️ Atención sin cambios');
      }
    } else {
      await crearAtencion(atenderBase); // POST
      console.log('✅ Atención creada');
    }

    alert(id ? 'Venta actualizada correctamente' : 'Venta registrada correctamente');
    navegar('/venta/lista');
  } catch (error) {
    console.error('Error al guardar venta o atención:', error);
    const msg = error?.response?.data ?? 'Ocurrió un error al registrar la venta.';
    alert(msg);
  }
}


  const cancelar = () => navegar('/venta/lista');

  const pagTitulo = () => (
    <h2 className="text-center">{id ? 'Modificar venta' : 'Registrar venta'}</h2>
  );

  return (
    <div className="container mt-4">
      <div className="form-header text-center mb-4" style={{ color: '#75421e' }}>
        {pagTitulo()}
      </div>

      <form
        className="p-4 shadow rounded mx-auto"
        style={{ backgroundColor: '#fff7e6', maxWidth: '700px' }}
      >
        {/* Cliente */}
        {!reserva && (
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: '#f28724' }}>
              Cliente
            </label>
            <select
              className={`form-select ${errors.cliente ? 'is-invalid' : ''}`}
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
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

        {/* Empleado */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Empleado (Mesero)
          </label>
          <select
            className={`form-select ${errors.empleado ? 'is-invalid' : ''}`}
            value={empleado}
            onChange={(e) => setEmpleado(e.target.value)}
          >
            <option value="">Seleccione un mesero</option>
            {empleados.map((emp) => (
              <option
                key={emp.idEmpleado ?? emp.idempleado}
                value={emp.idEmpleado ?? emp.idempleado}
              >
                {emp.nombre}
              </option>
            ))}
          </select>
          {errors.empleado && <div className="invalid-feedback">{errors.empleado}</div>}
        </div>

        {/* Productos */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>Productos</label>
          {detalles.map((det, index) => (
            <div key={index} className="d-flex align-items-center mb-2 gap-2">
              <select
                className="form-select"
                style={{ flex: 3 }}
                value={det.idProducto}
                onChange={(e) => actualizarDetalle(index, 'idProducto', e.target.value)}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombreProducto} — ${p.precioProducto}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="form-control"
                style={{ flex: 1 }}
                value={det.cantidad}
                onChange={(e) => actualizarDetalle(index, 'cantidad', e.target.value)}
              />

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => eliminarDetalle(index)}
              >
                ✘
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-sm text-white"
            style={{ backgroundColor: '#f28724' }}
            onClick={agregarDetalle}
          >
            ➕Agregar producto
          </button>
        </div>

        {/* Total */}
        <div className="text-center mb-3">
          <h5 style={{ color: '#75421e' }}>Total: 💲{total.toFixed(2)}</h5>
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveVenta}
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
