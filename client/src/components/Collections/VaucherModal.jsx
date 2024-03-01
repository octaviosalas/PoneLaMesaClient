import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const VaucherModal = ({detail}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <p className="font-medium text-green-700 text-xs" onClick={onOpen}>Ver Comprobante</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Comprobante de Pago</ModalHeader>         
              <ModalBody className="flex items-center jsutify-center">
                <div className="m-2">
                <img src={detail.voucher} className="w-72 h-72 rounded-2xl"/>
                </div>
              </ModalBody>            
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default VaucherModal