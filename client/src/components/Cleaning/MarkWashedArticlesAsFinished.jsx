import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import {getDay, getMonth, getDate, getYear, shiftsSchedules, everyMonthsOfTheYear} from "../../functions/gralFunctions"

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
  const [shiftChoosenDay, setShiftChoosenDay] = useState("")
  const [shiftChoosenMonth, setShiftChoosenMonth] = useState("")
  const [shiftChoosenYear, setShiftChoosenYear] = useState(0)
  const [secondStep, setSecondStep] = useState(false)
  const [yearError, setYearError] = useState(false)

  const handleOpen = () => { 
    console.log(washedData)
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
    if(newQuantity !== 0 && errorInQuantity !== true && shiftChoosenDay > 0 && shiftChoosenMonth.length > 0 && yearError !== true) { 
      const quantityToBeUpdated = ({ 
        newQuantity: washedData.quantity - newQuantity,
        quantity: Number(newQuantity),
        productId: washedData.productId
       });

      const replenishData = ( { 
        day: shiftChoosenDay,
        month: shiftChoosenMonth,
        year: Number(shiftChoosenYear),
        date: actualDate,
        shift: shiftChoosen,
        replenishDetail: [{productName: washedData.productName, productId: washedData.productId, quantity: newQuantity}]
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

  

  return (
    <>
      <p className="text-green-800 text-xs font-medium cursor-pointer" onClick={handleOpen}>Reponer Stock</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reponer {washedData.productName}</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                 <Input type="text" variant="underlined" label="Cantidad en Lavado" value={washedData.quantity - newQuantity}/>
                 <Input type="number" variant="underlined"  label="Cantidad a Reponer"  value={newQuantity}  onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (value > 0 && !isNaN(value))) {
                             setNewQuantity(e.target.value);
                             setErrorInQuantity(false)
                            } else {
                              setErrorInQuantity(true)
                            }
                        }} 
                        />

                  {secondStep ? 
                  <div className="flex flex-col items-center justify-center mt-4 w-full">
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
                    
                    <Select variant="faded" label="Mes" className="w-72 mt-2 border border-none" value={shiftChoosenMonth}>          
                        {everyMonths.map((month) => (
                        <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setShiftChoosenMonth(month.value)}>
                          {month.label}
                        </SelectItem>
                            ))}
                     </Select>

                     <Input
                        type="number"
                        variant="faded"
                        className="w-72 mt-4"
                        label="Año"
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

                  </div> : null}

              </ModalBody>

                  <div className="flex items-center justify-center mt-2 mb-2">
                    {errorInQuantity ? <p className="text-xs text-zinc-600 font-medium">El numero debe ser mayor a 0</p> : null} 
                  </div>

              <ModalFooter className="flex gap-6 items-center justify-center">
                <Button className="bg-green-800 text-white font-medium w-52" onClick={secondStep ? () => updateArticleStock() : () => verifyData()}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 text-white font-medium w-52" onPress={secondStep ? () => setSecondStep(false) : () => onClose(true)}>
                  Cancelar
                </Button>



              </ModalFooter>
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
