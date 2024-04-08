import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import { months, typeOfClientsAvailables, diferentOrdersStatus, paidOrNotPaid } from "../../functions/gralFunctions";

const FilterExpenses = ({applyMonthFilter, isFilterApplied, getAllDataAgain}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [filterByMonthSetp, setFilterByMonthSetp] = useState(false)
    const [monthSelected, setMonthSelected] = useState("")
    const [missedFilter, setMissedFilter] = useState(false)

    const handleOpen = () => {
        getAllDataAgain();
        onOpen();
        isFilterApplied(false)
      }

      const handleClose = () => {
        getAllDataAgain();
        onClose();
        setFilterByMonthSetp(false)
      }

    const applyFilterByMonthSelected = () => { 
        applyMonthFilter(monthSelected)
        onClose()
        isFilterApplied(true)
        setFilterByMonthSetp(false)
      
        setMonthSelected("")
      }

      const chooseMonthFilters = () => { 
        setFilterByMonthSetp(true)
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
                <p className="text-sm 2xl:text-lg font-bold text-zinc-600">Filtrar Ordenes</p> 
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center">
                   <div className="bg-green-500 w-full h-11 flex items-center cursor-pointer" onClick={() => chooseMonthFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Mes</p>
                   </div>
                   {/*<div className="bg-green-600 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => chooseClientFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Tipo de Cliente</p>
                   </div>
                   <div className="bg-green-700 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => chooseOrderStatusFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Estado de Pedido</p>
                   </div>
                   <div className="bg-green-800 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => chooseOrderPaidOrNoPaidFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Abonado o No Abonado</p>
          </div> */}
                </div>

                <div className="mt-4 flex flex-col items-center justify-center">
                    {filterByMonthSetp ? 
                    <div>
                          <Select variant={"faded"} label="Selecciona un mes" className="w-72">          
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value} onClick={() => setMonthSelected(month.value)}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </Select>
                    </div>
                    : null}                
                </div>


              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-2 gap-4">
              <Button
                  className="font-bold text-white bg-green-800"
                  onClick={() => (
                  monthSelected !== "" ? applyFilterByMonthSelected() :
                  invalidFilters())
                  }
                  >
                  Aplicar
                </Button>      
                <Button  className="font-bold text-white bg-green-700" onPress={handleClose}>Cerrar</Button>              
              </ModalFooter>
              {missedFilter ? 
              <div className="flex items-center justify-center mt-4 mb-4">
                <p className="font-bold text-sm text-green-700">Debes Seleccionar un filtro para poder aplicarlo</p>
              </div>
              : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default FilterExpenses
