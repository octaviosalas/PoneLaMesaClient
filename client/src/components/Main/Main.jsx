import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../store/userContext'
import NavBarComponent from '../Navbar/Navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Main = () => {

     const userCtx = useContext(UserContext)
     const [productsClients, setProductsClients] = useState([])
     const [productsBonusClienets, setProductsBonusClients] = useState([])

     const getProductsClients  = () => { 
        axios.get("http://localhost:4000/products/productsClients")
             .then((res) => { 
              const productsClients = res.data.map((d) => d.products)
              setProductsClients(productsClients)
              console.log("Productos Clientes: ", productsClients)
             })
             .catch((err) => { 
              console.log(err)
             })
     }

     const getProductsBonusClients  = () => { 
       axios.get("http://localhost:4000/products/productsBonusClients")
            .then((res) => { 
              const productsBonusClients = res.data.map((d) => d.products)
              setProductsBonusClients(productsBonusClients)
              console.log("Productos Clientes Bonificados: ", productsBonusClients)
            })
            .catch((err) => { 
              console.log(err)
            })
     }

     useEffect(() => { 
        getProductsBonusClients()
        getProductsClients()
     }, [])

    return (
    <div className='flex flex-col'> 
        <NavBarComponent/>
        <p className='mt-2'>Hola! {userCtx.userName}</p>  
        <p className='mt-2'>Hola! {userCtx.userEmail}</p>
        <p className='mt-2'>Hola! {userCtx.userId}</p>
        <p className='mt-2'>Hola! {userCtx.userEmail}</p>
    </div>
  )
}

export default Main
