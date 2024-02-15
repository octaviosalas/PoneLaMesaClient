import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { UserProvider } from './store/userContext'
import Products from './pages/Products'
import Orders from './pages/Orders'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserProvider>
          <Routes>       
            <Route path="/" element={<Login />} />      
            <Route path="/register" element={<Register />} />      
            <Route path="/productos" element={<Products />} />   
            <Route path="/pedidos" element={<Orders />} />   
          </Routes>
     </UserProvider>

    </>
  )
}

export default App
