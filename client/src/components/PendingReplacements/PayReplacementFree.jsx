
import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from 'axios';


const PayReplacementFree = ({item, updateList}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const deleteReplacement = async () => { 
    const productsToUpdateStock = ({ 
      products: item.detail
    })
    try {
        const response = await axios.post(`http://localhost:4000/clients/cancelDebt/${item.clientData.id}/${item.debtId}`, productsToUpdateStock)
        console.log(response.data)
        updateList()
    } catch (error) {
        console.log(error)
    }
}

  return (
    <>
  
      <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={onOpen}>Asentar </p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Hacer atencion al cliente</ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center">
                  <p className="font-medium text-black text-md">Valor de la reposicion: {formatePrice(item.amountToPay)}</p> 
              </ModalBody>
                <ModalFooter className="flex items-center justify-center gap-4">
                        <Button className="bg-green-800 text-white font-medium" onPress={() => deleteReplacement()}>
                           Confirmar
                        </Button>
                        <Button className="bg-green-800 text-white font-medium" onPress={onClose}>
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

export default PayReplacementFree