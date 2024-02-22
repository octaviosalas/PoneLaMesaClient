import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth } from '../../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';


const MonthlyBilling = () => {

    const [monthSelected, setMonthSelected] = useState("Todos")
    const [yearSelected, setYearSelected] = useState(getYear())
    const [actualMonth, setActualMonth] = useState(getMonth())
    const [actualYear, setActualYear] = useState(getYear())
    const [selectedMonthOrdersData, setSelectedMonthOrdersData] = useState([])
    const [monthAmountFactured, setMonthAmountFactured] = useState(0)
    const [withOutOrdersMonth, setWithOutOrdersMonth] = useState(false)
    const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
    const [availableYears, setAvailableYears] = useState(everyYears)


       

    const getMonthSelectedData = () => { 
        axios.get("http://localhost:4000/orders")
             .then((res) => { 
                    console.log(res.data)
                    const data = res.data
                  if(monthSelected === "Todos" && yearSelected === "Todos") { 
                    if(data.length > 0 ) { 
                        const totalAmount = data.reduce((acc, el) => acc + el.total, 0)
                        setSelectedMonthOrdersData(data)
                        setMonthAmountFactured(totalAmount)
                        setWithOutOrdersMonth(false)
                    } else { 
                        setWithOutOrdersMonth(true)
                    }
                    
                  } else if (monthSelected !== "Todos" && yearSelected === "Todos") { 
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
            
                  } else if (monthSelected !== "Todos" && yearSelected !== "Todos") { 
                    const getOrdersOfMonthYearSelected = data.filter((d) => d.month === monthSelected && d.year === yearSelected)
                    if(getOrdersOfMonthYearSelected.length > 0) {
                        const getTotalAmountFactured = getOrdersOfMonthYearSelected.reduce((acc, el) => acc + el.total, 0)
                        setSelectedMonthOrdersData(getOrdersOfMonthYearSelected)
                        setMonthAmountFactured(getTotalAmountFactured)
                        setWithOutOrdersMonth(false)
                    } else { 
                        setWithOutOrdersMonth(true)
                    }
                  }  else if (monthSelected === "Todos" && yearSelected !== "Todos") { 
                    const getOrdersOfYearSelected = data.filter((d) => d.year === yearSelected)
                    if(getOrdersOfYearSelected.length > 0) { 
                    const getTotalAmountYearFactured = getOrdersOfYearSelected.reduce((acc, el) => acc + el.total, 0)
                    setMonthAmountFactured(getTotalAmountYearFactured)
                    setSelectedMonthOrdersData(getOrdersOfYearSelected)
                    setWithOutOrdersMonth(false)
                    } else { 
                        setWithOutOrdersMonth(true)
                    }
                  }     
             })
             .catch((err) => { 
                console.log(err)
             })
    }

    useEffect(() => { 
        getMonthSelectedData()
    }, [monthSelected, yearSelected])

    

  return (
    <div>
         <Card className='shadow-xl shadow-rigth-left w-96'>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-between">
            <div className='flex flex-col jusitfy-start items-start'>
                <p className='font-bold text-sm underline text-zinc-400'>Monto Facturado</p>
            </div> 
            <div className='flex gap-4 items-center'>
                  <Dropdown>
                        <DropdownTrigger>
                            <p className='text-black cursor-pointer font-bold text-xl'>...</p>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...everyMonths]}>
                            {(item) => (
                            <DropdownItem key={item.key} onClick={() => setMonthSelected(item.label)}>
                                {item.label}
                            </DropdownItem>
                            )}
                        </DropdownMenu>
                 </Dropdown>

                  <Dropdown>
                        <DropdownTrigger>
                            <p className='text-black cursor-pointer font-bold text-xl'>...</p>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...availableYears]}>
                            {(item) => (
                            <DropdownItem key={item.key} onClick={() => setYearSelected(item.label)}>
                                {item.label}
                            </DropdownItem>
                            )}
                        </DropdownMenu>
                  </Dropdown>
            </div>

           
            </CardHeader>
            <CardBody>
                <div className='flex flex-col'>
                       <div className='flex flex-col justify-start items-start'>
                            <p className='font-medium text-sm text-zinc-600'>Estas viendo la facturacion del Mes: <b>{monthSelected}</b></p>
                            <p className='font-medium text-sm text-zinc-600'>Estas viendo la facturacion del Año: <b>{yearSelected}</b></p>
                        </div>
                        <div>
                        {withOutOrdersMonth ?
                         <p className='font-medium text-sm text-zinc-600 mt-4'>No hubo pedidos en {monthSelected} de {yearSelected}</p>
                           :
                        <p className='font-medium text-sm text-zinc-600 mt-2'>El Monto total facturado  es: {formatePrice(monthAmountFactured)} </p>
                        }
                        </div>
                </div>
            </CardBody>
         </Card>
    </div>
  )
}

export default MonthlyBilling