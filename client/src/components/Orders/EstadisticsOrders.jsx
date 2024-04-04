import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth, obtenerMesAnterior } from '../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import iconEstadistics from "../../images/iconEstadistics.png"
import viewMore from "../../images/viewMore.png"
import ViewMoreEstadistics from './ViewMoreEstadistics';

//cantidad de ordenes mes corriente
//total facturado al dia de hoy
//cantidad de ordenes mes pasado
//total facturado mes pasado


const EstadisticsOrders = () => {

  const [monthSelected, setMonthSelected] = useState("Todos")
  const [yearSelected, setYearSelected] = useState(getYear())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())
  const [selectedMonthOrdersData, setSelectedMonthOrdersData] = useState([])
  const [monthAmountFactured, setMonthAmountFactured] = useState(0)
  const [withOutOrdersMonth, setWithOutOrdersMonth] = useState(false)
  const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [lastMonth, setLastMonth] = useState(obtenerMesAnterior())
  const [actualMonthQuantityOrders, setActualMonthQuantityOrders] = useState(0)
  const [actualMonthAmountOrders, setActualMonthAmountOrders] = useState(0)
  const [lastMonthQuantityOrders, setLastMonthQuantityOrders] = useState(0)
  const [lastMonthAmountOrders, setLastMonthAmountOrders] = useState(0)
  const [loadingData, setLoadingData] = useState(true)


         const getOrdersData = async () => { 
          try {
             const actualMonthOrders = await axios.get(`http://localhost:4000/orders/getByMonth/${actualMonth}`)
              const response = actualMonthOrders.data
              setActualMonthQuantityOrders(response.length)

                if(actualMonthOrders.status === 200) { 
                      const lastMonthOrders = await axios.get(`http://localhost:4000/orders/getByMonth/${lastMonth}`)
                      const response = lastMonthOrders.data
                      setLastMonthQuantityOrders(response.length)              
                  
                    if(lastMonthOrders.status === 200) { 
                        const ordersCollections = await axios.get(`http://localhost:4000/collections/getByMonth/${actualMonth}`)
                        const response = ordersCollections.data
                        const getJustOrdersCollection = response.filter((ord) => ord.collectionType === "Alquiler")
                        const getTotalAmountCollectionsMonth = getJustOrdersCollection.reduce((acc, el) => acc + el.amount, 0)
                        setActualMonthAmountOrders(formatePrice(getTotalAmountCollectionsMonth))

                      if(ordersCollections.status === 200) { 
                          const ordersCollectionsLasMonth = await axios.get(`http://localhost:4000/collections/getByMonth/${lastMonth}`)
                          const response = ordersCollectionsLasMonth.data
                          const getJustOrdersCollectionLastMonth = response.filter((ord) => ord.collectionType === "Alquiler")
                          const getTotalAmountCollectionsLastMonth = getJustOrdersCollectionLastMonth.reduce((acc, el) => acc + el.amount, 0)
                          setLastMonthAmountOrders(formatePrice(getTotalAmountCollectionsLastMonth))
                      }
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
      <div className='flex justify-between rounded-lg mt-2 items-center lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] h-10' style={{backgroundColor:"#F0F0F0"}}>
          <img src={iconEstadistics} className='h-7 w-7 ml-4'/>
          <p className='text-xs font-medium text-zinc-600'>Cantidad de Ordenes Mes Actual: {actualMonthQuantityOrders}</p>
          <p className='text-xs font-medium text-zinc-600'>Total Facturado Mes Actual: {actualMonthAmountOrders}</p>
          <p className='text-xs font-medium text-zinc-600'>Cantidad de Ordenes Mes Pasado: {lastMonthQuantityOrders}</p>
          <p className='text-xs font-medium text-zinc-600'>Total Facturado Mes Pasado: {lastMonthAmountOrders}</p>
          <ViewMoreEstadistics/>
      </div>    }
    </>

  )
}

export default EstadisticsOrders
