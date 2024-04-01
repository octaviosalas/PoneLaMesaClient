import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from '../OrdersProcess/ProcessTables'
import DepositList from './DepositList'

const Deposit = () => {

    const [productsQuantityDeposit, setProductsQuantityDeposit] = useState([])

    const getDataOfDeposit = async () => { 
      try {
        const data = await axios.get("http://localhost:4000/deposit")
        const response = data.data
        const filterProductsWithQuantityMoreThanCero = await response.filter((res) => res.quantity > 0)
        console.log(filterProductsWithQuantityMoreThanCero)
        setProductsQuantityDeposit(filterProductsWithQuantityMoreThanCero)
      } catch (error) {
        console.log(error)
      }
    }


    useEffect(() => { 
        getDataOfDeposit()
    }, [])

  return (
    <div>
         <NavBarComponent/>
         <DepositList depositData={productsQuantityDeposit} updateNumbers={getDataOfDeposit}/>
    </div>
  )
}

export default Deposit