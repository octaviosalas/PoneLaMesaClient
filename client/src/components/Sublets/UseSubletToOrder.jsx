import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import { getEveryOrders, everyYears, months, getYear, getMonth } from "../../functions/gralFunctions";
import UseSubletToOrderSecondStep from "./UseSubletToOrderSecondStep";

const UseSubletToOrder = ({subletData, update}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [orders, setOrders] = useState([])
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [monthSelected, setMonthSelected] = useState(() => getMonth());
  const [yearSelected, setYearSelected] = useState(() => getYear());
  const [orderNumberSelected, setOrderNumberSelected] = useState(null);
  const [missedData, setMissedData] = useState(false);
  const [orderDoesNotExist, setOrderDoesNotExist] = useState(false);
  const [secondStep, setSecondStep] = useState(false);
  const [orderChoosenData, setOrderChoosenData] = useState(false);
  const [orderChoosenStatus, setOrderChoosenStatus] = useState("");
  const [errorNumber, setErrorNumber] = useState("");
  const [year, setYear] = useState(() => getYear());
  const [month, setMonth] = useState(() => getMonth());

 


    const handleOpen = async () => { 
      onOpen()
      const data = await getEveryOrders()
      setOrders(data)
      console.log(subletData)
      console.log("year selected", yearSelected)

    }

    const getOrderData = async () => { 
      console.log(yearSelected)
      console.log(typeof yearSelected)

      console.log(monthSelected)
      console.log(typeof monthSelected)

      console.log(orderNumberSelected)
      console.log(typeof orderNumberSelected)


        if(yearSelected !== null && monthSelected !== null && orderNumberSelected !== null && errorNumber !== true) { 
          const filteredOrders = orders.filter((ord) => ord.month === monthSelected && ord.year === yearSelected && ord.orderNumber === orderNumberSelected)
          if(filteredOrders.length > 0) { 
            setOrderChoosenData(filteredOrders)
            setOrderChoosenStatus(filteredOrders.map((ord) => ord.orderStatus)[0])
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

    const comeBackToFirstStep = () => { 
      setSecondStep(false)
    }

    const preventMinus = (e) => {
      if (e.key === '-') {
        e.preventDefault();
      }
   };
  


 
 



  return (
    <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Derivar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Utilizar SubAlquiler</ModalHeader>
                {subletData.used === true ? 
                  <div className="flex flex-col items-center justify-center m-4">
                      <p className="font-medium text-white bg-green-800 w-full text-md text-center">Este SubAlquiler ya fue utilizado en una orden</p>
                      <Button className="w-72 mt-6 bg-green-800 text-white font-medium" onPress={onClose}>Volver</Button>
                  </div>
                  :
               <ModalBody className="flex flex-col items-center justify-center">
                {secondStep === false ?
                   <>            
                      <Input type="number" variant="faded" className="w-72 mt-4"  label="Año"  value={yearSelected}  onChange={(e) => setYearSelected(e.target.value)} />                         
               
                      <Select variant="faded" label="Selecciona un mes" className="w-72" value={monthSelected} defaultSelectedKeys={[monthSelected]}>          
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
                        onKeyPress={preventMinus}
                        value={orderNumberSelected}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (value > 0 && !isNaN(value)) ) {
                            setOrderNumberSelected(parseInt(value));
                            setErrorNumber(false)
                          } else {
                            setErrorNumber(true)
                          }
                         }} 
                       />  

                       {errorNumber ? <p className="text-green-800 font-medium text-xs mt-1">Debes ingresar un numero Valido</p> : null}
                        
                        {orderDoesNotExist ?
                          <div className="flex items-center justify-center mt-8">
                            <p className=" text-green-800 font-medium  text-sm">El numero de orden no existe</p> 
                          </div>  
                        : null}

                      <div className="flex item-center justify-center mt-6 mb-6">
                            <Button className="w-50 bg-green-800 text-white font-medium" onClick={() => getOrderData()}>Obtener Orden</Button>
                      </div> 
                    </>     
                    
                  
                   :
                 null}

                 {secondStep ? 
                   <UseSubletToOrderSecondStep orderData={orderChoosenData} orderDataStatus={orderChoosenStatus} dataSublet={subletData} comeBack={comeBackToFirstStep} closeModalNow={onClose} update={update}/>
                 : null}

               </ModalBody>}
               
            
              

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