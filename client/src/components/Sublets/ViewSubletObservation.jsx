import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const ViewSubletObservation = ({subletObservation}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <p className="text-xs font-medium text-green-800 cursor-pointer" onClick={onOpen}>Ver Observacion</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Observacion del SubAlquiler</ModalHeader>
              <ModalBody className="flex items-center justify-center mb-4"> 
                {subletObservation.observation.length !== 0 ? 
                <div>
                  <p className="font-medium text-sm text-green-800">{subletObservation.observation}</p>
                </div> : 
                <div>
                    <p className="font-medium text-sm text-green-800">Este Sub Alquiler no tiene Observaciones</p>
                </div>
                }
      
              </ModalBody>         
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ViewSubletObservation