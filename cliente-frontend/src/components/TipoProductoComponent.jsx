import React, { useEffect, useState } from 'react';
import { crearTipoProducto, getTipoProducto, updateTipoProducto } from '../services/TipoProductoService';
import { data, useNavigate, useParams } from 'react-router-dom';

export const TipoProductoComponent = () => {
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [errors, setErrors] = useState({
    tipo: '',
    descripcion: ''
  })

  const navegar = useNavigate();
  const {id} = useParams();

  // Handlers de inputs
  const actualizaTipo = (e) => setTipo(e.target.value);
  const actualizaDescripcion = (e) => setDescripcion(e.target.value);

  //Validación del formulario
  function validaForm(){
    let valida = true;
    const errorsCopy = {...errors};

    if(tipo.trim()){
      errorsCopy.tipo = '';
    } else{
      errorsCopy.tipo = 'El tipo es requerido';
      valida = false;
    }

     if(descripcion.trim()){
      errorsCopy.descripcion = '';
    } else{
      errorsCopy.descripcion = 'La descripcion es requerida';
      valida = false;
    }

    setErrors(errorsCopy);
    return valida;
  }

  //Carga datos si es edición
  useEffect(() => {
    if(!id) return;
    getTipoProducto(id)
    .then(({data}) =>{
      setTipo(data.tipo ?? '');
      setDescripcion(data.descripcion ?? '')
    })
    .catch((err) => console.error(err));
  }, [id]);

  // Guardar Tipo de Producto
  function saveTipoProducto(e) {
    e.preventDefault();

    if(validaForm()){
    const tipoProducto = { tipo, descripcion };
    
    if(id){
      //Editar un tipo de producto existente
      updateTipoProducto(id, tipoProducto)
      .then((response) => {
        console.log("Tipo de producto actualizado: ", response.data);
        navegar("/tipoProducto/lista");
      })
      .catch((error) => console.error(error));
    }else{
        //Crear un nuevo tipo de producto
        crearTipoProducto(tipoProducto)
        .then((response) => {
        console.log("Tipo de producto registrado", response.data);
        // Redirigir a la lista
        navegar('/tipoProducto/lista');
        // Limpiar campos
        setTipo('');
        setDescripcion('');
      })
      .catch((error) => console.error(error));   
      }
    }    
  }

  function cancelar(){
    navegar('/tipoProducto/lista');
  }
  
  function pagTitulo() {
    if (id) {
      return <h2 className="text-center">Modificar tipo de producto</h2>
    }
    else {
      return <h2 className="text-center">Registrar un nuevo tipo de producto</h2>
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
        {/* Tipo */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Tipo
          </label>
          <input
            type="text"
            className={`form-control ${errors.tipo? 'is-invalid' : ''}`}
            placeholder="Ejemplo: Bebidas, Postres, Tacos..."
            value={tipo}
            onChange={actualizaTipo}
            required
          />
          {errors.tipo && (
            <div className="invalid-feedback">{errors.tipo}</div>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Descripción
          </label>
          <textarea
            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
            rows="3"
            placeholder="Describe este tipo de producto"
            value={descripcion} 
            onChange={actualizaDescripcion}
          />
           {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion}</div>
          )}
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveTipoProducto}
            className="btn btn-lg text-white"
            style={{ backgroundColor: '#f28724' }}
          >
            {id ? '🔄Actualizar' : '✅Guardar'}
          </button>
          <button
            type="button"
            className="btn btn-lg"
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
