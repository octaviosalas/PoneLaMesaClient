import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";

const PercentageArticlePrice = ({updatePrice}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [valuePrice, setValuePrice] = useState(0)

  const confirm = (item) => { 
    updatePrice(item)
    onClose()
  }

  return (
    <>
      <Button className="bg-green-800 text-white font-medium" onPress={onOpen}>Aumentar por porcentaje</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Porcentaje de Aumento</ModalHeader>
              <ModalBody>
                <Input type="number" vairant="underlined" onChange={(e) => setValuePrice(e.target.value)}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">%</span>
                    </div>
                  }/>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-4">
                <Button className="bg-green-800 font-medium text-white" color="danger" variant="light" onClick={() => confirm(valuePrice)}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 font-medium text-white" color="primary" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default PercentageArticlePrice