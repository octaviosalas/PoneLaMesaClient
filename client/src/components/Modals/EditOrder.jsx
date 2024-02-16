import React, { useState, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure} from "@nextui-org/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import axios from "axios";

const EditOrder = ({updateList, orderData}) => {
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
      <p onClick={onOpen} className="text-green-700 font-medium text-sm cursor-pointer">Editar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
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
                      <Dropdown>
                          <DropdownTrigger>
                            <p  className="font-medium text-sm text-zinc-600 cursor-pointer">{status}</p>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Static Actions">
                            <DropdownItem onClick={() => setStatus("No Entregado")} key="new">No Entregado</DropdownItem>
                            <DropdownItem onClick={() => setStatus("Entregado")} key="copy">Entregado</DropdownItem>
                            <DropdownItem onClick={() => setStatus("Devuelto")} key="edit">Devuelto</DropdownItem>
                            <DropdownItem onClick={() => setStatus("Suspendido")} key="suspended">Suspendido</DropdownItem>                      
                          </DropdownMenu>
                        </Dropdown>
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
      </Modal>
    </>
  );
}

export default EditOrder