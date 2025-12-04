import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HeroSlider } from "./HeroSlider";
import { listaProductos } from "../services/ProductoService";

export const HomeComponent = () => {

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    document.body.style.backgroundColor = "#fbd46d";
    return () => {
      document.body.style.backgroundColor = "#fbd46d";
    };
  }, []);

  useEffect(() => {
    listaProductos()
      .then((res) => {
        const activos = res.data.filter((p) => p.estado === true);
        setProductos(activos);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="w-100" style={{ overflowX: "hidden", padding: 0, margin: 0 }}>

      {/* 🎞️ HERO SLIDER */}
      <HeroSlider />

      {/* 🟧 SECCIÓN NARANJA */}
      <section
        className="text-white py-5 w-100"
        style={{ backgroundColor: "#f5a540" }}
      >
        <div className="container-fluid text-center">
          <h1 className="fw-bold display-5">Bienvenido a Qué Birria</h1>
          <p className="lead mt-3 mx-auto" style={{ maxWidth: "800px" }}>
            El sabor auténtico de la birria que conquista desde el primer sorbo.
          </p>
          <p className="lead mt-3 mx-auto" style={{ maxWidth: "800px" }}>
            Tradición, sazón y amor en cada plato 🍽️😋
          </p>
        </div>
      </section>

      {/* 📌 EXPLORA EL MENÚ */}
      <section className="py-5 w-100" style={{ backgroundColor: "#fbd46d" }}>
        <div className="container-fluid text-center">
          <h2 className="fw-bold mb-3">Explora nuestro menú</h2>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            Descubre nuestros platillos especiales preparados con ingredientes frescos
            y un toque único que distingue a Qué Birria.
          </p>
        </div>

        <div className="container-fluid mt-4">
          <div className="row justify-content-center g-4">

            {productos.length > 0 ? (
              productos.map((producto) => (
                <div
                  key={producto.id_producto}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <div
                    className="shadow-sm h-100 p-3 rounded"
                    style={{
                      backgroundColor: "#e9ebe7"
                    }}
                  >

                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        className="card-img-top rounded"
                        alt={producto.nombreProducto}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light rounded"
                        style={{ height: "200px" }}
                      >
                        <span className="text-muted">Sin imagen</span>
                      </div>
                    )}

                    <div className="text-center mt-3">
                      <h5 className="card-title">{producto.nombreProducto}</h5>
                      <p className="card-text text-muted small">{producto.descripcionProducto}</p>
                      <p className="fw-bold text-dark">${producto.precioProducto.toFixed(2)}</p>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No hay productos disponibles.</p>
            )}

          </div>
        </div>
      </section>

      {/* ❤️ SOBRE NOSOTROS */}
      <section className="py-5 w-100" style={{ backgroundColor: "#f5a540" }}>
        <div className="container-fluid text-center">
          <h2 className="fw-bold mb-3">Sobre Nosotros</h2>
          <p
            className="text-muted mx-auto"
            style={{ maxWidth: "800px", lineHeight: "1.7" }}
          >
            En <strong>Qué Birria</strong> nos apasiona brindar un sabor único lleno de tradición.
            Cocinamos nuestra birria a fuego lento siguiendo recetas familiares de generaciones.
          </p>
        </div>
      </section>

      {/* ⭐ TESTIMONIOS */}
      <section className="py-5 w-100" style={{ backgroundColor: "#fbd46d" }}>
        <div className="container-fluid text-center">
          <h2 className="fw-bold mb-4">Lo que Dicen Nuestros Clientes</h2>
        </div>

        <div className="container-fluid">
          <div className="row g-4 justify-content-center">

            {/* Testimonio 1 */}
            <div className="col-md-4 col-lg-3">
              <div
                className="p-4 rounded shadow-sm h-100"
                style={{ backgroundColor: "#e9ebe7" }}
              >
                <h5 className="fw-bold">María Gómez</h5>
                <p className="text-muted small">Cliente frecuente</p>
                <p className="fst-italic">
                  "La mejor birria que he probado. El caldo está en otro nivel."
                </p>
                <div className="text-warning">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="col-md-4 col-lg-3">
              <div
                className="p-4 rounded shadow-sm h-100"
                style={{ backgroundColor: "#e9ebe7" }}
              >
                <h5 className="fw-bold">José Ramírez</h5>
                <p className="text-muted small">Visitante</p>
                <p className="fst-italic">
                  "Los tacos y el consomé tienen un sabor único. Volveré pronto."
                </p>
                <div className="text-warning">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="col-md-4 col-lg-3">
              <div
                className="p-4 rounded shadow-sm h-100"
                style={{ backgroundColor: "#e9ebe7" }}
              >
                <h5 className="fw-bold">Ana Torres</h5>
                <p className="text-muted small">Cliente nueva</p>
                <p className="fst-italic">
                  "Ambiente agradable y servicio rápido. Recomendado."
                </p>
                <div className="text-warning">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
