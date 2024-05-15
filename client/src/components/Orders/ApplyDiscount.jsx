import React from "react";
import { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";

const ApplyDiscount = ({apply}) =>  {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [error, setError] = useState(false)
  const [discount, setDiscount] = useState(false)

  const handleClose = () => { 
    apply(discount)
    onClose()
  }

  return (
    <>
      <p className="text-green-800 font-medium text-sm underline cursor-pointer" onClick={onOpen}>Aplicar Descuento</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Aplicar Descuento</ModalHeader>
              <ModalBody className="flex items-center justify-center">
                   <Input 
                        variant="underlined" 
                        type="number" 
                        className='w-48 items-center' 
                        onChange={(e) => {
                            if(e.target.value <= 0) { 
                              setError(true)
                            } else { 
                              setDiscount(e.target.value)
                              setError(false)
                            }
                          }
                          }
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">%</span>
                          </div>
                        }/> 
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button className="bg-green-800 text-white font-medium text-sm w-56" onClick={() => handleClose()}> Confirmar </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ApplyDiscount
