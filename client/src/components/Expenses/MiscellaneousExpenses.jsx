import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {formatePrice, getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions"
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";


const MiscellaneousExpenses = ({updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [expenseName, setExpenseName] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())
  const [actualDate, setActualDate] = useState(getDate())
  const [actualDay, setActualDay] = useState(getDay())
  const [missedData, setMissedData] = useState(false)
  const [succes, setSucces] = useState(false)


  const userCtx = useContext(UserContext)

  const createNewExpense = async () => { 
    if(expenseAmount > 0 && userCtx.userId !== null && expenseName.length > 0) { 
      setMissedData(false)
      const expenseData = ({ 
        amount: expenseAmount,
        loadedByName: userCtx.userName,
        loadedById: userCtx.userId,
        typeOfExpense: "Varios",
        date: actualDate,
        day: actualDay,
        month: actualMonth,
        year: actualYear,
        expenseDetail: [],
        providerName: "",
        providerId: "",
        miscellaneousExpenseName: expenseName
      })
      try {
          const sendData = await axios.post("http://localhost:4000/expenses/addNewExpense", expenseData)
          if(sendData.status === 200) { 
            setSucces(true)
            setTimeout(() => { 
              setSucces(false)
              setExpenseName("")
              setExpenseAmount(0)
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
     <p className="text-zinc-600 font-bold text-sm cursor-pointer" onClick={onOpen}>Crear Gasto Semanal</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Gasto (Varios)</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                 <Input type="text" variant="underlined" label="Nombre del gasto" className="w-full" onChange={(e) => setExpenseName(e.target.value)}/>
                 <Input type="text" variant="underlined" label="Monto Gastado" className="w-full mt-2" onChange={(e) => setExpenseAmount(Number(e.target.value))}/>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-4 gap-4">
                <Button className="bg-green-800 text-white font-medium text-sm" onPress={createNewExpense}>
                  Crear
                </Button>
                <Button className="bg-green-800 text-white font-medium text-sm" onPress={onClose}>
                  Cerrar
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

export default MiscellaneousExpenses
