import React, { useEffect, useState } from "react";
import {
  listaProductos,
  deleteProducto,
  buscarProductoPorNombre,
  buscarProductoPorTipo,
  buscarProductoPorRangoPrecio,
} from "../services/ProductoService";
import { listaTiposProductos } from "../services/TipoProductoService";
import { useNavigate } from "react-router-dom";

export const ListaProductosComponent = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);

  // Estados para búsqueda
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const navegar = useNavigate();

  useEffect(() => {
    getAllProductos();
    getTipos();
  }, []);

  function getAllProductos() {
    listaProductos()
      .then((response) => {
        const activos = response.data.filter((p) => p.estado === true);
        setProductos(activos);
      })
      .catch((error) => console.error(error));
  }

  function getTipos() {
    listaTiposProductos()
      .then((response) => setTipos(response.data))
      .catch((error) => console.error(error));
  }

  // 🔍 Buscar según el criterio seleccionado
  function realizarBusqueda(e) {
    e.preventDefault();

    if (criterio === "nombre") {
      if (!busqueda.trim()) return getAllProductos();
      buscarProductoPorNombre(busqueda)
        .then((res) => setProductos(res.data))
        .catch(console.error);
    } else if (criterio === "tipo") {
      if (!tipoSeleccionado) return getAllProductos();
      buscarProductoPorTipo(tipoSeleccionado)
        .then((res) => setProductos(res.data))
        .catch(console.error);
    } else if (criterio === "precio") {
      if (!precioMin || !precioMax) return getAllProductos();
      buscarProductoPorRangoPrecio(precioMin, precioMax)
        .then((res) => setProductos(res.data))
        .catch(console.error);
    }
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setTipoSeleccionado("");
    setPrecioMin("");
    setPrecioMax("");
    setCriterio("nombre");
    getAllProductos();
  }

  function nuevoProducto() {
    navegar("/producto/crear");
  }

  function actualizarProducto(id_producto) {
    navegar(`/producto/edita/${id_producto}`);
  }

  function eliminarProducto(id_producto) {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      deleteProducto(id_producto)
        .then(() => getAllProductos())
        .catch(console.error);
    }
  }

  return (
    <div className="container">
      {/* 🔸 Botón crear */}
      <button
        className="btn text-white mb-3"
        style={{ backgroundColor: "#f28724" }}
        onClick={nuevoProducto}
      >
        ➕Nuevo producto
      </button>

      <h2 className="text-center titulo-clientes mb-4">
        Lista de productos
      </h2>

      {/* 🔍 Barra de filtros */}
      <form
        className="d-flex align-items-center justify-content-center flex-wrap mb-3"
        onSubmit={realizarBusqueda}
      >
        <label
          className="fw-semibold me-2 mb-2"
          style={{ color: "#75421e", minWidth: "140px" }}
        >
          ☰Filtro de búsqueda:
        </label>

        <select
          className="form-select me-2 mb-2"
          style={{ maxWidth: "200px" }}
          value={criterio}
          onChange={(e) => setCriterio(e.target.value)}
        >
          <option value="nombre">Nombre</option>
          <option value="tipo">Tipo</option>
          <option value="precio">Rango de precio</option>
        </select>

        {/* Input dinámico */}
        {criterio === "nombre" && (
          <input
            type="text"
            className="form-control me-2 mb-2"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ maxWidth: "250px" }}
          />
        )}

        {criterio === "tipo" && (
          <select
            className="form-select me-2 mb-2"
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
            style={{ maxWidth: "220px" }}
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map((t) => (
              <option key={t.id_tipo} value={t.id_tipo}>
                {t.tipo}
              </option>
            ))}
          </select>
        )}

        {criterio === "precio" && (
          <>
            <input
              type="number"
              className="form-control me-2 mb-2"
              placeholder="Precio mínimo"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              style={{ width: "150px" }}
            />
            <input
              type="number"
              className="form-control me-2 mb-2"
              placeholder="Precio máximo"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              style={{ width: "150px" }}
            />
          </>
        )}

        {/* Botones */}
        <button
          type="submit"
          className="btn text-white me-2 mb-2"
          style={{ backgroundColor: "#f28724" }}
        >
          🔎Buscar
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary mb-2"
          onClick={limpiarBusqueda}
        >
          🧹Limpiar
        </button>
      </form>

      {/* 🧾 Tabla */}
      <table className="table table-bordered tabla-clientes">
        <thead className="table-light text-center">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td className="text-center">{producto.id_producto}</td>
                <td>{producto.nombreProducto}</td>
                <td>{producto.descripcionProducto}</td>
                <td className="text-center">{producto.tipo?.tipo}</td>
                <td className="text-end">
                  ${producto.precioProducto.toFixed(2)}
                </td>
                <td className="text-center align-middle">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombreProducto}
                      style={{
                        width: "100px",
                        height: "150px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        backgroundColor: "#f8f9fa",
                        padding: "4px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                  ) : (
                    <span className="text-muted fst-italic">Sin imagen</span>
                  )}
                </td>
                <td className="text-center">
                  <button
                    className="btn text-white me-2"
                    style={{ backgroundColor: "#f28724" }}
                    onClick={() => actualizarProducto(producto.id_producto)}
                  >
                    📝Actualizar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(producto.id_producto)}
                  >
                    🗑️Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                ❌No hay productos que coincidan con el filtro seleccionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
