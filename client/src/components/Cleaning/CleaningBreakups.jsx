import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useState } from "react";

const CleaningBreakups = ({update, reference}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [quantity, setQuantity] = useState(0)
    const [quantityError, setQuantityError] = useState(false)

    const confirm = (value) => { 
        if(value > reference) { 
            return null
        } else { 
            update(value)
            onClose()
        }
      
    }

    const handleOpen = () => { 
        console.log(reference)
        onOpen()
    }

    return (
        <>
          <p className="text-red-600 font-medium underline cursor-pointer text-sm 2xl:text-md" onClick={handleOpen}>Click aqui si hubo rupturas en el lavado</p>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            {/* 
             onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (value >= actualYear && !isNaN(value))) {
                              setShiftChoosenYear(e.target.value);
                              setYearError(false);
                            } else {
                              setYearError(true);
                            }
                        }}
            */}
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Rupturas Lavado</ModalHeader>
                  <ModalBody>
                    <p> 
                     <Input type="text" label="Indica la cantidad de articulos rotos" variant="underlined" className="w-72" value={quantity}  onChange={(e) => {
                         const value = e.target.value;
                         if (value > reference) {
                             setQuantityError(true);
                             setYearError(false);
                         } else {
                          setQuantityError(false)
                          setQuantity(value)
                         }
                     } }
                     />
                    </p>

                    {quantityError ? <div className="flex items-center justify-center"><p className="text-red-600 text-sm">Estas ingresando una cantidad invalida</p></div> : null}
                  
                  </ModalBody>
                  <ModalFooter className="flex justify-center items-center">
                    <Button className="bg-green-800 text-white font-medium text-md w-40"  onClick={() => confirm(quantity)}>
                      Confirmar
                    </Button>
                    <Button className="bg-green-800 text-white font-medium text-md w-40" onPress={onClose}>
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

export default CleaningBreakups

