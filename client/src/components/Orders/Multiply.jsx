import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";

const Multiply = ({changeTotal}) => {

    const [number, setNumber] = useState(1)
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const changeTotalNow = (value) => { 
      changeTotal(value)
      onClose()
    }

    



  return (
    <>
        <Button className="font-medium text-white bg-green-800  w-52" onPress={onOpen}>Multiplicar Importe</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Elegi la cantidad de dias</ModalHeader>
              <ModalBody>
                <Input type="text" className="w-full" value={number} onChange={(e) => setNumber(e.target.value)}/>
              </ModalBody>
              <ModalFooter className="flex items-center gap-6">
                  <Button className="font-medium text-white bg-green-800  w-52" onClick={() => changeTotalNow(number)}>
                    Confirmar
                  </Button>
                  <Button className="font-medium text-white bg-green-800  w-52" onPress={onClose}>
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

export default Multiply