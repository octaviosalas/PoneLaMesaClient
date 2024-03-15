import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { UserProvider } from './store/userContext'
import Articles from './pages/Articles'
import Orders from './pages/Orders'
import Purchases from './pages/Purchases'
import Armed from './components/OrdersProcess/Armed'
import ToBeConfirmed from './components/OrdersProcess/ToBeConfirmed'
import Cleaning from "./components/OrdersProcess/Cleaning"
import LocalDeliveries from './components/OrdersProcess/LocalDeliveries'
import LocalReturns from './components/OrdersProcess/LocalReturns'
import LogisticRepart from './components/OrdersProcess/LogisticRepart'
import LogisticToRemove from './components/OrdersProcess/LogisticToRemove'
import Returned from './components/OrdersProcess/Returned'
import EstadisticsOrders from './pages/EstadisticsOrders'
import EstadisticsArticles from './pages/EstadisticsArticles'
import EstadisticsClients from './pages/EstadisticsClients'
import EstadisticsCollections from './pages/EstadisticsCollections'
import EstadisticsPurchases from './pages/EstadisticsPurchases'
import Clients from './pages/Clients'
import Collections from './pages/Collections'
import Providers from './pages/Providers'
import Sublets from './pages/Sublets'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react'


function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
   
      document.body.style.backgroundColor = '#F5F7F3';
    
  }, [location.pathname]);

  return (
    <>
      <UserProvider>
          <Routes>       
            <Route path="/" element={<Login />} />      
            <Route path="/register" element={<Register />} />      
            <Route path="/articulos" element={<Articles />} />   
            <Route path="/subalquileres" element={<Sublets />} /> 
            <Route path="/pedidos" element={<Orders />} />   
            <Route path="/compras" element={<Purchases />} />   
            <Route path="/Cobros" element={<Collections />} />   
            <Route path="/clientes" element={<Clients />} />  
            <Route path="/Armado" element={<Armed />} />   
            <Route path="/AConfirmar" element={<ToBeConfirmed />} />   
            <Route path="/Lavado" element={<Cleaning />} />   
            <Route path="/Proveedores" element={<Providers />} />   
            <Route path="/EntregasLocal" element={<LocalDeliveries />} /> 
            <Route path="/Devoluciones" element={<LocalReturns />} /> 
            <Route path="/Reparto" element={<LogisticRepart />} /> 
            <Route path="/Retiros" element={<LogisticToRemove />} /> 
            <Route path="/Reposiciones" element={<Returned />} /> 
            <Route path="/Estadisticas/Articulos" element={<EstadisticsArticles />} /> 
            <Route path="/Estadisticas/Alquileres" element={<EstadisticsOrders />} /> 
            <Route path="/Estadisticas/Clientes" element={<EstadisticsClients />} /> 
            <Route path="/Estadisticas/Cobros" element={<EstadisticsCollections />} /> 
            <Route path="/Estadisticas/Compras" element={<EstadisticsPurchases />} /> 


          </Routes>
     </UserProvider>

    </>
  )
}

export default App
