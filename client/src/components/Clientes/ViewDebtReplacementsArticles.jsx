import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";

const ViewDebtReplacementsArticles = ({replacementData}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const handleOpen = () => { 
        onOpen()
        console.log("PROP RECIBIDA", replacementData.replacementData)
        console.log("PROP RECIBIDA", replacementData.totalAmountDebt)
    }

  return (
    <>
      <p className="text-green-700 font-medium text-xs cursor-pointer" onClick={handleOpen}>Ver</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Articulos Pendientes de Reposicion</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center">
                  {replacementData.replacementData.map((rep) => ( 
                      <div className="flex flex-col items-staer justify-start mt-2">
                          <p className="text-sm text-zinc-600 font-medium">Articulo: {rep.productName}</p>
                          <p className="text-sm text-zinc-600 font-medium">Cantidad Faltante: {rep.missing}</p>
                          <p className="text-sm text-zinc-600 font-medium">Precio a Reponer: {formatePrice(rep.replacementPrice)}</p>
                      </div>
                  ))}
                  <div className="flex flex-col items-staer justify-start mt-2">
                      <p className="font-medium text-sm text-green-800">Total a Pagar: {formatePrice( replacementData.totalAmountDebt)}</p>
                  </div>
                </div>

              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button className="w-72 font-medium text-white bg-green-800" onPress={onClose}>
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

export default ViewDebtReplacementsArticles

