import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import { months, typeOfClientsAvailables, diferentOrdersStatus, paidOrNotPaid } from "../../functions/gralFunctions";


const FiltersOrdersTable = ({applyMonthFilter, applyDateFilter, isFilterApplied, getAllDataAgain, applyClientFilter, applyOrderStatusFilter, applyFiltersByPaidOrNoPaid}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [filterByMonthSetp, setFilterByMonthSetp] = useState(false)
  const [filterByDate, setFilterByDate] = useState(false)
  const [filterByTypeOfClientStep, setFilterByTypeOfClientStep] = useState(false)
  const [filterByOrderStatusStep, setFilterByOrderStatusStep] = useState(false)
  const [filterByOrderPaid, setFilterByOrderPaid] = useState(false)
  const [monthSelected, setMonthSelected] = useState("")
  const [typeOfClientSelected, setTypeOfClientSelected] = useState("")
  const [statusSelected, setStatusSelected] = useState("")
  const [paidOrNoPaidSelected, setPaidOrNoPaidSelected] = useState("")
  const [missedFilter, setMissedFilter] = useState(false)
  const [firstDate, setFirstDate] = useState("")
  const [secondDate, setSecondDate] = useState("")


  const applyFilterByMonthSelected = () => { 
    applyMonthFilter(monthSelected)
    onClose()
    isFilterApplied(true)
    setFilterByMonthSetp(false)
    setFilterByOrderStatusStep(false)
    setFilterByOrderStatusStep(false)
    setFilterByDate(false)
    setMonthSelected("")
  }
  
  const applyFilterByDatesSelected = () => { 
    applyDateFilter(firstDate, secondDate)
    onClose()
    isFilterApplied(true)
    setFilterByMonthSetp(false)
    setFilterByOrderStatusStep(false)
    setFilterByOrderStatusStep(false)
    setFilterByDate(false)
    setFirstDate("")
    setSecondDate("")
  }

  const applyFilterByTypeOfClientSelected = () => { 
    applyClientFilter(typeOfClientSelected)
    onClose()
    isFilterApplied(true)
    setFilterByMonthSetp(false)
    setFilterByOrderStatusStep(false)
    setFilterByDate(false)
    setFilterByOrderStatusStep(false)
    setTypeOfClientSelected("")
  }

  const applyFilterByStatusOfTheOrder = () => { 
    applyOrderStatusFilter(statusSelected)
    onClose()
    isFilterApplied(true)
    setFilterByDate(false)
    setFilterByMonthSetp(false)
    setFilterByOrderStatusStep(false)
    setStatusSelected("")
  }

  const applyFilterByPaid = () => { 
    applyFiltersByPaidOrNoPaid(paidOrNoPaidSelected)
    onClose()
    isFilterApplied(true)
    setFilterByMonthSetp(false)
    setFilterByTypeOfClientStep(false)
    setFilterByOrderStatusStep(false)
    setFilterByDate(false)
    setStatusSelected("")
  }

  const handleOpen = () => {
    getAllDataAgain();
    onOpen();
    isFilterApplied(false)
  }

  const handleClose = () => {
    onClose();
    setFilterByMonthSetp(false)
    setFilterByOrderStatusStep(false)
    setFilterByOrderStatusStep(false)
  }

  const chooseMonthFilters = () => { 
    setFilterByMonthSetp(true)
    setFilterByTypeOfClientStep(false)
    setFilterByOrderStatusStep(false)
    setFilterByOrderPaid(false)
    setFilterByDate(false)
  }

  const chooseOrderByDate = () => { 
    setFilterByMonthSetp(false)
    setFilterByTypeOfClientStep(false)
    setFilterByOrderStatusStep(false)
    setFilterByOrderPaid(false)
    setFilterByDate(true)
    
  }

  const chooseClientFilters = () => { 
    setFilterByMonthSetp(false)
    setFilterByTypeOfClientStep(true)
    setFilterByOrderStatusStep(false)
    setFilterByOrderPaid(false)
    setFilterByDate(false)

  }

  const chooseOrderStatusFilters = () => { 
    setFilterByMonthSetp(false)
    setFilterByTypeOfClientStep(false)
    setFilterByOrderStatusStep(true)
    setFilterByOrderPaid(false)
    setFilterByDate(false)


  }

  const chooseOrderPaidOrNoPaidFilters = () => { 
    setFilterByMonthSetp(false)
    setFilterByTypeOfClientStep(false)
    setFilterByOrderStatusStep(false)
    setFilterByOrderPaid(true)
    setFilterByDate(false)

  }


  const invalidFilters = () => { 
    setMissedFilter(true)
    setTimeout(() => { 
      setMissedFilter(false)
    }, 1700)
  }

  function obtenerNombreMes(mes) {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[mes];
  }

  const handleDateChange = (e) => {
    setFirstDate(e.target.value);
    const fechaObj = new Date(e.target.value);
    const dia = fechaObj.getDate();
    const mes = obtenerNombreMes(fechaObj.getMonth());
    const anio = fechaObj.getFullYear();
    console.log(`mes: ${mes}`);
    console.log(`año: ${anio}`);
    console.log(`dia: ${dia}`);
  };

  const handleSecondDateChange = (e) => {
      setSecondDate(e.target.value);
      const fechaObj = new Date(e.target.value);
      const dia = fechaObj.getDate();
      const mes = obtenerNombreMes(fechaObj.getMonth());
      const anio = fechaObj.getFullYear();
      console.log(`mes: ${mes}`);
      console.log(`año: ${anio}`);
      console.log(`dia: ${dia}`);
  };

  const openModalNow = () => { 
    console.log("abrir")
    onOpen()
  }


  return (
    <>
     
         <svg  onClick={openModalNow} className="w-6 h-6 ml-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
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
                   <div className="bg-green-900 w-full h-11 flex items-center cursor-pointer" onClick={() => chooseMonthFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Mes</p>
                   </div>
                   <div className="bg-green-900 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => chooseOrderByDate()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Fecha</p>
                   </div>
                   <div className="bg-green-900 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => chooseClientFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Tipo de Cliente</p>
                   </div>
                   <div className="bg-green-900 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => chooseOrderStatusFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Estado de Pedido</p>
                   </div>
                   <div className="bg-green-900 w-full h-11 mt-2 flex items-center cursor-pointer" onClick={() => chooseOrderPaidOrNoPaidFilters()}>
                        <p className="font-bold text-white text-sm ml-4">Filtrar Por Abonado o No Abonado</p>
                   </div>
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

                  {filterByDate ? 
                      <div>
                          <div>
                            <Input className="w-96" type="date" label="Desde" onChange={handleDateChange}   classNames={{label: "-mt-5"}}/>
                            <Input className="w-96" type="date" label="Hasta" onChange={handleSecondDateChange}   classNames={{label: "-mt-5"}}/>
                          </div>
                      </div>
                      : null}

                    {filterByTypeOfClientStep ? 
                    <div>
                          <Select variant={"faded"} label="Selecciona un tipo de Cliente" className="w-72">          
                          {typeOfClientsAvailables.map((client) => (
                            <SelectItem key={client.value} value={client.value} onClick={() => setTypeOfClientSelected(client.value)}>
                              {client.label}
                            </SelectItem>
                          ))}
                        </Select>
                    </div>
                    : null}
            
                    {filterByOrderStatusStep ? 
                      <div>
                            <Select variant={"faded"} label="Selecciona un estado de Orden" className="w-72">          
                            {diferentOrdersStatus.map((order) => (
                              <SelectItem key={order.value} value={order.value} onClick={() => setStatusSelected(order.value)}>
                                {order.label}
                              </SelectItem>
                            ))}
                          </Select>
                      </div>
                      : null} 

                    {filterByOrderPaid ? 
                      <div>
                          <Select variant={"faded"} label="Selecciona por pago" className="w-72">          
                            {paidOrNotPaid.map((order) => (
                              <SelectItem key={order.value} value={order.value} onClick={() => setPaidOrNoPaidSelected(order.value)}>
                                {order.label}
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
                  firstDate !== "" && secondDate !== "" ? applyFilterByDatesSelected() : 
                  typeOfClientSelected !== "" ? applyFilterByTypeOfClientSelected() : 
                  statusSelected !== "" ? applyFilterByStatusOfTheOrder() : 
                  paidOrNoPaidSelected !== "" ? applyFilterByPaid() : 
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
  );
}

export default FiltersOrdersTable