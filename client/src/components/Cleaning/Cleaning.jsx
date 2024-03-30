import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from '../OrdersProcess/ProcessTables'
import CleaningDetailList from './CleaningDetailList'

const Cleaning = () => {

    const [productsQuantityToWash, setProductsQuantityToWash] = useState([])

    const getDataOfWash = async () => { 
      try {
        const data = await axios.get("http://localhost:4000/cleaning")
        const response = data.data
        const filterProductsWithQuantityMoreThanCero = await response.filter((res) => res.quantity > 0)
        console.log(filterProductsWithQuantityMoreThanCero)
        setProductsQuantityToWash(filterProductsWithQuantityMoreThanCero)
      } catch (error) {
        console.log(error)
      }
    }


    useEffect(() => { 
        getDataOfWash()
    }, [])

  return (
    <div>
         <NavBarComponent/>
         <CleaningDetailList washData={productsQuantityToWash} updateNumbers={getDataOfWash}/>
    </div>
  )
}

export default Cleaning