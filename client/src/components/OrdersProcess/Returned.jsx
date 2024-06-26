import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'

const Returned = () => {

    const [ordersReturned, setOrdersReturned] = useState([])

    const getOrdersInArmedState = () => { 
        axios.get("http://localhost:4000/orders")
             .then((res) => { 
                console.log(res.data)
                const data = res.data
                const filteredOrders = data.filter((d) => d.orderStatus  === "Repuesto")
                setOrdersReturned(filteredOrders)
                console.log(filteredOrders)
             })
             .catch((err) => { 
                console.log(err)
             })
    }

    useEffect(() => { 
        getOrdersInArmedState()
    }, [])

  return (
    <div>
        <NavBarComponent/>
        <ProcessTables orderStatus="Repuesto"/>
    </div>
  )
}

export default Returned