import React, { useState } from 'react'
import NavBarComponent from '../components/Navbar/Navbar'
import axios from 'axios'
import { useEffect } from 'react'
import PurchasesTable from '../components/Purchases/PurchasesTable'

const Purchases = () => { 

  const [purchases, setPurchases] = useState([])

  const getPurchases = async () => { 
    try {
        const response = await axios.get("http://localhost:4000/purchases")
        const data = response.data
        setPurchases(data)
    } catch (error) {
        console.log(error)
    }
}

    useEffect(() => { 
      getPurchases()
    }, [])

  return (
    <div>
     <NavBarComponent/>
     <PurchasesTable purchasesData={purchases} updateList={getPurchases}/>
    </div>
  )
}

export default Purchases
