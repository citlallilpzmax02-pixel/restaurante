import React from "react";

export const FooterComponent = () => {
  return (
    <footer
      className="text-white py-5"
      style={{
        backgroundColor: "#222",
        width: "100%",
        marginTop: "7%",   // ⬅⬅⬅ AQUI EL MARGEN EXTERNO
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <div className="container-fluid px-5 w-100">

        <div className="row g-4">

          {/* Columna 1 */}
          <div className="col-md-3">
            <h4 className="fw-bold mb-3">🤗Qué Birria</h4>
            <p className="text-white-50">
              Tradición, sabor y calidad en cada plato.
              La auténtica birria mexicana que te hará volver.
            </p>
          </div>

          {/* Columna 2 */}
          <div className="col-md-3">
            <h5 className="fw-semibold mb-3">🔗Enlaces Rápidos</h5>
            <ul className="list-unstyled text-white-50">
              <li><a href="/" className="text-white-50 text-decoration-none">Inicio</a></li>
              <li><a href="/login" className="text-white-50 text-decoration-none">Iniciar sesión</a></li>
              <li><a href="/usuarios/crear" className="text-white-50 text-decoration-none">Registrarse</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="col-md-3">
            <h5 className="fw-semibold mb-3">📲Contacto</h5>
            <ul className="list-unstyled text-white-50">
              <li>📧 info@quebirria.com</li>
              <li>📞 +52 747 000 0000</li>
              <li>📍 Chilpancingo, Guerrero</li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div className="col-md-3">
            <h5 className="fw-semibold mb-3">✅Síguenos</h5>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="text-white-50 text-decoration-none">Facebook</a>
              <a href="#" className="text-white-50 text-decoration-none">Instagram</a>
              <a href="#" className="text-white-50 text-decoration-none">TikTok</a>
            </div>
          </div>

        </div>

        {/* Línea inferior */}
        <div className="border-top border-secondary mt-4 pt-3 text-center text-white-50">
          <p className="mb-0">© 2025 Qué Birria. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  );
};
