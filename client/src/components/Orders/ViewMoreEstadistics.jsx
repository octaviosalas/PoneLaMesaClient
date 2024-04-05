import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth } from '../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react';
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
    const [size, setSize] = useState("xl")


    const getMonthSelectedData = () => { 
        axios.get("http://localhost:4000/collections")
             .then((res) => { 
                    console.log(res.data)
                    const filteredData = res.data.filter((col) => col.collectionType === "Alquiler")
                    const data = filteredData
                  if(monthSelected === "Todos" && yearSelected === "Todos") { 
                    if(data.length > 0 ) { 
                        const totalAmount = data.reduce((acc, el) => acc + el.amount, 0)
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
                        const getTotalAmountFactured = getOrdersOfMonthSelected.reduce((acc, el) => acc + el.amount, 0)
                        setSelectedMonthOrdersData(getOrdersOfMonthSelected)
                        setMonthAmountFactured(getTotalAmountFactured)
                        console.log(getOrdersOfMonthSelected)
                    } else { 
                        setWithOutOrdersMonth(true)
                    }    
            
                  } else if (monthSelected !== "Todos" && yearSelected !== "Todos") { 
                    const getOrdersOfMonthYearSelected = data.filter((d) => d.month === monthSelected && d.year === yearSelected)
                    if(getOrdersOfMonthYearSelected.length > 0) {
                        const getTotalAmountFactured = getOrdersOfMonthYearSelected.reduce((acc, el) => acc + el.amount, 0)
                        setSelectedMonthOrdersData(getOrdersOfMonthYearSelected)
                        setMonthAmountFactured(getTotalAmountFactured)
                        setWithOutOrdersMonth(false)
                    } else { 
                        setWithOutOrdersMonth(true)
                    }
                  }  else if (monthSelected === "Todos" && yearSelected !== "Todos") { 
                    const getOrdersOfYearSelected = data.filter((d) => d.year === yearSelected)
                    if(getOrdersOfYearSelected.length > 0) { 
                    const getTotalAmountYearFactured = getOrdersOfYearSelected.reduce((acc, el) => acc + el.amount, 0)
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Estadisticas Alquileres</ModalHeader>
              <ModalBody>
           
               
                <div className='flex gap-4 items-center justify-center'>
                    <Select variant={"faded"} label="Selecciona un Mes" className="w-52" value={monthSelected}>          
                        {everyMonths.map((month) => (
                          <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                            {month.label}
                          </SelectItem>
                        ))}
                    </Select>
                    <Select variant={"faded"} label="Selecciona un Año" className="w-52" value={yearSelected}>          
                        {availableYears.map((year) => (
                           <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                              {year.label}
                           </SelectItem>
                        ))}
                    </Select>                          
                </div>

           
          
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