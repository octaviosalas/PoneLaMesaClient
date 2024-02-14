import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";

const CreateNewOrder = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <p onClick={onOpen}>Crear Pedido</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Pedido</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center"> 
                  <Input type="text" variant="bordered" label="Email" className="mt-2"/>
                  <Input type="text" variant="bordered" label="Email" className="mt-2"/>
                  <Input type="text" variant="bordered" label="Email" className="mt-2"/>
                  <Input type="text" variant="bordered" label="Email" className="mt-2"/>
                  <Input type="text" variant="bordered" label="Email" className="mt-2"/>
                  <Input type="text" variant="bordered" label="Email" className="mt-2"/>
                </div>
            
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default CreateNewOrder