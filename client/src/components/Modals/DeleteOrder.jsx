import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const DeleteOrder = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
     <p onClick={onOpen} className="text-green-700 font-medium text-sm cursor-pointer">Eliminar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                     <Button className="text-sm font-medium text-white bg-green-600">Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={onClose}>Cancelar</Button>
                  </div>
               </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteOrder