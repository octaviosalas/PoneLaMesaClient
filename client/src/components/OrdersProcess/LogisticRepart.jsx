import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'
import DoubleConditionTable from './DoubleConditionTable'
import { getDay, getMonth, getYear, getDate } from '../../functions/gralFunctions';



const LogisticRepart = () => {

  const actualDate = getDate()
  const [logisticDeliveryOrders, setLogisticDeliveryOrders] = useState([])
  const [everyReparts, setEveryReparts] = useState([])

  console.log(getDate())

  const getOrdersToDeliverTodayInLocal = async () => { 
     try {
       const response = await axios.get("http://localhost:4000/orders")
       const orders = response.data
       const filterOrders = orders.filter((ord) => ord.dateOfDelivery === actualDate && ord.orderStatus === "Armado" && ord.placeOfDelivery !== "Local") 
       setLogisticDeliveryOrders(filterOrders)
       console.log("Ordenes filtradas: ", filterOrders)
     } catch (error) {
       console.log(error)
     }
  }

  
  const getOrderWithRepartStatus = async () => { 
    try {
      const response = await axios.get("http://localhost:4000/orders")
      const orders = response.data
      const filterOrders = orders.filter((ord) => ord.orderStatus === "Armado" && ord.placeOfDelivery !== "Local") 
      setEveryReparts(filterOrders)
      console.log("Ordenes filtradas: ", filterOrders)
    } catch (error) {
      console.log(error)
    }
 }

  useEffect(() => { 
    getOrdersToDeliverTodayInLocal()
    getOrderWithRepartStatus()
  }, [])

  return (
    <div>
         <NavBarComponent/>
         <DoubleConditionTable tableData={logisticDeliveryOrders} everyReparts={everyReparts} typeOfOrders={"Reparto"}/>
    </div>
  )
}

export default LogisticRepart