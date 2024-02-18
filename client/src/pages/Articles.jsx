import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../store/userContext'
import NavBarComponent from '../components/Navbar/Navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../components/Loading/Loading'
import { getProductsClients, getProductsBonusClients } from '../functions/gralFunctions';
import ArticlesTable from '../components/ArticlesTable/ArticlesTable'


const Articles = () => {

     const userCtx = useContext(UserContext)
     const [productsClients, setProductsClients] = useState([])
     const [productsBonusClienets, setProductsBonusClients] = useState([])
     const [allProductsClients, setAllProductsClients] = useState([])

     const getArticlesData = async () => { 
        setProductsClients([])
        console.log("Consulto nuevamente")
        const productsClientsData = await getProductsClients();
        setProductsClients(productsClientsData);
     }

     useEffect(() => {
      getArticlesData()
     }, []);


     useEffect(() => { 
      if(productsClients.length !== 0) { 
        console.log("recibi los datos otra vez luego de ejecutarme")
        const platos = productsClients.platos || [];
        const copas = productsClients.copas || [];
        const juegoDeTe = productsClients.juegoDeTe || [];
        const juegoDeCafe = productsClients.juegoDeCafe || [];
        const manteleria = productsClients.manteleria || [];
        const mesasYSillas = productsClients.mesasYSillas || [];
        const varios = productsClients.varios || [];
        const todosLosArrays = platos.concat(copas, juegoDeTe, juegoDeCafe, manteleria, mesasYSillas, varios);
        setAllProductsClients(todosLosArrays)
      }
    }, [productsClients])



    return (
    <div className='flex flex-col'> 
        <NavBarComponent/>
          {
           allProductsClients.length !== 0 
          ? 
          <div className='h-screen mt-24 2xl:mt-20'>
            <ArticlesTable clientsList={allProductsClients}  updateList={getArticlesData}/>
          </div>        
            :
          <Loading/>
          }
    
    </div>
  )
}

export default Articles

