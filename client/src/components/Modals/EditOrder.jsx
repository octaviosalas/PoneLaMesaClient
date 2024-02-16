import React, { useState, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";

import axios from "axios";

const EditOrder = ({type, updateList, orderData}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState("Selecciona un Estado ↓")
  const [successMessage, setSuccesMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)


  const closeModal = () => { 
    onClose()
    setStep(0)
  }

  const changeOrderState = () => { 
    if(status === "Selecciona un Estado ↓") { 
      setErrorMessage(true)
      setTimeout(() => { 
        setErrorMessage(false)
      }, 1500)
    } else { 
      const newStatus = status
      axios.put(`http://localhost:4000/orders/changeOrderState/${orderData.id}`,  { newStatus })
           .then((res) => { 
            console.log(res.data)
            updateList()
            setSuccesMessage(true)
            setTimeout(() => { 
              setSuccesMessage(false)
              onClose()
              setStep(0)
              setStatus("Selecciona un Estado ↓")
            }, 2500)
           })
           .catch((err) => { 
            console.log(err)
           })
    }
  }

  const comeBackToFirstStep = () => { 
    setStep(0)
  }


  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Editar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "orders" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Pedido </p>
                  {step === 0 ? 
                    <div>
                      <p className="text-xs font-medium mt-2">Pedido numero: {orderData.order}</p>
                      <p className="text-xs font-medium ">Mes: {orderData.month}</p>
                      <p className="text-xs font-medium ">Cliente: {orderData.client}</p>
                    </div>
                  : null}
                  
                </ModalHeader>
                <ModalBody>
                  {step === 0 ?
                  <div className="flex gap-4 items-center justify-center">
                      <Button className="font-bold text-white text-xs bg-green-600 w-52">Modificar Valores</Button>
                      <Button className="font-bold text-white text-xs bg-green-600 w-52" onClick={() => setStep(1)}>Cambiar Estado</Button>
                      <Button className="font-bold text-white text-xs bg-green-600 w-52">Adjuntar Articulos a Reponer</Button>
                  </div>
                  : null}

                  {step === 1 ? 
                    <div className="flex flex-col items-center justify-center mb-4">
                      <div>
                        <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">                       
                            <SelectItem key={"No Entregado"} value={"No Entregado"} onClick={() => setStatus("No Entregado")}>No Entregado</SelectItem>
                            <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setStatus("Entregado")} >Entregado</SelectItem>
                            <SelectItem key={"Devuelto"} value={"Devueltoo"} onClick={() => setStatus("Devuelto")} >Devuelto</SelectItem>
                            <SelectItem key={"Suspendido"} value={"Suspendido"} onClick={() => setStatus("Suspendido")} >Suspendido</SelectItem>
                        </Select>                    
                      </div>
                      <div className="flex gap-6 items-center mt-6">
                        <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => changeOrderState()}>Confirmar</Button>
                        <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => closeModal()}>Cancelar</Button>
                        <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() =>  setStep(0)}>Volver</Button>
                      </div>
                    {successMessage ?
                      <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-4">
                        <p className="font-medium text-sm text-green-600">Estado de orden Modificado con Exito ✔</p>
                      </div> :
                      null}

                    {errorMessage ?
                      <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-4">
                        <p className="font-medium text-sm text-green-600">Debes seleccionar un estado</p>
                      </div> :
                      null} 
                    
                    </div>
                    : null}
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>
    </>
  );
}

export default EditOrder