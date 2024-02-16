

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
     const [allProductsBonusClients, setAllProductsBonusClients] = useState([])


     useEffect(() => {
      const fetchData = async () => {
        const productsClientsData = await getProductsClients();
        const productsBonusClientsData = await getProductsBonusClients();
        setProductsClients(productsClientsData);
        setProductsBonusClients(productsBonusClientsData);
      };
      fetchData();
     }, []);


     useEffect(() => { 
      if(productsBonusClienets.length !== 0 && productsClients.length !== 0) { 
        const platos = productsClients.platos || [];
        const copas = productsClients.copas || [];
        const juegoDeTe = productsClients.juegoDeTe || [];
        const juegoDeCafe = productsClients.juegoDeCafe || [];
        const manteleria = productsClients.manteleria || [];
        const mesasYSillas = productsClients.mesasYSillas || [];
        const varios = productsClients.varios || [];
        const todosLosArrays = platos.concat(copas, juegoDeTe, juegoDeCafe, manteleria, mesasYSillas, varios);
        setAllProductsClients(todosLosArrays)
    
        const platosBonusClients = productsBonusClienets.platos || [];
        const copasBonusClients = productsBonusClienets.copas || [];
        const juegoDeTeBonusClients = productsBonusClienets.juegoDeTe || [];
        const juegoDeCafeBonusClients = productsBonusClienets.juegoDeCafe || [];
        const manteleriaBonusClients = productsBonusClienets.manteleria || [];
        const mesasYSillasBonusClients = productsBonusClienets.mesasYSillas || [];
        const variosBonusClients = productsBonusClienets.varios || [];
        const todosLosArraysBonusClients = platosBonusClients.concat(copasBonusClients, juegoDeTeBonusClients, juegoDeCafeBonusClients, manteleriaBonusClients, mesasYSillasBonusClients, variosBonusClients);
        setAllProductsBonusClients(todosLosArraysBonusClients)
      }
    }, [productsClients, productsBonusClienets])



    return (
    <div className='flex flex-col'> 
        <NavBarComponent/>
          {
          allProductsBonusClients.length !== 0 && allProductsClients.length !== 0 
          ? 
          <div className='h-screen mt-24 2xl:mt-20'>
            <ArticlesTable clientsList={allProductsClients} bonusClientsList={allProductsBonusClients}/>
          </div>        
            :
          <Loading/>
          }
    
    </div>
  )
}

export default Articles

