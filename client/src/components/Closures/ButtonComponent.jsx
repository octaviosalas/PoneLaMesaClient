import React, {useState, useEffect} from 'react'
import {Button} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";


const ButtonComponent = ({allExpenses, purchases, sublets, fixedExpenses, paidsOrder, noPaidsOrder, allOrders, shiftsData}) => {

    const navigate = useNavigate()

    const goToSeeTheClousure =  () => { 
        localStorage.setItem('allExpenses', JSON.stringify(allExpenses));
        localStorage.setItem('purchases', JSON.stringify(purchases));
        localStorage.setItem('sublets', JSON.stringify(sublets));
        localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));
        localStorage.setItem('paidsOrder', JSON.stringify(paidsOrder));
        localStorage.setItem('noPaidsOrder', JSON.stringify(noPaidsOrder));
        localStorage.setItem('allOrders', JSON.stringify(allOrders));
        localStorage.setItem('shiftsData', JSON.stringify(shiftsData));
        setTimeout(() => { 
            navigate(`/Cierre/Personalizado`)
        }, 2500)

      }

 

  return (
    <div>
        <Button onClick={() => goToSeeTheClousure()}>Ver datos</Button>
    </div>
  )
}

export default ButtonComponent
