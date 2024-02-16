import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice, getDay, getMonth, getYear} from "../../functions/gralFunctions";

const PostPayment = ({orderData}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Asentar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                 <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">
                    <div>
                        <p className="text-zinc-600 font-bold text-md"> Asentar cobro del Pedido</p>
                    </div>
                    <div className="flex flex-col text-start justify-start  mt-2">
                       <p className="text-sm font-medium text-black">Cliente: {orderData.client}</p>
                       <p className="text-sm font-medium text-black">Cargado el {orderData.day} de {orderData.month} de {orderData.year}</p>
                       <p className="text-sm font-medium text-black">Monto a cobrar: {formatePrice(orderData.total)}</p>
                    </div>
                   
                 </ModalHeader>
              <ModalBody>
               
                
              </ModalBody>
              <ModalFooter className="flex gap-6 items-center justify-center">
                <Button  className="font-bold text-white text-sm bg-green-600 w-32" onPress={onClose}>
                  Asentar Pago
                </Button>
                <Button  className="font-bold text-white text-sm bg-green-600 w-32" onPress={onClose}>
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

export default PostPayment