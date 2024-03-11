import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import { getEveryOrders, everyYears, months } from "../../functions/gralFunctions";
import UseSubletToOrderSecondStep from "./UseSubletToOrderSecondStep";

const UseSubletToOrder = ({subletData}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [orders, setOrders] = useState([])
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [monthSelected, setMonthSelected] = useState("");
  const [yearSelected, setYearSelected] = useState(null);
  const [orderNumberSelected, setOrderNumberSelected] = useState(null);
  const [missedData, setMissedData] = useState(false);
  const [orderDoesNotExist, setOrderDoesNotExist] = useState(false);
  const [secondStep, setSecondStep] = useState(false);
  const [orderChoosenData, setOrderChoosenData] = useState(false);
  



  const handleOpen = async () => { 
    onOpen()
    const data = await getEveryOrders()
    setOrders(data)
    console.log(subletData)
  }

    const getOrderData = async () => { 
      console.log(yearSelected)
      console.log(typeof yearSelected)

      console.log(monthSelected)
      console.log(typeof monthSelected)

      console.log(orderNumberSelected)
      console.log(typeof orderNumberSelected)


        if(yearSelected !== null && monthSelected !== null && orderNumberSelected !== null) { 
          const filteredOrders = orders.filter((ord) => ord.month === monthSelected && ord.year === yearSelected && ord.orderNumber === orderNumberSelected)
          if(filteredOrders.length > 0) { 
            console.log(filteredOrders)
            setOrderChoosenData(filteredOrders)
            setYearSelected("")
            setMonthSelected("")
            setOrderNumberSelected("")
            setSecondStep(true)
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




  return (
    <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Derivar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Utilizar SubAlquiler</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                {secondStep === false ?
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
                          <div className="flex items-center justify-center mt-8">
                            <p className=" text-green-800 font-medium  text-sm">No existe</p> 
                          </div>  
                        : null}

                      <div className="flex item-center justify-center mt-6 mb-6">
                            <Button className="w-50 bg-green-800 text-white font-medium" onClick={() => getOrderData()}>Obtener Orden</Button>
                      </div> 
                    </>     
                    
                  
                   :
                 null}

                 {secondStep ? 
                   <UseSubletToOrderSecondStep orderData={orderChoosenData} dataSublet={subletData}/>
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


export default UseSubletToOrder