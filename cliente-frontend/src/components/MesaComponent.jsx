import React, { useState, useEffect } from 'react';
import { crearMesa, getMesa, updateMesa } from '../services/MesaService';
import { useNavigate, useParams } from 'react-router-dom';

export const MesaComponent = () => {
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const [errors, setErrors] = useState({
    numero: '',
    capacidad: '',
    ubicacion: ''
  });

  const navegar = useNavigate();
  const { id } = useParams();

  // Handlers
  const actualizaNumeroMesa = (e) => setNumero(e.target.value);
  const actualizaCapacidad = (e) => setCapacidad(e.target.value);
  const actualizaUbicacion = (e) => setUbicacion(e.target.value);

  // Validación del formulario
  function validaForm() {
    let valida = true;
    const errorsCopy = { ...errors };

    if (numero.trim()) {
      errorsCopy.numero = '';
    } else {
      errorsCopy.numero = 'El número de mesa es requerido';
      valida = false;
    }

    if (capacidad.trim()) {
      errorsCopy.capacidad = '';
    } else {
      errorsCopy.capacidad = 'La capacidad es requerida';
      valida = false;
    }

    if (ubicacion.trim()) {
      errorsCopy.ubicacion = '';
    } else {
      errorsCopy.ubicacion = 'La ubicación es requerida';
      valida = false;
    }

    setErrors(errorsCopy);
    return valida;
  }


  // Cargar los datos si es edición
  useEffect(() => {
    if (!id) return;
    getMesa(id)
     .then(({ data }) => {
       setNumero(data.numero != null ? String(data.numero) : '');
       setCapacidad(data.capacidad != null ? String(data.capacidad) : '');
       setUbicacion(data.ubicacion ?? '');
     })
     .catch((err) => console.error(err));
  }, [id]);


  // Guardar o actualizar mesa
  function saveMesa(e) {
    e.preventDefault();

    if (validaForm()) {
      const mesa = { numero, capacidad, ubicacion };

      if (id) {
        // Editar mesa existente
        updateMesa(id, mesa)
          .then((response) => {
            console.log('Mesa actualizada:', response.data);
            navegar('/mesa/lista');
          })
          .catch((error) => console.error(error));
      } else {
        // Crear nueva mesa
        crearMesa(mesa)
          .then((response) => {
            console.log('Mesa creada:', response.data);
            navegar('/mesa/lista');

            // limpiar campos
            setNumero('');
            setCapacidad('');
            setUbicacion('');
          })
          .catch((error) => console.error(error));
      }
    }
  }

  // Cancelar y regresar
  function cancelar() {
    navegar('/mesa/lista');
  }

  // Título dinámico
  function pagTitulo() {
    if (id) {
      return <h2 className="text-center">Modificar mesa</h2>;
    } else {
      return <h2 className="text-center">Agregar mesa</h2>;
    }
  }

  return (
    <div className="container mt-4">
      <div className="form-header text-center mb-4" style={{ color: '#75421e' }}>
        <h2>{pagTitulo()}</h2>
      </div>

      <form
        className="p-4 shadow rounded mx-auto"
        style={{ backgroundColor: '#fff7e6', maxWidth: '500px' }}
      >
        {/* Número */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Número de Mesa
          </label>
          <input
            type="text"
            className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
            placeholder="Ejemplo: 1, 2, 3..."
            value={numero}
            onChange={actualizaNumeroMesa}
          />
          {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
        </div>

        {/* Capacidad */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Capacidad
          </label>
          <input
            type="number"
            className={`form-control ${errors.capacidad ? 'is-invalid' : ''}`}
            placeholder="Ejemplo: 4 personas"
            value={capacidad}
            onChange={actualizaCapacidad}
          />
          {errors.capacidad && <div className="invalid-feedback">{errors.capacidad}</div>}
        </div>

        {/* Ubicación */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Ubicación
          </label>
          <input
            type="text"
            className={`form-control ${errors.ubicacion ? 'is-invalid' : ''}`}
            placeholder="Ejemplo: Terraza, Interior..."
            value={ubicacion}
            onChange={actualizaUbicacion}
          />
          {errors.ubicacion && <div className="invalid-feedback">{errors.ubicacion}</div>}
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveMesa}
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
