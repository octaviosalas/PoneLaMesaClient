import React from 'react'
import NavBarComponent from '../components/Navbar/Navbar'
import PurchasesByMonthAndYear from '../components/Estadistics/purchasesEstadistics/PurchasesByMonthAndYear'

const EstadisticsPurchases = () => {
  return (
    <div>
        <NavBarComponent/>
        <PurchasesByMonthAndYear/>
    </div>
  )
}

export default EstadisticsPurchases
