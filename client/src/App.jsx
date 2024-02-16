import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { UserProvider } from './store/userContext'
import Articles from './pages/Articles'
import Orders from './pages/Orders'
import Purchases from './pages/Purchases'

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

          </Routes>
     </UserProvider>

    </>
  )
}

export default App
