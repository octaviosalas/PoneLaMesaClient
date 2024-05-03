import React from "react";
import { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem} from "@nextui-org/react";
import { months, everyYears } from "../../functions/gralFunctions";

const FiltersPurchases = ({applyFilters, isFilterApplied}) => { 
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [monthSelected, setMonthSelected] = useState("");
    const [yearSelected, setYearSelected] = useState("");
    const [years, setYears] = useState(everyYears)
    const [everyMonths, setEveryMonths] = useState(months)
    const [missedData, setMissedData] = useState("");

    const applyFilterNow = () => { 
      if(yearSelected !== "" && monthSelected !== "") { 
          applyFilters(yearSelected, monthSelected)
          isFilterApplied(true)
          onClose()
          setYearSelected("")
          setMonthSelected("")
      } else { 
          setMissedData(true)
          setTimeout(() => { 
              setMissedData(false)
              setYearSelected("")
              setMonthSelected("")
          }, 2000)
      }
    
    }

    return (
      <>
         <svg  onClick={onOpen} className="w-6 h-6 ml-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
         </svg>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Filtrar Inversiones</ModalHeader>
                <ModalBody>
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
                  </div>                             
                </ModalBody>
                <ModalFooter className="flex gap-4 items-center justify-center">
                    <Button className="bg-green-800 text-white font-medium text-sm w-64" onClick={()=> applyFilterNow()}>
                      Aplicar
                    </Button>
                    <Button className="bg-green-800 text-white font-medium text-sm w-64" onPress={onClose}>
                      Cancelar
                    </Button>
                </ModalFooter>

                  {missedData ?
                  <div className="flex mt-4 mb-4 items-center justify-center">
                    <p className="text-green-800 font-medium text-sm mt-3 mb-2">Debes elegir el año y el mes que deseas filtrar</p> 
                  </div> : null}
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
}

export default FiltersPurchases

/* 
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

*/