import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import NavBarComponent from '../Navbar/Navbar'
import { getDate, getDay, getMonth, getYear } from '../../functions/gralFunctions'
import DoubleConditionTable from './DoubleConditionTable'
import ReturnsTable from './ReturnsTable'

//  Devoluciones del dia =   const filterOrders = orders.filter((ord) => ord.returnDate === actualDate && ord.returnPlace === "Local") 
//  El segundo item de la tabla sera "Pendientes".  Esta tabla tendra a las ordenes con estado "Entregado".
//  Todas las devoluciones = todas las ordenes con devuelto - lavado - repuesto 

const Returns = () => {

  const actualDate = getDate()

  const [todaysReturns, setTodaysReturns] = useState([])
  const [pendingReturns, setPendingReturns] = useState([])
  const [everyReturns, setEveryReturns] = useState([])
  const [returnsToFetch, setReturnsToFetch] = useState([])

  const getOrdersToDeliverTodayInLocal = async () => { 
     try {
       const response = await axios.get("http://localhost:4000/orders")
       const orders = await response.data
       const getTodaysLocalReturns = orders.filter((ord) => ord.returnDate === actualDate && ord.returnPlace === "Local" && ord.orderStatus === "Entregado") 
       const getOrdersDelivered = orders.filter((ord) => ord.orderStatus === "Entregado") 
       const getHistoricEveryReturns = orders.filter((ord) =>  ord.orderStatus === "Devuelto" ) 
       const getTodaysReturnsToLogisticRepart = orders.filter((ord) => ord.returnDate === actualDate && ord.returnPlace !== "Local" && ord.orderStatus === "Entregado") 
       setTodaysReturns(getTodaysLocalReturns)
       setPendingReturns(getOrdersDelivered)
       setEveryReturns(getHistoricEveryReturns)
       setReturnsToFetch(getTodaysReturnsToLogisticRepart)
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
         <ReturnsTable todaysReturns={todaysReturns} pendingReturns={pendingReturns} everyReturns={everyReturns} returnsToFetch={returnsToFetch} updateList={getOrdersToDeliverTodayInLocal}/>
    </div>
  )
}

export default Returns
