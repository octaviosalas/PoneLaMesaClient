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
        const productsClientsData = await getProductsClients();
        setAllProductsClients(productsClientsData);
     }

     useEffect(() => {
      getArticlesData()
     }, []);


    

    return (
    <div className='flex flex-col'> 
        <NavBarComponent/>
          {
           allProductsClients.length !== 0 
          ? 
          <div className='h-screen mt-24 2xl:mt-20'>
            <ArticlesTable />
          </div>        
            :
          <Loading/>
          }
    
    </div>
  )
}

export default Articles

