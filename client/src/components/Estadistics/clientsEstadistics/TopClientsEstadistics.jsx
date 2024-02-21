import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { getEveryOrders } from '../../../functions/gralFunctions'

const TopClientsEstadistics = () => {

    
    const [allOrders, setAllOrders] = useState([])
    const [withOutOrders, setWithOutOrders] = useState(false)
    const [monthSelected, setMonthSelected] = useState("Todos")


    useEffect(() => {
        const fetchData = async () => {
          try {
            const ordersData = await getEveryOrders();
            if(monthSelected === "Todos") { 
              setAllOrders(ordersData);
              setWithOutOrders(false)
            } else { 
              const filterDataByMonthSelected = ordersData.filter((orders) => orders.month === monthSelected)
              if(filterDataByMonthSelected.length !== 0) { 
                  setAllOrders(filterDataByMonthSelected);
                  setWithOutOrders(false)
              } else { 
                  setWithOutOrders(true)
                  console.log("cccc")
              }
            }
  
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };
        fetchData();
      }, [monthSelected]); 

      const orderOrdersByClient = () => { 
        const agroupOrdersByClient = allOrders.reduce((acc, el) => { 
            const idClient = el.clientId
            if(acc[idClient]) { 
                acc[idClient].push(el)
            } else { 
                acc[idClient] = [el]
            }
            return acc
        }, {})
        const getDataOnArray = Object.entries(agroupOrdersByClient).map(([idClient, orders]) => ({ 
            idClient: idClient,
            clientName: orders.map((d) => d.client)[0],
            orders: orders
        }))
        return getDataOnArray
      }

      useEffect(() => { 
        if(allOrders.length >= 0) { 
            console.log("Estadisticas de Clientes: ", allOrders)       
            console.log(orderOrdersByClient())
        }
      }, [allOrders])


  return (
    <div>
       lala
    </div>
  )
}

export default TopClientsEstadistics
