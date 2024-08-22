import React, { useState, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import {Select, SelectItem} from "@nextui-org/react";

const ChangeState = ({status, orderData, updateList}) =>  {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [successMessage, setSuccesMessage] = useState(false)
  const [newOrderStatus, setNewOrderStatus] = useState("Selecciona un Estado ↓")
  const [errorMessage, setErrorMessage] = useState(false)
  const [size, setSize] = useState("3xl")

  const changeOrderState = () => { 
    if(newOrderStatus === "Selecciona un Estado ↓") { 
      setErrorMessage(true)
      setTimeout(() => { 
        setErrorMessage(false)
      }, 1500)
    } else { 
      const newStatus = newOrderStatus
      axios.put(`http://localhost:4000/orders/changeOrderState/${orderData.id}`,  { newStatus })
           .then((res) => { 
            updateList("everyOrders")
            setSuccesMessage(true)
            setTimeout(() => { 
              setSuccesMessage(false)
              onClose()
              setNewOrderStatus("Selecciona un Estado ↓")
            }, 2500)
           })
           .catch((err) => { 
            console.log(err)
           })
    }
  }

  return (
    <>
      <p className="text-xs text-green-800 font-medium cursor-pointer" onClick={onOpen}>Modificar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modificar Estado</ModalHeader>
              <ModalBody>
            
                      <div className="flex flex-col items-center justify-center mb-4">
                        <div>
                         {status === "Armado" ? 
                              <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">      
                                  <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setNewOrderStatus("Entregado")} >Entregado</SelectItem>         
                                  <SelectItem key={"Reparto"} value={"Reparto"} onClick={() => setNewOrderStatus("Reparto")} >Reparto</SelectItem>        
                                  <SelectItem key={"Retiro en Local"} value={"Retiro en Local"} onClick={() => setNewOrderStatus("Retiro en Local")} >Retiro en Local</SelectItem>                                       
                              </Select> 
                            : status === "Confirmado" ? (
                              <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">    
                                <SelectItem key={"armado"} value={"Armado"} onClick={() => setNewOrderStatus("Armado")} >Armado</SelectItem>             
                                <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setNewOrderStatus("Entregado")} >Entregado</SelectItem>                                             
                              </Select>
                            ) : status === "A Confirmar" ? ( 
                              <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">    
                                <SelectItem key={"Confirmado"} value={"Confirmado"} onClick={() => setNewOrderStatus("Confirmado")} >Confirmado</SelectItem>                                                      
                              </Select>
                            ) : (
                              <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">      
                                  <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setNewOrderStatus("Entregado")} >Entregado</SelectItem>         
                                  <SelectItem key={"Reparto"} value={"Reparto"} onClick={() => setNewOrderStatus("Reparto")} >Reparto</SelectItem>        
                                  <SelectItem key={"Retiro en Local"} value={"Retiro en Local"} onClick={() => setNewOrderStatus("Retiro en Local")} >Retiro en Local</SelectItem>                                       
                              </Select> 
                            )
                          }               
                        </div>
                        <div className="flex gap-6 items-center mt-6">
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() => changeOrderState()}>Confirmar</Button>
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() => closeModalNow()}>Cancelar</Button>
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() =>  onClose()}>Volver</Button>
                        </div>

                      {successMessage ?
                        <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-6">
                          <p className="font-medium text-md text-white text-center w-full bg-green-800">Estado de orden Modificado con Exito ✔</p>
                        </div> :
                        null}

                      {errorMessage ?
                        <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-4">
                          <p className="font-medium text-sm text-green-800">Debes seleccionar un estado</p>
                        </div> :
                        null}                      
                      </div>
                  
              </ModalBody>
             
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangeState