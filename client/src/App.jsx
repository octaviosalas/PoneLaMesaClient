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
import Cleaning from "./components/OrdersProcess/Cleaning"
import Repart from './components/OrdersProcess/Repart'
import Returned from './components/OrdersProcess/Returned'
import EstadisticsOrders from './pages/EstadisticsOrders'
import EstadisticsArticles from './pages/EstadisticsArticles'
import EstadisticsClients from './pages/EstadisticsClients'
import EstadisticsCollections from './pages/EstadisticsCollections'
import EstadisticsPurchases from './pages/EstadisticsPurchases'
import Clients from './pages/Clients'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserProvider>
          <Routes>       
            <Route path="/" element={<Login />} />      
            <Route path="/register" element={<Register />} />      
            <Route path="/articulos" element={<Articles />} />   
            <Route path="/pedidos" element={<Orders />} />   
            <Route path="/compras" element={<Purchases />} />   
            <Route path="/clientes" element={<Clients />} />  
            <Route path="/Armado" element={<Armed />} />   
            <Route path="/Lavado" element={<Cleaning />} />   
            <Route path="/Reparto" element={<Repart />} /> 
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
