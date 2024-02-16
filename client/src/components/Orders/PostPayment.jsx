import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice, getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";


const PostPayment = ({orderData}) => {

  const userCtx = useContext(UserContext)
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [account, setAccount] = useState("")
  const [actualDate, setActualDate] = useState(getDate())
  const [day, setDay] = useState(getDay())
  const [month, setMonth] = useState(getMonth())
  const [year, setYear] = useState(getYear())
  const [missedData, setMissedData] = useState(false)
  const [succesChangeState, setSuccesChangeState] = useState(false)
  const [succesCollectionSaved, setSuccesCollectionSaved] = useState(false)
  const [succesOperation, setSuccesOperation] = useState(false)

  const availablesAccounts = [
    {
      label: "Cuenta Nacho",
      value: "Cuenta Nacho"
    },
    {
      label: "Cuenta Felipe",
      value: "Cuenta Felipe"
    },
    {
      label: "Efectivo",
      value: "Efectivo"
    },
  ]

  const addNewCollection = () => { 
    if(account.length !== 0) { 

      const collecctionData = ({ 
        orderId: orderData.id,
        client: orderData.client,
        orderDetail: orderData.detail,
        date: actualDate,
        day: day,
        month: month,
        year: year,
        amount: orderData.total,
        account: account,
        loadedBy: userCtx.userName,

      })

      axios.put(`http://localhost:4000/orders/addPaid/${orderData.id}`)
      .then((res) => { 
       console.log(res.data)
       setSuccesChangeState(true)
      })
      .catch((err) => { 
       console.log(err)
      })

 axios.post("http://localhost:4000/collections/addNewCollection", collecctionData)    
      .then((res) => { 
       console.log(res.data)
       setSuccesCollectionSaved(true)
       setSuccesOperation(true)
       setTimeout(() => { 
        onClose()
        setAccount("")
      }, 1500)
       })
      .catch((err) => { 
       console.log(err)
      })
    } else { 
      setMissedData(true)
      setTimeout(() => { 
        setMissedData(false)
      }, 1500)
    }
    }
  

  const handleClose = () => { 
    onClose()
    setAccount("")
  }

  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Asentar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                 <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">
                    <div>
                        <p className="text-zinc-600 font-bold text-md"> Asentar cobro del Pedido</p>
                    </div>
                    <div className="flex flex-col text-start justify-start  mt-2">
                       <p className="text-sm font-medium text-black">Cliente: {orderData.client}</p>
                       <p className="text-sm font-medium text-black">Cargado el {orderData.day} de {orderData.month} de {orderData.year}</p>
                       <p className="text-sm font-medium text-black">Monto a cobrar: {formatePrice(orderData.total)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                      <Select variant="faded" label="Selecciona la cuenta de Cobro" className="max-w-xs" onChange={(e) => setAccount(e.target.value)}>
                          {availablesAccounts.map((acc) => (
                            <SelectItem key={acc.value} value={acc.value}>
                              {acc.label}
                            </SelectItem>
                          ))}
                        </Select>
                    </div>
                 </ModalHeader>
              <ModalBody>
               
                
              </ModalBody>
                <ModalFooter className="flex items-center justify-center">
                  {succesOperation ? 
                      <p className="text-green-700 font-medium text-sm">
                        Cobro almacenado con exito ✔
                      </p>
                  :
                  <div className="flex gap-6 items-center justify-center">
                      <Button  className="font-bold text-white text-sm bg-green-600 w-32" onPress={addNewCollection}>
                        Asentar Pago
                      </Button>
                      <Button  className="font-bold text-white text-sm bg-green-600 w-32" onPress={handleClose}>
                        Cancelar
                      </Button>
                  </div>
                 }
                </ModalFooter>
               {missedData ?
                <div className="flex items-center justify-center mt-4 mb-4">
                  <p className="font-medium text-green-600 text-sm">Debes indicar una cuenta</p>
                </div>
                :
                null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default PostPayment