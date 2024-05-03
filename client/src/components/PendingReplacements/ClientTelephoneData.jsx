import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

const ClientTelephoneData = ({clientId, clientName}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [telephone, setTelephone] = useState("")

    const getTelephone = async () => { 
        try {
            const getTelephoneNumber = await axios.get(`http://localhost:4000/clients/${clientId}`)
            const response = getTelephoneNumber.data
            setTelephone(response.telephone)
            setT
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleOpen = () => { 
        getTelephone() 
        onOpen()
    }

  return (
    <>
      <Button  className="bg-green-800 text-white font-medium text-sm w-56" onPress={handleOpen}>  Ver Telefono</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Telefono de: {clientName}</ModalHeader>
              <ModalBody className="flex justify-center text-center">
                <p className="font-medium">Telefono: {telephone} </p>  
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-2">
                <Button className="bg-green-800 text-white font-medium text-sm w-56" onPress={onClose}>
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

export default ClientTelephoneData
