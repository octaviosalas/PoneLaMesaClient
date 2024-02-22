import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears } from '../../../functions/gralFunctions';
import { Card, CardBody, CardHeader, Select, SelectItem } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';


const AccountsEstadistics = () => {

    const [allCollections, setAllCollections] = useState([])
    const [monthSelected, setMonthSelected] = useState("Todos")
    const [yearSelected, setYearSelected] = useState(getYear())
    const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
    const [everyAccounts, setEveryAccounts] = useState(accounts)
    const [accountSelected, setAccountSelected] = useState("")
    const [accountSelectedData, setAccountSelectedData] = useState([])
    const [actualYear, setActualYear] = useState(getYear())
    const [availableYears, setAvailableYears] = useState(everyYears)
    const [withOutCollections, setWithOutCollections] = useState(false)


 
    const getCollections = () => { 
        axios.get("http://localhost:4000/collections")
             .then((res) => { 
                const data = res.data
                if(monthSelected === "Todos" && yearSelected === "Todos") { 

                    if(data.length > 0) { 
                        setAllCollections(data)
                        const dataFilteredByAccountSelected = data.filter((acc) => acc.account  === accountSelected)
                        console.log("Primer If", dataFilteredByAccountSelected)
                        setAccountSelectedData(dataFilteredByAccountSelected)
                    } else { 
                        setWithOutCollections(true)
                    }
                   
                } else if (yearSelected !== "Todos" && monthSelected !== "Todos") { 
                 const dataFilteredByAccountSelectedMonthSelectedYearAlso = data.filter((acc) => acc.account  === accountSelected && acc.month === monthSelected  && acc.year === yearSelected)
                 console.log("segundo if:", dataFilteredByAccountSelectedMonthSelectedYearAlso)
                  if(dataFilteredByAccountSelectedMonthSelectedYearAlso.length > 0) { 
                    setAccountSelectedData(dataFilteredByAccountSelectedMonthSelectedYearAlso)
                    setWithOutCollections(false)
                  } else { 
                    setWithOutCollections(true)
                  }
                  } else if (yearSelected !== "Todos" && monthSelected === "Todos") { 
                    const dataFilteredByYear = data.filter((acc) => acc.account  === accountSelected &&  acc.year === yearSelected)
                    console.log("tercer if:", dataFilteredByYear)
                    if(dataFilteredByYear.length > 0) { 
                        setAccountSelectedData(dataFilteredByYear)
                        setWithOutCollections(false)
                    } else { 
                        setWithOutCollections(true)
                    }

                  } else if (yearSelected === "Todos" && monthSelected !== "Todos") { 
                    const dataFilteredByMonth = data.filter((acc) => acc.account  === accountSelected &&  acc.month === monthSelected)
                    if(dataFilteredByMonth.length !== 0) { 
                        setAccountSelectedData(dataFilteredByMonth);
                        setWithOutCollections(false)
                    } else { 
                        setWithOutCollections(true)
                    }      
                  }
    
               
             })
             .catch((err) => { 
                console.log(err)
             })
    }

    useEffect(() => { 
        getCollections()
    }, [accountSelected, monthSelected, yearSelected])

  return (
    <div>
         <Card className='w-96'>
               <CardHeader className="pb-0 pt-2 px-4 flex justify-between items-center ">
                 <div className='flex flex-col jusitfy-start items-start'>
                   <p className='font-bold text-sm underline text-zinc-400'>Cobros del Mes: {monthSelected}</p>
                   <p className='font-bold text-sm underline text-zinc-400'>Año: {yearSelected}</p>
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
                  
               

               
               {withOutCollections ? <p>No hubo cobros</p> :  <p className='font-medium text-black text-md'>Monto: {formatePrice(accountSelectedData.reduce((acc, el) => acc + el.amount, 0))} </p>}
                    
                </div>
           
            </CardBody>
         </Card>
    </div>
  )
}

export default AccountsEstadistics
