import React, { useState } from 'react'
import NavBarComponent from '../components/Navbar/Navbar'
import axios from 'axios'
import { useEffect } from 'react'
import PurchasesTable from '../components/Purchases/PurchasesTable'

const Purchases = () => {

  return (
    <div>
     <NavBarComponent/>
     <PurchasesTable />
    </div>
  )
}

export default Purchases
