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
            console.log(response)
            const filterByReplacementes = response.filter((client) => client.clientDebt.length > 0)
            const fi = filterByReplacementes.map((ff) => ff.clientDebt)
            console.log("mira aca", fi)
            const getWithOutPaid = filterByReplacementes.map((ff) => ff.clientDebt).flat().filter((data) => data.paid === false)
            console.log("Reposiciones sin abonar", getWithOutPaid)
            console.log("Cantidad de reposiciones sin abonar", getWithOutPaid.length)
            console.log("Monto total pediente a cobrar", getWithOutPaid.reduce((acc, el) => acc + el.amountToPay, 0))
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
            console.log("Reposiciones pendientes de pago en detalle", transformAndShowClient)
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
