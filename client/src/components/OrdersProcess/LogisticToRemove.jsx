import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'
import DoubleConditionTable from './DoubleConditionTable'
import { getDay, getMonth, getYear, getDate } from '../../functions/gralFunctions';

//todos los pedidos para RETIRAR  con fecha de DEVOLUCION === hoy y LUGAR DE DEVOLUCION ==! local)

const LogisticToRemove = () => {

  const actualDate = getDate()
  const [logisticToRemove, setLogisticToRemove] = useState([])

  const getOrdersToDeliverTodayInLocal = async () => { 
     try {
       const response = await axios.get("http://localhost:4000/orders")
       const orders = response.data
       const filterOrders = orders.filter((ord) => ord.returnDate === actualDate && ord.returnPlace !== "Local") 
       setLogisticToRemove(filterOrders)
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
         <DoubleConditionTable tableData={logisticToRemove} typeOfOrders={"Retiros"}/>
    </div>
  )
}

export default LogisticToRemove