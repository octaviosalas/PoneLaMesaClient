import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { accounts, everyMonthsOfTheYear, formatePrice, getYear, everyYears, getMonth, getEveryPurchases } from '../../functions/gralFunctions';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem} from "@nextui-org/react";
import viewMore from "../../images/viewMore.png"
import arrowDown from "../../images/arrowDown.png"
import { Card } from '@tremor/react';


const ViewMorePurchasesEstadistics = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [monthSelected, setMonthSelected] = useState("Todos")
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [yearSelected, setYearSelected] = useState(getYear())
  const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
  const [withOutPurchases, setWithOutPurchases] = useState(false)
  const [allPurchases, setAllPurchases] = useState([])
  const [size, setSize] = useState("lg")

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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Estadisticas de Inversiones </ModalHeader>
              <ModalBody>
              <div>
       
            
            <div className='flex items-center justify-center gap-4'>
                    <Select variant={"faded"} label="Selecciona un Mes" className="max-w-full" value={monthSelected}>          
                        {everyMonths.map((month) => (
                          <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                            {month.label}
                          </SelectItem>
                        ))}
                         <SelectItem key="Todos" value="Todos" textValue="Todos" onClick={() => setMonthSelected("Todos")}>
                            Todos
                          </SelectItem>
                    </Select>
                    <Select variant={"faded"} label="Selecciona un Año" className="max-w-full" value={yearSelected}>          
                        {availableYears.map((year) => (
                           <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                              {year.label}
                           </SelectItem>
                        ))}
                   </Select>
                  </div>
            

          
            {withOutPurchases ? 
              <div className='flex items-center justify-center mt-4'>
                <p className='text-sm font-medium text-red-600'>No hay compras</p>   
              </div>
              :
               <div className='flex flex-col items-center justify-center mt-2'> 
                 

                   <Card className="mx-auto h-auto w-[400px] 2xl:[450px] mt-4" decoration="top"  decorationColor="green-800" > 
                        <div className='flex flex-col'>
                              <div className='flex justify-center items-center gap-6'>
                                   <p className='font-medium text-sm text-zinc-600'> Mes Elegido:  <span className='text-green-800'>{monthSelected}</span></p>
                                   <p className='font-medium text-sm text-zinc-600'> Año Elegido: <span className='text-green-800'>{yearSelected}</span></p>
                               </div>
                          </div>
                          <div className='flex justify-between items-center mt-4'>
                             <div className='flex flex-col items-center justify-enter'>
                                 <p className='text-zinc-500 text-xs font-medium'>Cantidad de Inversiones</p>
                                 <p className='font-medium text-2xl text-black'>{allPurchases.length}</p>
                             </div>
                              <div className='flex flex-col items-center justify-enter'>
                                  <p className='text-zinc-500 text-xs font-medium'>Monto Invertido:</p>
                                  <p className='font-medium text-2xl text-black'>{formatePrice(allPurchases.reduce((acc, el) => acc + el.total, 0))}</p>
                              </div>
                          </div>
                 </Card>
                   
               </div>
                   
         
            }          
        
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