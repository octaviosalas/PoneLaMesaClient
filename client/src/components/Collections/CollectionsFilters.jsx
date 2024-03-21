import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import { months, everyYears, typesOfCollections } from "../../functions/gralFunctions";

const CollectionsFilters = ({applyFilters, isFilterApplied, applyFiltersByType}) =>  {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [account, setAccount] = useState("");
  const [typeOfCollection, setTypeOfCollection] = useState("");
  const [monthSelected, setMonthSelected] = useState("");
  const [yearSelected, setYearSelected] = useState("");
  const [missedData, setMissedData] = useState("");
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondStep] = useState(false);
  const [filterByAccount, setFilterByAccount] = useState(false);
  const [filterByTypeOfCollection, setFilterByTypeOfCollection] = useState(false);


  const handleOpen = () => { 
    onOpen()
    console.log("Valor de ACC Selected", account)
    console.log("Valor de Month Selected", monthSelected)
    console.log("Valor de Year Selected", yearSelected)

  }

  const availablesAccounts = [
    {
      label: "Cuenta Nacho",
      value: "Cuenta Nacho"
    },
    {
      label: "Cuenta Felipe",
      value: "Cuenta Felipe"
    },
    {
      label: "Efectivo",
      value: "Efectivo"
    },
  ]

  const applyFilterNow = () => { 
    if(account !== "" && yearSelected !== "" && monthSelected !== "") { 
        applyFilters(yearSelected, monthSelected, account)
        isFilterApplied(true)
        onClose()
        setAccount("")
        setYearSelected("")
        setMonthSelected("")
        setFirstStep(true)
        setSecondStep(false)
        setFilterByAccount(false)
        setFilterByTypeOfCollection(false)
    } else { 
        setMissedData(true)
        console.log("Length de Year Selected", yearSelected.length)
        console.log("Length de month Selected", monthSelected.length)
        console.log("Length de account", account.length)
        setTimeout(() => { 
            setMissedData(false)
            setAccount("")
            setYearSelected("")
            setMonthSelected("")
        }, 2000)
    }
  
  }

  const applyFilterByTypeOfCollection = () => { 
    if(typeOfCollection !== "" && yearSelected !== "" && monthSelected !== "") { 
      applyFiltersByType(yearSelected, monthSelected, typeOfCollection)
      isFilterApplied(true)
      onClose()
      setAccount("")
      setYearSelected("")
      setMonthSelected("")
      setFirstStep(true)
      setSecondStep(false)
      setFilterByAccount(false)
      setFilterByTypeOfCollection(false)
    } else { 
      setMissedData(true)
      console.log("Length de Year Selected", yearSelected.length)
      console.log("Length de month Selected", monthSelected.length)
      console.log("Length de typeofcollection", typeOfCollection.length)
      setTimeout(() => { 
          setMissedData(false)
          setTypeOfCollection("")
          setYearSelected("")
          setMonthSelected("")
      }, 2000)
    }
   
  }

  const changeStep = (byAccount, byType) => { 
    setSecondStep(true)
    setFilterByAccount(byAccount)
    setFilterByTypeOfCollection(byType)
  }

  const comeBack = () => { 
    setFilterByAccount(false)
    setFilterByTypeOfCollection(false)
    setSecondStep(false)
    setFirstStep(true)
  }


  


  return (
    <>
      
      <svg  onClick={handleOpen} className="w-6 h-6 ml-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
         </svg>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
               <ModalHeader className="flex flex-col gap-1">
                  <p className="text-sm 2xl:text-lg font-bold text-zinc-600">Filtrar Cobros</p> 
              </ModalHeader>
              <ModalBody>
              <div className="flex flex-col items-center justify-center">

               {firstStep === true && filterByAccount === false && filterByTypeOfCollection === false ?
                <div className="w-full mb-3">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-green-700 w-full h-11 flex items-center cursor-pointer" onClick={() => changeStep(true, false)}>
                            <p className="font-bold text-white text-sm ml-4">Filtrar Por Cuenta</p>
                      </div>
                      <div className="bg-green-900 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => changeStep(false, true)}>
                            <p className="font-bold text-white text-sm ml-4">Filtrar Por Tipo de Cobro</p>
                      </div>                   
                    </div>
                    <div className="mt-4 mb-2 flex items-center justify-center">
                      <Button className="bg-green-800 font-medium text-white text-sm w-56" onPress={onClose}>Cancelar</Button>
                    </div>
                </div> : null}

                 {secondStep === true &&  filterByAccount === true ?
                  <div className="flex flex-col items-center justify-center">
                      <Select variant={"faded"} label="Selecciona un año" className="max-w-xs" value={yearSelected}>          
                                    {years.map((year) => (
                                      <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                        {year.label}
                                      </SelectItem>
                                    ))}
                              </Select>
                      <Select variant={"faded"} label="Selecciona un mes" className="max-w-xs mt-3" value={monthSelected}>          
                                    {everyMonths.map((month) => (
                                      <SelectItem key={month.label} value={month.value} onClick={() => setMonthSelected(month.value)}>
                                        {month.label}
                                      </SelectItem>
                                    ))}
                        </Select>
                        <Select variant="faded" label="Selecciona la cuenta de cobro" className="max-w-xs mt-3">
                            {availablesAccounts.map((acc) => (
                                <SelectItem key={acc.label} value={acc.value} onClick={() => setAccount(acc.value)}>
                                    {acc.label}
                                </SelectItem>
                            ))}
                          </Select>   
                          <div className="flex gap-4">
                            <Button className="text-white font-medium text-sm bg-green-800 mt-4 mb-2 w-52" onClick={() => applyFilterNow()}>Aplicar Filtros</Button>      
                            <Button className="text-white font-medium text-sm bg-green-800 mt-4 mb-2 w-52" onClick={() => comeBack()}>Volver</Button>  
                           </div>     

                              
                          {missedData ? <p className="text-green-800 font-medium text-sm mt-3 mb-2">Debes completar todos los Requerimientos</p> : null}
                      </div> : null}

                  {secondStep === true &&  filterByTypeOfCollection === true ?
                    <div className="flex flex-col items-center justify-center">
                      <Select variant={"faded"} label="Selecciona un año" className="max-w-xs" value={yearSelected}>          
                                    {years.map((year) => (
                                      <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                        {year.label}
                                      </SelectItem>
                                    ))}
                              </Select>
                      <Select variant={"faded"} label="Selecciona un mes" className="max-w-xs mt-3" value={monthSelected}>          
                                    {everyMonths.map((month) => (
                                      <SelectItem key={month.label} value={month.value} onClick={() => setMonthSelected(month.value)}>
                                        {month.label}
                                      </SelectItem>
                                    ))}
                        </Select>
                        <Select variant="faded" label="Selecciona el tipo de cobro" className="max-w-xs mt-3">
                            {typesOfCollections.map((acc) => (
                                <SelectItem key={acc.label} value={acc.value} onClick={() => setTypeOfCollection(acc.value)}>
                                    {acc.label}
                                </SelectItem>
                            ))}
                          </Select>        

                          <div className="flex gap-4">
                            <Button className="text-white font-medium text-sm bg-green-800 mt-4 mb-2 w-52" onClick={() => applyFilterByTypeOfCollection()}>Aplicar Filtros</Button>      
                            <Button className="text-white font-medium text-sm bg-green-800 mt-4 mb-2 w-52" onClick={() => comeBack()}>Volver</Button>  
                           </div>  

                          {missedData ? <p className="text-green-800 font-medium text-sm mt-3 mb-2">Debes completar todos los Requerimientos</p> : null}
                      </div> : null}

                </div>
              </ModalBody>             
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CollectionsFilters;

/* 
 <svg  onClick={handleOpen} className="w-6 h-6 ml-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
         </svg>
*/