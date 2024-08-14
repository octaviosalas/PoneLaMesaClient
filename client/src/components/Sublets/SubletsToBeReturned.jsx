import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from '../OrdersProcess/ProcessTables'
import SubletsToReturnDetailList from './SubletsToReturnDetailList'

const SubletsToBeReturned = () => {

  const [productsQuantityToReturn, setProductsQuantityToReturn] = useState([])

    const getDataOfWash = async () => { 
      try {
        const data = await axios.get("http://localhost:4000/subletsToReturn")
        const response = data.data
        const filterProductsWithQuantityMoreThanCero = await response.filter((res) => res.quantity > 0)
        console.log("ACAAAA", filterProductsWithQuantityMoreThanCero)
        setProductsQuantityToReturn(filterProductsWithQuantityMoreThanCero)
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
        <div>
            <SubletsToReturnDetailList washData={productsQuantityToReturn} updateNumbers={getDataOfWash}/>
        </div>
    </div>
  )
}

export default SubletsToBeReturned
