import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth } from '../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import viewMore from "../../images/viewMore.png"
import arrowDown from "../../images/arrowDown.png"


const ViewMoreEstadistics = () => { 
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
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
        console.log(monthSelected)
        console.log(yearSelected)
    }, [monthSelected, yearSelected])


  return (
    <>
      <img onClick={onOpen} src={viewMore} className="h-7 w-7 cursor-pointer mr-4"/>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Estadisticas Alquileres</ModalHeader>
              <ModalBody>
              <Card className='shadow-xl shadow-rigth-left w-96'>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-between">
               
                <div className='flex gap-4 items-center'>
                    <Dropdown>
                            <DropdownTrigger>
                                <div className="flex items-center gap-1">
                                  <p className='text-black cursor-pointer font-bold text-md'>Elegir Mes </p>
                                  <img src={arrowDown} className='h-3 w-2 mt-1'/>
                                </div>
                               
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...everyMonths]}>
                                {(item) => (
                                <DropdownItem key={item.value} onClick={() => setMonthSelected(item.label)}>
                                    {item.label}
                                </DropdownItem>
                                )}
                            </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                            <DropdownTrigger>
                            <div className="flex items-center gap-1">
                                  <p className='text-black cursor-pointer font-bold text-md'>Elegir Año </p>
                                  <img src={arrowDown} className='h-3 w-2 mt-1'/>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...everyYears]}>
                                {(item) => (
                                <DropdownItem key={item.value} onClick={() => setYearSelected(item.label)}>
                                    {item.label}
                                </DropdownItem>
                                )}
                            </DropdownMenu>
                            </Dropdown>
                </div>

           
            </CardHeader>
                    <CardBody>
                        <div className='flex flex-col mt-6'>
                            <div className='flex flex-col justify-start items-start'>
                                    <p className='font-medium text-sm text-zinc-600'> Mes Elegido: <b>{monthSelected}</b></p>
                                    <p className='font-medium text-sm text-zinc-600'> Año Elegido: <b>{yearSelected}</b></p>
                                </div>
                                <div>
                                {withOutOrdersMonth ?
                                <p className='font-medium text-sm text-red-600 mt-4'>No hubo pedidos en {monthSelected} de {yearSelected}</p>
                                :
                                <p className='font-medium text-sm text-green-800 mt-2'>El Monto total facturado  es: <b>{formatePrice(monthAmountFactured)}</b> </p>
                                }
                                </div>
                        </div>
                    </CardBody>
               </Card>
              </ModalBody>
                <ModalFooter className="flex items-center justify-center">
                  <Button className="bg-green-800 text-white font-medium text-sm w-full" onPress={onClose}>
                    Cerrar
                  </Button>               
                </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}



export default ViewMoreEstadistics;