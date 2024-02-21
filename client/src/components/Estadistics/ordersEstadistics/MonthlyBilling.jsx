import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatePrice, getMonth, getYear, everyMonthsOfTheYear } from '../../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';


const MonthlyBilling = () => {

    const [monthSelected, setMonthSelected] = useState("febrero")
    const [actualMonth, setActualMonth] = useState(getMonth())
    const [selectedMonthOrdersData, setSelectedMonthOrdersData] = useState([])
    const [monthAmountFactured, setMonthAmountFactured] = useState(0)
    const [withOutOrdersMonth, setWithOutOrdersMonth] = useState(false)
    const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
    
      

    const getMonthSelectedData = () => { 
        axios.get("http://localhost:4000/orders")
             .then((res) => { 
                    console.log(res.data)
                    const data = res.data
                    const getOrdersOfMonthSelected = data.filter((d) => d.month === monthSelected)
                    if(getOrdersOfMonthSelected.length !== 0) { 
                        setWithOutOrdersMonth(false)
                        const getTotalAmountFactured = getOrdersOfMonthSelected.reduce((acc, el) => acc + el.total, 0)
                        setSelectedMonthOrdersData(getOrdersOfMonthSelected)
                        setMonthAmountFactured(getTotalAmountFactured)
                        console.log(getOrdersOfMonthSelected)
                    } else { 
                        setWithOutOrdersMonth(true)
                    }              
             })
             .catch((err) => { 
                console.log(err)
             })
    }

    useEffect(() => { 
        getMonthSelectedData()
    }, [monthSelected])

    

  return (
    <div>
         <Card className='shadow-xl shadow-rigth-left w-96'>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center">
            <p className='font-bold text-sm underline text-zinc-400'>Monto Facturado al mes</p>
            </CardHeader>
            <CardBody>
                <div className='flex flex-col'>
                       <div className='flex justify-between'>
                            <p className='font-medium text-sm text-zinc-600'>Ganancias de: <b>{monthSelected}</b></p>
                             <Dropdown>
                                <DropdownTrigger>
                                    <p className='text-black cursor-pointer font-bold text-xl'>...</p>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dynamic Actions" items={everyMonths}>
                                    {(item) => (
                                    <DropdownItem key={item.key} onClick={() => setMonthSelected(item.label)}>
                                        {item.label}
                                    </DropdownItem>
                                    )}
                                </DropdownMenu>
                              </Dropdown>
                        </div>
                        <div>
                        {withOutOrdersMonth ?
                         <p className='font-medium text-sm text-zinc-600 mt-4'>No hubo pedido en {monthSelected}</p>
                           :
                        <p className='font-medium text-sm text-zinc-600 mt-2'>El Monto total facturado de {monthSelected} es: {formatePrice(monthAmountFactured)} </p>
                        }
                        </div>
                </div>
            </CardBody>
         </Card>
    </div>
  )
}

export default MonthlyBilling