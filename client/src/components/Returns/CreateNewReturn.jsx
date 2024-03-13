import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import { getEveryOrders, everyYears, months } from "../../functions/gralFunctions";
import UseSubletToOrderSecondStep from "../Sublets/UseSubletToOrderSecondStep";
import CreateNewReturnSecondStep from "./CreateNewReturnSecondStep";

const CreateNewReturn = () => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [orders, setOrders] = useState([])
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [monthSelected, setMonthSelected] = useState("");
  const [yearSelected, setYearSelected] = useState(null);
  const [orderNumberSelected, setOrderNumberSelected] = useState(null);
  const [missedData, setMissedData] = useState(false);
  const [orderDoesNotExist, setOrderDoesNotExist] = useState(false);
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondStep] = useState(false);
  const [orderChoosenData, setOrderChoosenData] = useState(false);
  const [orderChoosenStatus, setOrderChoosenStatus] = useState("");

    useEffect(() => { 
        console.log(orderChoosenStatus)
    }, [orderChoosenStatus])


    const handleOpen = async () => { 
      onOpen()
      const data = await getEveryOrders()
      setOrders(data)
    }

    const getOrderData = async () => { 
    
        if(yearSelected !== null && monthSelected !== null && orderNumberSelected !== null) { 
          const filteredOrders = orders.filter((ord) => ord.month === monthSelected && ord.year === yearSelected && ord.orderNumber === orderNumberSelected)
          if(filteredOrders.length > 0) { 
            console.log(filteredOrders)
            setOrderChoosenData(filteredOrders)
            setOrderChoosenStatus(filteredOrders.map((ord) => ord.orderStatus)[0])
            setYearSelected("")
            setMonthSelected("")
            setOrderNumberSelected("")
            setSecondStep(true)
            setFirstStep(false)
          } else { 
            setOrderDoesNotExist(true)
            console.log(filteredOrders)
            setTimeout(() => { 
              setOrderDoesNotExist(false)
            }, 1500)
          }      
        } else { 
        setMissedData(true)
        setTimeout(() => { 
          setMissedData(false)
        }, 1900)
        }
    }

    const comeBackToFirstStep = () => { 
      setSecondStep(false)
    }




  return (
    <>
      <Button onPress={handleOpen} className="text-white font-medium text-sm cursor-pointer bg-green-800">Asentar Nueva Devolucion</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Asentar Devolucion</ModalHeader>              
               <ModalBody className="flex flex-col items-center justify-center">
   
                  {firstStep ?
                    <>            
                      <Select variant={"faded"} label="Selecciona un año" className="w-72" value={yearSelected}>          
                            {years.map((year) => (
                              <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                {year.label}
                              </SelectItem>
                            ))}
                      </Select>
               
                      <Select variant={"faded"} label="Selecciona un mes" className="w-72" value={monthSelected}>          
                            {everyMonths.map((month) => (
                              <SelectItem key={month.label} value={month.value} onClick={() => setMonthSelected(month.value)}>
                                {month.label}
                              </SelectItem>
                            ))}
                       </Select>
                    
                        <Input 
                        type="number" 
                        label="Numero de orden" 
                        variant="underlined" 
                        className="w-72" 
                        value={orderNumberSelected}
                        onChange={(e) => setOrderNumberSelected(parseInt(e.target.value, 10))}/>
                        
                        {orderDoesNotExist ?
                          <div className="flex items-center justify-center mt-2">
                            <p className=" text-green-800 font-medium  text-sm">La orden seleccionada no existe</p> 
                          </div>  
                        : null}

                      <div className="flex item-center justify-center mt-6 mb-6">
                            <Button className="w-50 bg-green-800 text-white font-medium" onClick={() => getOrderData()}>Obtener Orden</Button>
                      </div> 
                    </> : null }   
                    
                  
                  

                 {secondStep ? 
                   <CreateNewReturnSecondStep orderData={orderChoosenData} orderDataStatus={orderChoosenStatus}  comeBack={comeBackToFirstStep} closeModalNow={onClose}/>
                 : null}

               </ModalBody>
               
            
              

               {missedData ?
               <div className="flex items-center justify-center mt-6 mb-4">
                   <p className="text-green-800 font-medium text-sm">Debes completar todos los campos para obtener la orden</p> 
               </div>: null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default CreateNewReturn