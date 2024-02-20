import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {Card, CardBody} from "@nextui-org/react";
import { formatePrice, getMonth, getYear } from '../../functions/gralFunctions';
import NavBarComponent from '../Navbar/Navbar';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, Dropdown, DropdownMenu, Avatar, DropdownTrigger, DropdownItem, Button} from "@nextui-org/react";


const Estadistics = () => {

    const [monthSelected, setMonthSelected] = useState("febrero")
    const [actualMonth, setActualMonth] = useState(getMonth())
    const [selectedMonthOrdersData, setSelectedMonthOrdersData] = useState([])
    const [monthAmountFactured, setMonthAmountFactured] = useState(0)
    const [withOutOrdersMonth, setWithOutOrdersMonth] = useState(false)
    
      const months = [
        { key: "enero", label: "enero"},
        { key: "febrero", label: "febrero"},
        { key: "marzo", label: "marzo"},
        {key: "abril", label: "abril"},
        {key: "mayo", label: "mayo"},
        {key: "junio", label: "junio"},
        {key: "julio", label: "julio"},
        {key: "agosto", label: "agosto"},
        {key: "septiembre", label: "septiembre"},
        {key: "octubre", label: "octubre"},
        {key: "noviembre", label: "noviembre"},
        {key: "diciembre", label: "diciembre"},
      ];

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
        <NavBarComponent/>
         <Card className='shadow-xl shadow-rigth-left w-96'>
            <CardBody>
                <div className='flex flex-col'>
                       <div className='flex justify-between'>
                            <p className='font-medium text-sm text-zinc-600'>Ganancias de: <b>{monthSelected}</b></p>
                             <Dropdown>
                                <DropdownTrigger>
                                    <p className='text-zinc-500  font-medium text-lg'>...</p>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dynamic Actions" items={months}>
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
                        <p className='font-medium text-sm text-zinc-600 mt-4'>El Monto total facturado de {monthSelected} es: {formatePrice(monthAmountFactured)} </p>
                        }
                        </div>
                </div>
            </CardBody>
         </Card>
    </div>
  )
}

export default Estadistics
