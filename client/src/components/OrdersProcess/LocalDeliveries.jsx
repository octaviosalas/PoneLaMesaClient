import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import NavBarComponent from '../Navbar/Navbar'
import { getDate, getDay, getMonth, getYear } from '../../functions/gralFunctions'
import DoubleConditionTable from './DoubleConditionTable'

const LocalDeliveries = () => {

  const actualDate = getDate()
  const [localDeliveryOrders, setLocalDeliveryOrders] = useState([])

  const getOrdersToDeliverTodayInLocal = async () => { 
     try {
       const response = await axios.get("http://localhost:4000/orders")
       const orders = response.data
       const filterOrders = orders.filter((ord) => ord.dateOfDelivery === actualDate && ord.placeOfDelivery === "Local") 
       setLocalDeliveryOrders(filterOrders)
       console.log("Ordenes filtradas: ", filterOrders)
     } catch (error) {
       console.log(error)
     }
  }


  useEffect(() => { 
    getOrdersToDeliverTodayInLocal()
  }, [])

  return (
    <div>
         <NavBarComponent/>
         <DoubleConditionTable tableData={localDeliveryOrders} typeOfOrders={"EntregasLocal"}/> 
    </div>
  )
}

export default LocalDeliveries
