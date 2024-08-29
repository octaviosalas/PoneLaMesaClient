import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth, obtenerMesAnterior } from '../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import iconEstadistics from "../../images/iconEstadistics.png"

const EstadisticsClients = () => {
  
    const [quantityClients, setQuantityClients] = useState(0)
    const [quantityBonifiedClients, setQuantityBonifiedClients] = useState(0)
    const [quantityNoBonifiedClients, setQuantityNoBonifiedClients] = useState(0)
    const [loadingData, setLoadingData] = useState(true)

    const getClientsData = async () => { 
      try {
         const getQuantityClients = await axios.get("http://localhost:4000/clients")
         const response = getQuantityClients.data
         console.log("clientes", response)
         setQuantityClients(response.length)
         if(getQuantityClients.status === 200) { 
            const getBonifiedClients = await axios.get(`http://localhost:4000/clients/byType/Bonificado`)
            const response = getBonifiedClients.data
            console.log("clientes bonificados", response)
            setQuantityBonifiedClients(response.length)
             if(getBonifiedClients.status === 200) { 
                const getNoBonifiedClients = await axios.get(`http://localhost:4000/clients/byType/No Bonificado`)
                const response = getNoBonifiedClients.data
                console.log("clientes NO bonificados", response)
                setQuantityNoBonifiedClients(response.length)
             }
         }
      } catch (error) {
         console.log(error)
      } finally { 
        setLoadingData(false)
      }
    }

    useEffect(() => { 
        getClientsData()
    }, [])


  return (
    <div className='w-full'>
        {loadingData ? null :
                <div className='flex justify-between rounded-lg w-full mt-2 items-center h-10' style={{backgroundColor:"#F0F0F0"}}>
                    <img src={iconEstadistics} className='h-7 w-7 ml-4'/>
                    <p className='text-xs font-medium text-zinc-600'>Cantidad Total de Clientes: {quantityClients}</p>
                    <p className='text-xs font-medium text-zinc-600'>Cantidad de Clientes Bonificados: {quantityBonifiedClients}</p>
                    <p className='mr-4 text-xs font-medium text-zinc-600'>Cantidad de Clientes No Bonificados: {quantityNoBonifiedClients}</p>
                </div>}
    </div>
  )
}

export default EstadisticsClients
