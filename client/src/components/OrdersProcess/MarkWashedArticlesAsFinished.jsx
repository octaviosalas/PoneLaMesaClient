import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";

const MarkWashedArticlesAsFinished = ({washedData}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [newQuantity, setNewQuantity] = useState(0)


  const handleOpen = () => { 
    console.log(washedData)
    onOpen()
  }

  

  return (
    <>
      <p className="text-green-800 text-xs font-medium" onClick={handleOpen}>Reponer Stock</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reponer {washedData.productName}</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                 <Input type="text" variant="underlined" label="Cantidad en Lavado" value={washedData.quantity - newQuantity}/>
                 <Input type="text" variant="underlined" label="Cantidad a Reponer" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)}/>
              </ModalBody>
              <ModalFooter className="flex gap-6 items-center justify-center">
                <Button className="bg-green-800 text-white font-medium w-52" onPress={onClose}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 text-white font-medium w-52" onPress={onClose}>
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

export default MarkWashedArticlesAsFinished
