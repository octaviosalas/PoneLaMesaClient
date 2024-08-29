import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth, obtenerMesAnterior } from '../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import iconEstadistics from "../../images/iconEstadistics.png"
import ViewMorePurchasesEstadistics from './ViewMorePurchasesEstadistics';

//CANTIDAD DE COMPRAS MES ACTUAL
//CANTIDAD DE COMPRAS HISTORICA
//MONTO TOTAL INVERTIDO EN COMPRAS DEL MES
//COMPRA FAVORITA

const EstadisticsPurchases = () => {

    const [monthSelected, setMonthSelected] = useState("Todos")
    const [yearSelected, setYearSelected] = useState(getYear())
    const [actualMonth, setActualMonth] = useState(getMonth())
    const [actualYear, setActualYear] = useState(getYear())
    const [actualMonthQuantityPurchases, setActualMonthQuantityPurchases] = useState(0)
    const [everyPurchasesQuantity, setEveryPurchasesQuantity] = useState(0)
    const [totalInvertedActualMonth, setTotalInvertedActualMonth] = useState(false)
    const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
    const [availableYears, setAvailableYears] = useState(everyYears)
    const [lastMonth, setLastMonth] = useState(obtenerMesAnterior())
   // const [actualMonthQuantityOrders, setActualMonthQuantityOrders] = useState(0)
   // const [actualMonthAmountOrders, setActualMonthAmountOrders] = useState(0)
   // const [lastMonthQuantityOrders, setLastMonthQuantityOrders] = useState(0)
   // const [lastMonthAmountOrders, setLastMonthAmountOrders] = useState(0)
    const [loadingData, setLoadingData] = useState(true)

    const getOrdersData = async () => { 
        try {
            const getPurchasesActualMonth = await axios.get(`http://localhost:4000/purchases/getByMonth/${actualMonth}`)
            const response = getPurchasesActualMonth.data
            console.log("compras mes actual", response.data)
            setActualMonthQuantityPurchases(response.length)
                if(getPurchasesActualMonth.status === 200) { 
                    const getEveryPurchases = await axios.get("http://localhost:4000/purchases")
                    const response = getEveryPurchases.data
                    console.log("todas las compras", response.data)
                    setEveryPurchasesQuantity(response.length)
                      if(getEveryPurchases.status === 200) { 
                        const actualMonthPurchases = await axios.get(`http://localhost:4000/purchases/getByMonth/${actualMonth}`)
                        const response = actualMonthPurchases.data
                        const getActualMonthTotalAmountInverted = response.reduce((acc, el) => acc + el.total, 0)
                        setTotalInvertedActualMonth(formatePrice(getActualMonthTotalAmountInverted))
                      }
                }
        } catch (error) {
           console.log(error)
        }  finally {
           setLoadingData(false); 
        }
       }
      

      useEffect(() => { 
          getOrdersData()
      }, [monthSelected, yearSelected])

  return (
    <>
        {loadingData ? null :
        <div className='flex justify-between rounded-lg mt-2 items-center w-full h-10' style={{backgroundColor:"#F0F0F0"}}>
            <img src={iconEstadistics} className='h-7 w-7 ml-4'/>
            <p className='text-xs font-medium text-zinc-600'>Cantidad de Compras Mes Actual: {actualMonthQuantityPurchases}</p>
            <p className='text-xs font-medium text-zinc-600'>Cantidad Historica de Compras: {everyPurchasesQuantity}</p>
            <p className='text-xs font-medium text-zinc-600 mr-2'>Monto total Invertido Mes Actual: {totalInvertedActualMonth}</p>
            <ViewMorePurchasesEstadistics/>
        </div>}
    </>
  )
}

export default EstadisticsPurchases
