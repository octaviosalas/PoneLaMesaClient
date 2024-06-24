import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import { getEveryOrders, everyYears, months } from "../../functions/gralFunctions";
import UseSubletToOrderSecondStep from "../Sublets/UseSubletToOrderSecondStep";
import CreateNewReturnSecondStep from "./CreateNewReturnSecondStep";
import arrowLeft from "../../images/arrowLeft.png"
import {getDay, getMonth, getDate, getYear, shiftsSchedules, everyMonthsOfTheYear} from "../../functions/gralFunctions"

const CreateNewReturn = ({updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [orders, setOrders] = useState([])
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [monthSelected, setMonthSelected] = useState(() => getMonth());
  const [yearSelected, setYearSelected] = useState(() => getYear());
  const [orderNumberSelected, setOrderNumberSelected] = useState(null);
  const [missedData, setMissedData] = useState(false);
  const [orderDoesNotExist, setOrderDoesNotExist] = useState(false);
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondStep] = useState(false);
  const [orderChoosenData, setOrderChoosenData] = useState(false);
  const [orderChoosenStatus, setOrderChoosenStatus] = useState("");
  const [size, setSize] = useState("2xl");
  const [actualYear, setActualYear] = useState(() => getYear());
  const [actualMonth, setActualMonth] = useState(() => getMonth());


    const handleOpen = async () => { 
      onOpen()
      const data = await getEveryOrders()
      setOrders(data)
      console.log("year selected", yearSelected)
    }

    const getOrderData = async () => { 
        if(yearSelected !== null && monthSelected !== null && orderNumberSelected !== null) { 
          const filteredOrders = orders.filter((ord) => ord.month === monthSelected && ord.year === Number(yearSelected) && ord.orderNumber === orderNumberSelected)
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
      setFirstStep(true)
      setMonthSelected(getMonth())
      setYearSelected(getYear())
    }

    const closeModalNow = () => { 
      onClose()
      comeBackToFirstStep()
    }

  

  return (
    <>
      <Button onPress={handleOpen} className="text-white font-medium text-sm cursor-pointer bg-green-800">Asentar Nueva Devolucion</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
                <ModalHeader className="flex justify-between items-center gap-1">
                  <p>Asentar Devolucion</p>
                  {<img onClick={() => comeBackToFirstStep()} className="h-6 w-6 mt-4 cursor-pointer" src={arrowLeft}/>}
                </ModalHeader>              
               <ModalBody className="flex flex-col items-center justify-center">               
   
                  {firstStep ?
                    <>           
                        <p className="w-2/4 text-center text-white font-medium bg-green-800 text-md 2xl:text-lg rounded-md">  {monthSelected.charAt(0).toUpperCase() + monthSelected.slice(1)} </p>                  
                        <Input type="number" variant="faded" className="w-72 mt-4"  label="Año"  value={yearSelected}  onChange={(e) => setYearSelected(e.target.value)} 
                        />
               
              

                       <Select variant="faded" label="Mes" className="w-72 mt-2 border border-none"   defaultSelectedKeys={[monthSelected]} value={monthSelected}>          
                        {everyMonths.map((month) => (
                            <SelectItem key={month.value} value={month.value} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
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
                   <CreateNewReturnSecondStep updateList={updateList} orderData={orderChoosenData} orderDataStatus={orderChoosenStatus}  comeBack={comeBackToFirstStep} closeModalNow={closeModalNow} />
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