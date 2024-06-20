import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import {getDay, getMonth, getDate, getYear, shiftsSchedules, everyMonthsOfTheYear} from "../../functions/gralFunctions"
import CleaningBreakups from "./CleaningBreakups";

const MarkWashedArticlesAsFinished = ({washedData, updateNumbers}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [newQuantity, setNewQuantity] = useState(0)
  const [succesUpdate, setSuccesUpdate] = useState(false)
  const [errorInQuantity, setErrorInQuantity] = useState(false)
  const [missedData, setMissedData] = useState(false)
  const [actualDay, setActualDay] = useState(getDay())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())
  const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
  const [actualDate, setActualDate] = useState(getDate())
  const [shiftChoosen, setShiftChoosen] = useState("")
  const [shiftChoosenDay, setShiftChoosenDay] = useState(getDay())
  const [shiftChoosenMonth, setShiftChoosenMonth] = useState(() => getMonth());
  const [shiftChoosenYear, setShiftChoosenYear] = useState(getYear())
  const [secondStep, setSecondStep] = useState(false)
  const [yearError, setYearError] = useState(false)
  const [productEstimatedTime, setProductEstimatedTime] = useState(0)
  const [size, setSize] = useState("3xl")
  const [initialQuantity, setInitialQuantity] = useState(washedData.quantity); // Ejemplo de cantidad inicial
  const [brokenArticles, setBrokenArticles] = useState(0); // Ejemplo de cantidad inicial


  const getTimeEstimatedWashedd = () => { 
 
    axios.get(`http://localhost:4000/products/${washedData.productId}`)
         .then((res) => { 
          console.log(res.data)
          setProductEstimatedTime(res.data.estimatedWashTime)
         })
         .catch((err) => { 
          console.log(err)
         })
     }

      const handleOpen =  () => { 
        console.log(washedData)
        console.log(washedData.productId)
        getTimeEstimatedWashedd()
        onOpen()
      }

      const verifyData = () => { 
        if(newQuantity === 0) { 
          setMissedData(true)
        } else { 
          setSecondStep(true)
          setMissedData(false)
        }
      }


  const updateArticleStock = async () => { 

    const formatedNewQuantity = Number(newQuantity)
    const formatedDay = Number(shiftChoosenDay)
    console.log(shiftChoosenMonth.length)
    console.log(formatedDay)
    if(formatedNewQuantity !== 0 && errorInQuantity !== true && formatedDay > 0 && shiftChoosenMonth.length > 0 && yearError !== true) { 

      const quantityToBeUpdated = ({ 
        newQuantity: washedData.quantity - newQuantity - brokenArticles , //por este valor se setea a la nueva cantidad del backend
        quantity: Number(newQuantity),
        productId: washedData.productId
       });

      const replenishData = ({ 
        day: formatedDay,
        month: shiftChoosenMonth,
        year: Number(shiftChoosenYear),
        date: actualDate,
        shift: shiftChoosen,
        replenishDetail: [{productName: washedData.productName, productPrice: washedData.productPrice, productId: washedData.productId, quantity: formatedNewQuantity, estimatedWashTime: productEstimatedTime}]
      }) 

     
  
      try {
          const updateStockAndUpdateCleaningQuantity = await axios.put(`http://localhost:4000/cleaning/updateQuantity/${washedData.productId}`, quantityToBeUpdated)
          console.log(updateStockAndUpdateCleaningQuantity)
          if(updateStockAndUpdateCleaningQuantity.status === 200) { 
            const saveReplenishData = await axios.post("http://localhost:4000/replenishment", replenishData)
            console.log(saveReplenishData.data)
            console.log(saveReplenishData.status)
              if(saveReplenishData.status === 200) { 
                setSuccesUpdate(true)
                setTimeout(() => { 
                  updateNumbers()
                  setSuccesUpdate(false)
                  setNewQuantity(0)
                  onClose()
                }, 2000)
              }
          }
         
       } catch (error) {
        console.log(error)
       } 
    } else { 
      setMissedData(true)
      setTimeout(() => { 
        setMissedData(false)
      }, 1500)
    } 
  }

  const replaceEveryQuantity = async  () => { 
    setNewQuantity(washedData.quantity)
    setSecondStep(true)
  }

  const updateBreakups = (number) => { 
    console.log(number);
    setInitialQuantity((prevQuantity) => prevQuantity - number);
    setBrokenArticles(number)
  };

  

  return (
    <>
      <p className="text-green-800 text-xs font-medium cursor-pointer" onClick={handleOpen}>Reponer Stock</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="">Reponer {washedData.productName}</ModalHeader>
              <div className="">
              <ModalBody className="flex flex-col items-center justify-center">
              <Input 
                type="text" 
                variant="underlined" 
                label="Cantidad en Lavado" 
                value={initialQuantity - newQuantity} 
                readOnly
              />
              <Input 
                type="number" 
                variant="underlined"  
                label="Cantidad a Reponer"  
                value={newQuantity}  
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value > 0 && !isNaN(value))) {
                    setNewQuantity(Number(value));
                    setErrorInQuantity(false);
                  } else {
                    setErrorInQuantity(true);
                  }
                }} 
              />

                  {secondStep ? 
                  <div className="flex flex-col items-center justify-center mt-0 2xl:mt-1 w-full">
                      <div className="flex justify-center items-center">
                        <p className="text-md font-medium text-zinc-600">Ingresa los datos del turno correspondiente</p>
                      </div>
                      
                      <Input type="number" variant="faded" className="w-72 mt-4"  label="Dia"  value={shiftChoosenDay}  onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (value > 0 && !isNaN(value))) {
                             setShiftChoosenDay(e.target.value);
                             setErrorInQuantity(false)
                            } else {
                              setErrorInQuantity(true)
                            }
                        }} 
                        />
                    
                    <Select variant="faded" label="Mes" className="w-72 mt-2 border border-none"   defaultSelectedKeys={[shiftChoosenMonth]} value={shiftChoosenMonth}>          
                        {everyMonths.map((month) => (
                            <SelectItem key={month.value} value={month.value} textValue={month.value} onClick={() => setShiftChoosenMonth(month.value)}>
                              {month.label}
                            </SelectItem>
                            ))}
                     </Select>

                     <Input
                        type="number"
                        variant="faded"
                        className="w-72 mt-4"
                        label="Año"
                        value={shiftChoosenYear}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (value >= actualYear && !isNaN(value))) {
                              setShiftChoosenYear(e.target.value);
                              setYearError(false);
                            } else {
                              setYearError(true);
                            }
                        }}
                        />

                        {yearError ? <p className="text-xs text-zinc-600 font-medium mt-1">Debes indicar un año valido</p> : null}

                     <Select variant="faded" label="Selecciona el Turno" className="w-72 mt-2 border border-none" value={shiftChoosen}>          
                        {shiftsSchedules.map((shift) => (
                        <SelectItem key={shift.value} value={shift.label} textValue={shift.value} onClick={() => setShiftChoosen(shift.value)}>
                          {shift.label}
                        </SelectItem>
                            ))}
                     </Select>

                   {brokenArticles === 0 ?
                     <div className="w-full flex items-center text-center justify-center mt-2 2xl:mt-4">
                           <CleaningBreakups update={updateBreakups} reference={washedData.quantity - newQuantity}/>
                     </div> : 
                       <div className="flex flex-col w-full items-center text-center justify-center mt-2 2xl:mt-4">
                         <p className=" w-full bg-red-600 text-white font-medium">Se indicaron {brokenArticles} articulos rotos durante el lavado</p>
                      </div>
                     }

                  </div> : null}
              </ModalBody>
              </div>
             

              {errorInQuantity ?
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <p className="text-xs text-zinc-600 font-medium">El numero debe ser mayor a 0</p>
                  </div>  : null} 

                  <div className="flex justify-center gap-6 items-center mt-1 mb-2">
                  {secondStep !== true ?
                    <Button className="bg-green-800 text-white font-medium w-52" onClick={() => replaceEveryQuantity()}>
                      Reponer todos
                    </Button> : null}
                    <Button className="bg-green-800 text-white font-medium w-52" onClick={secondStep ? () => updateArticleStock() : () => verifyData()}>
                      Confirmar
                    </Button>
                    <Button className="bg-green-800 text-white font-medium w-52" onPress={secondStep ? () => setSecondStep(false) : () => onClose(true)}>
                      Cancelar
                    </Button>
                  </div>

              {succesUpdate ?
                <div className="flex flex-col items-center justify-center mt-4 mb-2">
                  <p className="text-sm font-medium text-green-800">Se actualizado la cantidad Correctamente ✔</p>
                </div> : null}
                {missedData ?
                <div className="flex flex-col items-center justify-center mt-4 mb-2">
                  <p className="text-sm font-medium text-green-800">No podes actualizar por un numero igual a 0</p>
                </div> : null}

                
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MarkWashedArticlesAsFinished
