import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import NavBarComponent from '../Navbar/Navbar'
import { getDate, getDay, getMonth, getYear } from '../../functions/gralFunctions'
import DoubleConditionTable from './DoubleConditionTable'

const LocalDeliveries = () => {

  const actualDate = getDate()
  const [localDeliveryOrders, setLocalDeliveryOrders] = useState([])
  const [everyDeliveries, setEveryDeliveries] = useState([])
  const [ordersToRepartToday, setOrdersToRepartToday] = useState([])
  const [futuresReparts, setFuturesReparts] = useState([])

  const getOrdersToDeliverTodayInLocal = async () => { 
     try {
       const response = await axios.get("http://localhost:4000/orders")
       const orders = response.data
       const filterOrders = orders.filter((ord) => 
        (ord.dateOfDelivery === actualDate && ord.placeOfDelivery === "Local") &&
        (ord.orderStatus === "Armado" || ord.orderStatus === "Confirmado")
      );
       setLocalDeliveryOrders(filterOrders)
       console.log("Table Data", filterOrders)
     } catch (error) {
       console.log(error)
     }
  }

  const getEveryDeliveries = async () => { 
    try {
      const response = await axios.get("http://localhost:4000/orders")
      const orders = response.data
      const filterOrders = orders.filter((ord) => ord.orderStatus === "Entregado") 
      setEveryDeliveries(filterOrders)
      console.log("Every Deliveries ", filterOrders)
    } catch (error) {
      console.log(error)
    }
  }

  const getOrdersToRepartToday = async () => { 
    try {
      const response = await axios.get("http://localhost:4000/orders")
      const orders = response.data
      const filterOrders = orders.filter((ord) => 
        (ord.dateOfDelivery === actualDate && ord.placeOfDelivery !== "Local") &&
        (ord.orderStatus === "Armado" || ord.orderStatus === "Confirmado")
      );
      setOrdersToRepartToday(filterOrders)
      console.log("Ordenes filtradas: ", filterOrders)
    } catch (error) {
      console.log(error)
    }
  }


  const getFuturesOrdersToRepart = async () => { 
  try {
    const response = await axios.get("http://localhost:4000/orders")
    const orders = response.data
    const filterOrders = orders.filter((ord) => ord.orderStatus === "Armado" && ord.placeOfDelivery !== "Local") 
    setFuturesReparts(filterOrders)
    console.log("Ordenes filtradas ------- FUTUROS REPARTOS: ", filterOrders)
  } catch (error) {
    console.log(error)
  }
  }

  const unifyFunctions = async () => { 
    console.log("unify again")
    await getOrdersToDeliverTodayInLocal()
    await getEveryDeliveries()
    await getFuturesOrdersToRepart()
  }


  useEffect(() => { 
    getOrdersToDeliverTodayInLocal()
    getEveryDeliveries()
    getOrdersToRepartToday()
    getFuturesOrdersToRepart()
  }, [])

  return (
    <div>
         <NavBarComponent/>
         <DoubleConditionTable 
          tableData={localDeliveryOrders} everyDeliveries={everyDeliveries} ordersToRepartToday={ordersToRepartToday} 
          futuresReparts={futuresReparts}  typeOfOrders="entregas" again={unifyFunctions}/> 
    </div>
  )
}

export default LocalDeliveries
