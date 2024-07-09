
import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";


const PayReplacementFree = ({item}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
  
      <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={onOpen}>Asentar </p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Hacer atencion al cliente</ModalHeader>
              <ModalBody>
                {item.amount}
                {item.debtId}
              </ModalBody>
                <ModalFooter className="flex items-center justify-center gap-4">
                        <Button className="bg-green-800 text-white font-medium" onPress={onClose}>
                           Confirmar
                        </Button>
                        <Button className="bg-green-800 text-white font-medium" onPress={onClose}>
                            Cancelar
                        </Button>
                </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default PayReplacementFree