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
import Cleaning from "./components/Cleaning/Cleaning"
import LocalDeliveries from './components/OrdersProcess/LocalDeliveries'
import Returns from './components/OrdersProcess/Returns'
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
import Deposit from './components/Deposit/Deposit'
import EmployeesMain from './components/Employees/EmployeesMain'
import EmployeesData from './components/Employees/EmployeesData'
import ClosuresMain from './components/Closures/ClosuresMain'
import MonthlyClousure from './components/Closures/MonthlyClousure'
import MainExpenses from './components/Expenses/MainExpenses'
import PendingReplacements from "./components/PendingReplacements/PendingReplacements"
import EmployeesShifts from './components/Employees/EmployeesShifts'


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
            <Route path="/Gastos" element={<MainExpenses />} />   
            <Route path="/clientes" element={<Clients />} />  
            <Route path="/Empleados" element={<EmployeesMain />} /> 
            <Route path="/Empleados/ListadoDeEmpleados" element={<EmployeesData />} /> 
            <Route path="/Cierres" element={<ClosuresMain />} /> 
            <Route path="/Armado" element={<Armed />} />   
            <Route path="/AConfirmar" element={<ToBeConfirmed />} />   
            <Route path="/Lavado" element={<Cleaning />} />   
            <Route path="/Deposito" element={<Deposit />} />   
            <Route path="/Proveedores" element={<Providers />} />   
            <Route path="/EntregasLocal" element={<LocalDeliveries />} /> 
            <Route path="/Devoluciones" element={<Returns />} /> 
            <Route path="/Reposiciones" element={<Returned />} /> 
            <Route path="/ReposicionesPendientes" element={<PendingReplacements />} /> 
            <Route path="/Estadisticas/Articulos" element={<EstadisticsArticles />}/> 
            <Route path="/Estadisticas/Alquileres" element={<EstadisticsOrders />}/> 
            <Route path="/Estadisticas/Clientes" element={<EstadisticsClients />}/> 
            <Route path="/Estadisticas/Cobros" element={<EstadisticsCollections />}/> 
            <Route path="/Cierre/:year/:month" element={<MonthlyClousure />} /> 
            <Route path="/Empleados/Turnos" element={<EmployeesShifts />} /> 
          </Routes>
     </UserProvider>

    </>
  )
}

export default App
