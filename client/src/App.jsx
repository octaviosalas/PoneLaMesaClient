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
import PersonalizedClousure from './components/Closures/PersonalizedClousure'
import Chan from "./components/Closures/Chan"
import ClousureOfTheMonth from './components/Closures/ClousureOfTheMonth'
import FixedExpensesTable from './components/Expenses/FixedExpenses'
import ProtectedRoute from './components/ProtectedRoute'
import SubletsToBeReturned from './components/Sublets/SubletsToBeReturned'

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
        
        {/* Rutas protegidas */}
        <Route 
          path="/articulos" 
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subalquileres" 
          element={
            <ProtectedRoute>
              <Sublets />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/articulosSubAlquiladosParaDevolver" 
          element={
            <ProtectedRoute>
              <SubletsToBeReturned />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pedidos" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/compras" 
          element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Cobros" 
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Gastos" 
          element={
            <ProtectedRoute>
              <MainExpenses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/GastosFijos" 
          element={
            <ProtectedRoute>
              <FixedExpensesTable />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clientes" 
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Empleados" 
          element={
            <ProtectedRoute>
              <EmployeesMain />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Empleados/ListadoDeEmpleados" 
          element={
            <ProtectedRoute>
              <EmployeesData />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Cierres" 
          element={
            <ProtectedRoute>
              <ClosuresMain />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Armado" 
          element={
            <ProtectedRoute>
              <Armed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/AConfirmar" 
          element={
            <ProtectedRoute>
              <ToBeConfirmed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Lavado" 
          element={
            <ProtectedRoute>
              <Cleaning />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Deposito" 
          element={
            <ProtectedRoute>
              <Deposit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Proveedores" 
          element={
            <ProtectedRoute>
              <Providers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/EntregasLocal" 
          element={
            <ProtectedRoute>
              <LocalDeliveries />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Devoluciones" 
          element={
            <ProtectedRoute>
              <Returns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Reposiciones" 
          element={
            <ProtectedRoute>
              <Returned />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ReposicionesPendientes" 
          element={
            <ProtectedRoute>
              <PendingReplacements />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Estadisticas/Articulos" 
          element={
            <ProtectedRoute>
              <EstadisticsArticles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Estadisticas/Alquileres" 
          element={
            <ProtectedRoute>
              <EstadisticsOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Estadisticas/Clientes" 
          element={
            <ProtectedRoute>
              <EstadisticsClients />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Estadisticas/Cobros" 
          element={
            <ProtectedRoute>
              <EstadisticsCollections />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Cierre/:year/:month" 
          element={
            <ProtectedRoute>
              <ClousureOfTheMonth />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Cierre/Personalizado" 
          element={
            <ProtectedRoute>
              <PersonalizedClousure />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Empleados/Turnos" 
          element={
            <ProtectedRoute>
              <EmployeesShifts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cc" 
          element={
            <ProtectedRoute>
              <Chan />
            </ProtectedRoute>
          } 
        />
      </Routes>
     </UserProvider>

    </>
  )
}

export default App;


