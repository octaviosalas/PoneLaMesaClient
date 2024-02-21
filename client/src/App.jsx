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
import EstadisticsPage from './pages/EstadisticsPage'

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
            <Route path="/Armado" element={<Armed />} />   
            <Route path="/Lavado" element={<Cleaning />} />   
            <Route path="/Reparto" element={<Repart />} /> 
            <Route path="/Devueltos" element={<Returned />} /> 
            <Route path="/Estadisticas" element={<EstadisticsPage />} /> 


          </Routes>
     </UserProvider>

    </>
  )
}

export default App
