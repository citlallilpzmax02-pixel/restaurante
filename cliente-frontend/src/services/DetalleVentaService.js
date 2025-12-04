import axios from "axios";

const REST_API_BASE_URL = "http://localhost:7073/api/detalleventa";

// Agregar token JWT automáticamente
function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: "Bearer " + token } : {};
}

// Peticiones protegidas con JWT
export const getDetallesByVenta = (ventaId) =>
  axios.get(`${REST_API_BASE_URL}/venta/${ventaId}`, {
    headers: authHeader(),
  });


// =============================
//   NUEVA FUNCIÓN CORRECTA
//   PARA GENERAR EL PDF
// =============================
export const generarTicketPdf = async (ventaId) => {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/ticket/${ventaId}`,
      {
        responseType: "blob", 
        headers: {} // ← SIN TOKEN
      }
    );

    const fileURL = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    window.open(fileURL, "_blank");

  } catch (error) {
    console.error("ERROR PDF: ", error);
    alert("No se pudo generar el ticket.");
  }
};


