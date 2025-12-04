import React, { useState, useEffect } from 'react';
import { crearProducto, getProducto, updateProducto } from '../services/ProductoService';
import { listaTiposProductos } from '../services/TipoProductoService';
import { useNavigate, useParams } from 'react-router-dom';

export const ProductoComponent = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipos, setTipos] = useState([]);
  const [estado, setEstado] = useState(true);
  const [imagen, setImagen] = useState(null);

  const [errors, setErrors] = useState({
    nombreProducto: '',
    descripcionProducto: '',
    precioProducto: '',
    tipo: ''
  });

  const navegar = useNavigate();
  const {id} = useParams();

  // Funciones para actualizar los estados
  const actualizaNombreProducto = (e) => setNombreProducto(e.target.value);
  const actualizaDescripcionProducto = (e) => setDescripcionProducto(e.target.value);
  const actualizaPrecioProducto = (e) => setPrecioProducto(e.target.value);
  const actualizaTipo = (e) => setTipo(e.target.value);
  
  //Validación del formulario
  function validaForm(){
    let valida = true;
    const errorsCopy = {...errors};

    if(String(nombreProducto).trim()){
        errorsCopy.nombreProducto = '';
    }else{
        errorsCopy.nombreProducto = 'El nombre es requerido';
        valida = false;
    }

    if(String(descripcionProducto).trim()){
        errorsCopy.descripcionProducto = '';
    }else{
        errorsCopy.descripcionProducto = 'La descripción es requerida';
        valida = false;
    }

     if(String(precioProducto).trim()){
        errorsCopy.precioProducto = '';
    }else{
        errorsCopy.precioProducto = 'El precio es requerido';
        valida = false;
    }

     if(String(tipo).trim()){
        errorsCopy.tipo = '';
    }else{
        errorsCopy.tipo = 'El tipo es requerido';
        valida = false;
    }

    setErrors(errorsCopy);
    return valida;
  }

  //Cargar los datos si es edición
  useEffect(() =>{
    if(!id) return;
    getProducto(id)
      .then(({data}) => {

        setNombreProducto(data.nombreProducto ?? '');
        setDescripcionProducto(data.descripcionProducto ?? '');
        setPrecioProducto(data.precioProducto != null ? String(data.precioProducto) : '');
        setTipo(data.tipo?.id_tipo != null ? String(data.tipo.id_tipo) : '');
        setEstado(data.estado ?? true);
    })
    .catch((err) => console.error(err));
  }, [id]);

  // Cargar tipos de producto
  useEffect(() => {
    listaTiposProductos()
      .then((response) => setTipos(response.data))
      .catch((error) => console.error('Error al cargar tipos:', error));
  }, []);

  // Guardar producto / Actualizar
  function saveProducto(e) {
    e.preventDefault();

    if (validaForm()) {
    const formData = new FormData();
    formData.append("nombreProducto", nombreProducto);
    formData.append("descripcionProducto", descripcionProducto);
    formData.append("precioProducto", parseFloat(precioProducto));
    formData.append("estado", estado);
    formData.append("tipo", tipo);

    // Si el usuario seleccionó una imagen
    if (imagen) {
      formData.append("file", imagen);
    }

    // 🟠 Si es edición
    if (id) {
      updateProducto(id, formData)
        .then(() => {
          alert("Producto actualizado correctamente");
          navegar("/producto/lista");
        })
        .catch((error) => console.error(error));
    } else {
      // 🟢 Si es nuevo
      crearProducto(formData)
        .then(() => {
          alert("Producto registrado correctamente");
          navegar("/producto/lista");
        })
        .catch((error) => console.error(error));
    }
  }
 
}

  function cancelar(){
    navegar('/producto/lista');
  }

  function pagTitulo(){
    if(id){
      return <h2 className='text-center'>Modificar producto</h2>
    }else{
      return <h2 className='text-center'>Agregar producto</h2>
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
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Nombre del Producto
          </label>
          <input
            type="text"
            className={`form-control ${errors.nombreProducto ? 'is-invalid' : ''}`}
            placeholder="Ejemplo: Taco de birria, Agua de horchata..."
            value={nombreProducto}
            onChange={actualizaNombreProducto}
            required
          />
          {errors.nombreProducto && (
            <div className="invalid-feedback">{errors.nombreProducto}</div>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Descripción
          </label>
          <textarea
            className={`form-control ${errors.descripcionProducto ? 'is-invalid' : ''}`}
            rows="3"
            placeholder="Describe brevemente el producto"
            value={descripcionProducto}
            onChange={actualizaDescripcionProducto}
          />
          {errors.descripcionProducto && (
            <div className="invalid-feedback">{errors.descripcionProducto}</div>
          )}
        </div>

        {/* Tipo */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Tipo de Producto
          </label>
          <select
            className={`form-select ${errors.tipo ? 'is-invalid' : ''}`}
            value={tipo}
            onChange={actualizaTipo}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tipos.map((t) => (
              <option key={t.id_tipo} value={t.id_tipo}>
                {t.tipo}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <div className="invalid-feedback">{errors.tipo}</div>
          )}
        </div>

        {/* Precio */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Precio
          </label>
          <input
            type="number"
            className={`form-control ${errors.precioProducto ? 'is-invalid' : ''}`}
            placeholder="Ejemplo: 35.50"
            value={precioProducto}
            onChange={actualizaPrecioProducto}
            required
          />
          {errors.precioProducto && (
            <div className="invalid-feedback">{errors.precioProducto}</div>
          )}
        </div>
        {/* Imagen */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: '#f28724' }}>
            Selecciona una imagen
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 justify-content-center">
          <button
            type="submit"
            onClick={saveProducto}
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
