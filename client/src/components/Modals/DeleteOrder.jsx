import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

const DeleteOrder = ({type, orderData, updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [successMessage, setSuccessMessage] = useState(false)

  const deleteOrder = () => { 
     axios.delete(`http://localhost:4000/orders/${orderData.id}`)
          .then((res) => { 
            console.log(res.data)
            updateList()
            setSuccessMessage(true)
            setTimeout(() => { 
              setSuccessMessage(false)
              onClose()
            }, 1500)
          })
  }

  return (
    <>
     <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Eliminar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      {type === "orders" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Pedido</ModalHeader>
              <ModalBody>
               <div className="flex flex-col items-center justify-center">
                  <div>
                     <p className="flex flex-col gap-1 text-black font-bold text-md">¿Estas seguro de eliminar el pedido?</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteOrder()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={onClose}>Cancelar</Button>
                  </div>
                 {successMessage ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Orden Eliminada Correctamente ✔</p>
                  </div>
                  : null}
               </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}
      </Modal>
    </>
  );
}

export default DeleteOrder