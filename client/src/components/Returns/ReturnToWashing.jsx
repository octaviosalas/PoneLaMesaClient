import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

export const ReturnToWashing = ({orderData, updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [succesMessage, setSuccesMessage] = useState(false);

  const handleOpen = () => { 
    console.log(orderData)
    onOpen()
  }

  const returnOrderToWashed = async () => { 
    try {
        const newStatus = "Lavado"
        const changeOrderStatus = await axios.put(`http://localhost:4000/orders/changeOrderState/${orderData.id}`, {newStatus})
        console.log(changeOrderStatus.data)
        if(changeOrderStatus.status === 200) { 
            setSuccesMessage(true)
            updateList()
            setTimeout(() => { 
                setSuccesMessage(false)
                onClose()
            }, 1800)
        }
    } catch (error) {
         console.log(error)
    }
  
  }

  return (
    <>
      <p className="text-xs font-medium text-green-800 cursor-pointer" onClick={handleOpen}>Pasar a Lavado</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Modal Title</ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-center mt-4">
                  <p className="text-sm font-medium text-green-800">¿Estas seguro de pasar la orden {orderData.orderNumber} del mes de {orderData.month} a Lavado?</p>
                </div>
              </ModalBody>
              <ModalFooter className="mb-2 flex gap-4 items-center justify-center">
                <Button className="bg-green-800 text-sm text-white font-medium" onClick={() => returnOrderToWashed()}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 text-sm text-white font-medium" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
              {succesMessage ? 
                <div className="mt-4 mb-4 flex items-center justify-center">
                   <p className="font-medium text-green-800 text-sm">Orden pasada a Lavado con Exito ✔</p>
                </div> : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ReturnToWashing