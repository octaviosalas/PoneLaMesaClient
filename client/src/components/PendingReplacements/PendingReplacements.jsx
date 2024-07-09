import React, { useEffect, useState } from 'react'
import axios from "axios"
import NavBarComponent from '../Navbar/Navbar'
import PendingReplacementsTableData from './PendingReplacementsTableData'

const PendingReplacements = () => {

    const [pendingReplacements, setPendingReplacements] = useState([])
  
    const getPendings = async () => { 
        try {
            const query = await axios.get("http://localhost:4000/clients")
            const response = query.data
            const filterByReplacementes = response.filter((client) => client.clientDebt.length > 0)
            const fi = filterByReplacementes.map((ff) => ff.clientDebt)
            const getWithOutPaid = filterByReplacementes.map((ff) => ff.clientDebt).flat().filter((data) => data.paid === false)
            const transformAndShowClient = getWithOutPaid.map((cc) => { 
                return  { 
                    clientName: cc.orderCompletedData.map((c) => c.client)[0],
                    clientId: cc.orderCompletedData.map((c) => c.clientId)[0],
                    amountToPay: cc.amountToPay,
                    replacementeDetail: cc.productsMissed,
                    debtId: cc.debtId,
                    orderCompletedData: cc.orderCompletedData
                }
            })
            setPendingReplacements(transformAndShowClient)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=> { 
        getPendings()
    }, [])

  return (
    <div>
      <NavBarComponent/>
      <PendingReplacementsTableData replacementes={pendingReplacements} updateList={getPendings}/>
    </div>
  )
}

export default PendingReplacements
