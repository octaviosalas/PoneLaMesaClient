import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const EditOrder = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-sm cursor-pointer">Editar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Editar Pedido</ModalHeader>
              <ModalBody>
                 <div className="flex gap-4 items-center justify-center">
                    <Button className="font-bold text-white text-xs bg-green-600 w-52">Modificar Valores</Button>
                    <Button className="font-bold text-white text-xs bg-green-600 w-52">Cambiar Estado</Button>
                    <Button className="font-bold text-white text-xs bg-green-600 w-52">Adjuntar Articulos a Reponer</Button>
                 </div>
              </ModalBody>
            
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditOrder