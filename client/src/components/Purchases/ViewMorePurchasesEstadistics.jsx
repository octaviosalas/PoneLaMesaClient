import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth, getEveryPurchases } from '../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import viewMore from "../../images/viewMore.png"
import arrowDown from "../../images/arrowDown.png"


const ViewMorePurchasesEstadistics = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [monthSelected, setMonthSelected] = useState("Todos")
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [yearSelected, setYearSelected] = useState(getYear())
  const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
  const [withOutPurchases, setWithOutPurchases] = useState(false)
  const [allPurchases, setAllPurchases] = useState([])


  useEffect(() => {
      const fetchData = async () => {
        try {
          const purchasesData = await getEveryPurchases();
          console.log(purchasesData)
          if(monthSelected === "Todos" && yearSelected === "Todos") { 
            if(purchasesData.length !== 0) { 
              setAllPurchases(purchasesData);
              setWithOutPurchases(false)
            } else { 
              setWithOutPurchases(true)
            }
    

          } else if (yearSelected !== "Todos" && monthSelected !== "Todos") { 
            const filterDataByMonthAndYearSelected = purchasesData.filter((purch) => purch.month === monthSelected && purch.year === yearSelected)
            if(filterDataByMonthAndYearSelected.length !== 0) { 
                setAllPurchases(filterDataByMonthAndYearSelected);
                setWithOutPurchases(false)
            } else { 
              setWithOutPurchases(true)
            }     

          } else if (yearSelected !== "Todos" && monthSelected === "Todos") { 
            const filterDataByYear = purchasesData.filter((purch) => purch.year === yearSelected)
            if(filterDataByYear.length !== 0) { 
              setAllPurchases(filterDataByYear);
              setWithOutPurchases(false)
            } else { 
              setWithOutPurchases(true)
            }      

          } else if (yearSelected === "Todos" && monthSelected !== "Todos") { 
            const filterDataByMonth = purchasesData.filter((purch) => purch.month === monthSelected)
            if(filterDataByMonth.length !== 0) { 
              setAllPurchases(filterDataByMonth);
              setWithOutPurchases(false)
            } else { 
              setWithOutPurchases(true)
            }      
          }


        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchData();
    }, [monthSelected, yearSelected]); 

    useEffect(() => { 
      console.log(allPurchases)
    }, [])


  return (
    <>
      <img onClick={onOpen} src={viewMore} className="h-7 w-7 cursor-pointer mr-4"/>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Estadisticas de Compras</ModalHeader>
              <ModalBody>
              <div>
        <Card>
            <CardHeader className='flex flex-col items-top justify-between'>
            
              <div className='flex gap-4'>
                  <Dropdown>
                        <DropdownTrigger>
                            <div className="flex items-center gap-1">
                                <p className='text-black cursor-pointer font-medium text-md'>Elegir Mes </p>
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
                                <p className='text-black cursor-pointer font-medium text-md'>Elegir Año </p>
                                <img src={arrowDown} className='h-3 w-2 mt-1'/>
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...availableYears]}>
                            {(item) => (
                               <DropdownItem key={item.value} onClick={() => setYearSelected(item.label)}>
                                {item.label}
                            </DropdownItem>
                            )}
                        </DropdownMenu>
                  </Dropdown>
              </div>
              <div className='flex flex-col justify-start items-start mt-4'>
                <p className='font-medium text-sm text-zinc-600'> Mes Elegido: <b>{monthSelected}</b></p>
                <p className='font-medium text-sm text-zinc-600'> Año Elegido: <b>{yearSelected}</b></p>
              </div>

            </CardHeader>
            {withOutPurchases ? 
              <CardBody>
                <p>No hay compras</p>
              </CardBody>
              :
              <CardBody>
                    <p className='font-medium text-sm text-green-800 mt-2'>Cantidad de Compras: <b className='font-medium text-zinc-600'>{allPurchases.length} compras</b></p>
                    <p className='font-medium text-sm text-green-800 mt-1'>Monto Gastado:<b className='font-medium text-zinc-600'> {formatePrice(allPurchases.reduce((acc, el) => acc + el.total, 0))}</b> </p>
              </CardBody>
            }          
        </Card>
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


export default ViewMorePurchasesEstadistics