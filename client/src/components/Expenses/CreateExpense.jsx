import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Input} from "@nextui-org/react";
import axios from "axios"
import { useState, useEffect } from "react";
import {formatePrice, getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions"
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import AddNewFixedType from "./AddNewFixedType";

const CreateExpense = ({updateList, type}) => {
  
   const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
   const [actualDay, setActualDay] = useState(getDay())
   const [actualMonth, setActualMonth] = useState(getMonth())
   const [actualYear, setActualYear] = useState(getYear())
   const [actualDate, setActualDate] = useState(getDate())
   const [typesOfExpenses, setTypesOfExpenses] = useState([])
   const [typeExpenseSelected, setTypeExpenseSelected] = useState("")
   const [amount, setAmount] = useState(0)
   const [missedData, setMissedData] = useState(false)
   const [succes, setSucces] = useState(false)
   const userCtx = useContext(UserContext)

   const getTypes = async () => { 
     try {
      const typesOfExpenses = await axios.get("http://localhost:4000/expenses/typeFixed")
      const response = typesOfExpenses.data
      console.log(response)
      setTypesOfExpenses(response)
     } catch (error) {
       console.log(error)
     }
   }

   const handleOpen = async () => { 
    getTypes()
    onOpen()
   }

   const createNewFixedExpense = async () => { 
    if(amount > 0 && userCtx.userId !== null && typeExpenseSelected.length > 0) { 
      setMissedData(false)
      const expenseData = ({ 
        amount: amount,
        loadedByName: userCtx.userName,
        loadedById: userCtx.userId,
        typeOfExpense: "Gasto Fijo",
        date: actualDate,
        day: actualDay,
        month: actualMonth,
        year: actualYear,
        expenseDetail: [],
        providerName: "",
        providerId: "",
        fixedExpenseType: typeExpenseSelected
  
      })
      try {
          const sendData = await axios.post("http://localhost:4000/expenses/addNewExpense", expenseData)
          if(sendData.status === 200) { 
            setSucces(true)
            setTimeout(() => { 
              setSucces(false)
              setTypeExpenseSelected("")
              setAmount(0)
              onClose()
              updateList()
            }, 2000)
          }
      } catch (error) {
          console.log(error)
      } 
    } else { 
      setMissedData(true)
      setTimeout(() => { 
        setMissedData(false)
      }, 2000)
    }
   
   }
 



  return (
    <>
     {type === "withOut" ? 
       <Button className='bg-green-800 text-white font-medium text-sm cursor-pointer' onClick={handleOpen}>Crear Nuevo Gasto Fijo</Button>
       :
      <p className="text-zinc-600 font-bold text-sm cursor-pointer" onClick={handleOpen}>Crear Gasto Fijo</p>   }
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Gasto Fijo</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
               <AddNewFixedType updateSelectData={getTypes}/>
                <Select variant={"faded"} label="Selecciona el Gasto" className="w-72" value={typeExpenseSelected}>          
                      {typesOfExpenses.map((typeExpense) => (
                        <SelectItem key={typeExpense.name} value={typeExpense.name} textValue={typeExpense.name} onClick={() => setTypeExpenseSelected(typeExpense.name)}>
                          {typeExpense.name}
                      </SelectItem>
                      ))}
                  </Select>
                  <Input type="text" variant="underlined" className="w-72" value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }/>
               
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-6">
                <Button className="bg-green-800 text-white text-sm font-medium w-52"  onClick={() => createNewFixedExpense()}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 text-white text-sm font-medium w-52"  onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>

              {succes ?
              <div className="mt-4 mb-2 flex items-center justify-center">
                   <p className="font-medium text-sm text-green-800">Gasto almacenado con Exito ✔</p>
              </div> : null}

              
              {missedData ?
              <div className="mt-4 mb-2 flex items-center justify-center">
                   <p className="font-medium text-sm text-green-800">Faltan datos para almacenar el Gasto</p>
              </div> : null}

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateExpense