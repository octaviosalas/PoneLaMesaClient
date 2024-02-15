import React from 'react'
import OrdersTable from '../components/Orders/OrdersTable'
import NavBarComponent from '../components/Navbar/Navbar'

const Orders = () => {
  return (
    <div>
      <NavBarComponent/>
      <OrdersTable/>
    </div>
  )
}

export default Orders
