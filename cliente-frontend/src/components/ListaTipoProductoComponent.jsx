import React, { useEffect, useState } from 'react';
// Aquí importas la función que creaste en el otro archivo
import { listaTiposProductos, deleteTipoProducto } from '../services/TipoProductoService';
import { useNavigate } from 'react-router-dom';

export const ListaTipoProductoComponent = () => {
    const [tipoProducto, setTipoProducto] = useState([]);
    const navegar = useNavigate();

    useEffect(() => {
        getAllTipos();
    }, [] )

    function getAllTipos(){
        listaTiposProductos().then((response) => {
            setTipoProducto(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    function nuevoTipo(){
        navegar('/tipoProducto/crear');
    }

    function actualizarTipo(id_tipo){
        navegar(`/tipoProducto/edita/${id_tipo}`);
    }

    function eliminarTipo(id_tipo){
        console.log(id_tipo);
        deleteTipoProducto(id_tipo).then((response) =>{
            getAllTipos();
        }).catch(error =>{
            console.error(error);
        })
    }

    return (
        <div className='container'>
            <button className="btn text-white mb-3" style={{ backgroundColor: '#f28724' }} onClick={nuevoTipo}>
            ➕Nuevo tipo
            </button>
            <h2 className='text-center titulo-clientes'>Lista de tipos de productos</h2>
            <table className="table table-bordered tabla-clientes">
                <thead>
                <tr>
                    <th>Id tipo</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Evento</th>
                </tr>
                </thead>
                <tbody>
                {tipoProducto.map( tipoProducto => (
                    <tr key={tipoProducto.id_tipo}>
                    <td>{tipoProducto.id_tipo}</td>
                    <td>{tipoProducto.tipo}</td>
                    <td>{tipoProducto.descripcion}</td>
                    <td>
                        <button className="btn text-white" style={{ backgroundColor: '#f28724' }} onClick={() => actualizarTipo(tipoProducto.id_tipo)}>
                        📝Actualizar
                        </button>

                        <button
                        className="btn btn-danger btn-sm d-inline-flex align-items-center justify-content-center"
                        onClick={() => eliminarTipo(tipoProducto.id_tipo)}>
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