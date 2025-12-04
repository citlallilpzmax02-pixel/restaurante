import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ListaClienteComponent } from './components/ListaClienteComponent'
import { HeaderComponent } from "./components/HeaderComponent";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { ClienteComponent } from './components/ClienteComponent'
import { ListaProductosComponent } from './components/ListaProductoComponent'
import { ListaTipoProductoComponent } from './components/ListaTipoProductoComponent'
import { TipoProductoComponent } from './components/TipoProductoComponent'
import { ProductoComponent } from './components/ProductoComponent'
import { MesaComponent } from './components/MesaComponent'
import { ListaMesaComponent } from './components/ListaMesaComponent'
import { EmpleadoComponent } from './components/EmpleadoComponent'
import { ListaEmpleadoComponent } from './components/ListaEmpleadoComponent'
import { ReservaComponent } from './components/ReservaComponent'
import { ListaReservaComponent } from './components/ListaReservaComponent'
import { VentaComponent } from './components/VentaComponent'
import { ListaVentaComponent } from './components/ListaVentaComponent'
import { HomeComponent } from './components/HomeComponent'
import { FooterComponent } from './components/FooterComponent'
import { UsuarioComponent } from './components/UsuarioComponent'
import { ListaUsuarioComponent } from './components/ListaUsuarioComponent'
import { LoginComponent } from "./components/LoginComponent";
import { setupAxiosInterceptors } from "./services/AuthService";

function App() {
  
  setupAxiosInterceptors();
  return (
    <>
    <BrowserRouter>
      <HeaderComponent />
      <Routes>
      
      <Route path='/' element={<HomeComponent></HomeComponent>}></Route> 

      <Route path='/cliente/lista' element={<ListaClienteComponent></ListaClienteComponent>}></Route> 
      
      <Route path='/cliente/crear' element={<ClienteComponent></ClienteComponent>}></Route> 
      
      {/*Ruta para editar*/}
      <Route path='/cliente/edita/:id' element={<ClienteComponent></ClienteComponent>}></Route> 
    
      <Route path='/producto/lista' element={<ListaProductosComponent></ListaProductosComponent>}></Route> 
    
      <Route path='/producto/crear' element={<ProductoComponent></ProductoComponent>}></Route> 

      {/*Ruta para editar*/}
      <Route path='/producto/edita/:id' element={<ProductoComponent></ProductoComponent>}></Route> 

      <Route path='/tipoProducto/lista' element={<ListaTipoProductoComponent></ListaTipoProductoComponent>}></Route> 
    
      <Route path='/tipoProducto/crear' element={<TipoProductoComponent></TipoProductoComponent>}></Route>
      
      {/*Ruta para editar*/}
      <Route path='/tipoProducto/edita/:id' element={<TipoProductoComponent></TipoProductoComponent>}></Route>

      <Route path='/mesa/crear' element={<MesaComponent></MesaComponent>}></Route>

      <Route path='/mesa/lista' element={<ListaMesaComponent></ListaMesaComponent>}></Route>
      
      {/*Ruta para editar*/}
      <Route path='/mesa/edita/:id' element={<MesaComponent></MesaComponent>}></Route>

      <Route path='/empleado/crear' element={<EmpleadoComponent></EmpleadoComponent>}></Route>

      <Route path='/empleado/lista' element={<ListaEmpleadoComponent></ListaEmpleadoComponent>}></Route>
      
      {/*Ruta para editar*/}
      <Route path='/empleado/edita/:id' element={<EmpleadoComponent></EmpleadoComponent>}></Route>

      <Route path='/reserva/crear' element={<ReservaComponent></ReservaComponent>}></Route>

      <Route path='/reserva/lista' element={<ListaReservaComponent></ListaReservaComponent>}></Route>
      
      {/*Ruta para editar*/}
      <Route path='/reserva/edita/:id' element={<ReservaComponent></ReservaComponent>}></Route>

      <Route path="/venta/crear" element={<VentaComponent></VentaComponent>} />
      
      <Route path="/venta/crear/:idReserva" element={<VentaComponent></VentaComponent>} />
      
      <Route path='/venta/lista'  element={<ListaVentaComponent></ListaVentaComponent>} />
      {/*Ruta para editar*/}
      <Route path='/venta/edita/:id' element={<VentaComponent></VentaComponent>} />

      <Route path="/usuarios/lista" element={<ListaUsuarioComponent></ListaUsuarioComponent>} />

      <Route path="/usuarios/crear" element={<UsuarioComponent></UsuarioComponent>} />

      <Route path="/usuarios/edita/:id" element={<UsuarioComponent></UsuarioComponent>} /> 

      <Route path="/login" element={<LoginComponent></LoginComponent>} />
      </Routes>
      
      <FooterComponent></FooterComponent>
    </BrowserRouter>
       
    </>
  )
}

export default App
