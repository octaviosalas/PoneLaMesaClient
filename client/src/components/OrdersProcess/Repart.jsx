import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import Cards from './Cards'
import ProcessTables from './ProcessTables'

const Repart = () => {

    const [ordersRepart, setOrdersRepart] = useState([])

    const getOrdersInArmedState = () => { 
        axios.get("http://localhost:4000/orders")
             .then((res) => { 
                console.log(res.data)
                const data = res.data
                const filteredOrders = data.filter((d) => d.orderStatus  === "Reparto")
                setOrdersRepart(filteredOrders)
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
         <ProcessTables type="Lavado"/>
    </div>
  )
}

export default Repart