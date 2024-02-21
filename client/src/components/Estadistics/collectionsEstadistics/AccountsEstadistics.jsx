import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear } from '../../../functions/gralFunctions';
import { Card, CardBody, CardHeader, Select, SelectItem } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';


const AccountsEstadistics = () => {

    const [allCollections, setAllCollections] = useState([])
    const [monthSelected, setMonthSelected] = useState("Todos")
    const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
    const [everyAccounts, setEveryAccounts] = useState(accounts)
    const [accountSelected, setAccountSelected] = useState("")
    const [accountSelectedData, setAccountSelectedData] = useState([])
    const [actualYear, setActualYear] = useState(getYear())

 
    const getCollections = () => { 
        axios.get("http://localhost:4000/collections")
             .then((res) => { 
                const data = res.data
                if(monthSelected === "Todos") { 
                    setAllCollections(data)
                    const dataFilteredByAccountSelected = data.filter((acc) => acc.account  === accountSelected)
                    console.log(dataFilteredByAccountSelected)
                    setAccountSelectedData(dataFilteredByAccountSelected)
                } else { 
                 const dataFilteredByAccountSelectedAndMonthSelected = data.filter((acc) => acc.account  === accountSelected && acc.month === monthSelected)
                 console.log(dataFilteredByAccountSelectedAndMonthSelected)
                 setAccountSelectedData(dataFilteredByAccountSelectedAndMonthSelected)
                }
    
               
             })
             .catch((err) => { 
                console.log(err)
             })
    }

    useEffect(() => { 
        getCollections()
    }, [accountSelected, monthSelected])

  return (
    <div>
         <Card className='w-96'>
               <CardHeader className="pb-0 pt-2 px-4 flex justify-between items-center ">
                 <div className='flex flex-col jusitfy-start items-start'>
                   <p className='font-bold text-sm underline text-zinc-400'>Cobros del Mes: {monthSelected}</p>
                   <p className='font-bold text-sm underline text-zinc-400'>Año: {actualYear}</p>
                 </div>
               

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
                </CardHeader>
            <CardBody className='flex flex-col items-center justify-center'>
                <div>
                    <Select
                        items={everyAccounts}
                        label="Cuenta"
                        placeholder="Selecciona una cuenta"
                        className="w-72"
                        >
                        {(acc) => <SelectItem key={acc.value} onClick={() => setAccountSelected(acc.label)}>{acc.label}</SelectItem>}
                    </Select>
                </div>
                <div>
                     {accountSelectedData.length === 0 ? 
                       <p>Esta cuenta no ha recibido cobros</p>
                       :
                       <p className='font-medium text-black text-md'> {formatePrice(accountSelectedData.reduce((acc, el) => acc + el.amount, 0))} </p>
                     }
                </div>
           
            </CardBody>
         </Card>
    </div>
  )
}

export default AccountsEstadistics
