import React, {useState, useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import axios from "axios";

const AddNewFixedType = ({updateSelectData}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [fixedExpenseName, setFixedExpenseName] = useState("")
  const [succesMessage, setSuccesMessage] = useState(false)

  const createNewName = async () => { 
    const data = ({ 
        name: fixedExpenseName
    })
    try {
        const sendData = await axios.post("http://localhost:4000/expenses/createTypeFixed", data)
        const response = sendData.data
        console.log(response)
        updateSelectData()
        setSuccesMessage(true)
        setTimeout(() => { 
            setSuccesMessage(false)
            onClose()
        }, 2000)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
    <p className="mt-2 font-medium text-xs text-green-800 underline cursor-pointer" onClick={onOpen}>Crear nuevo tipo de Gasto</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Escribe el nombre del Gasto</ModalHeader>
              <ModalBody>
                 <Input type="text" variant="underlined" className="w-full" value={fixedExpenseName} onChange={(e) => setFixedExpenseName(e.target.value)}/>
              </ModalBody>
              <ModalFooter className="flex gap-4 items-center justify-center">
                <Button className="bg-green-800 w-56 font-medium text-white text-sm" onPress={onClose}>
                  Cerrar
                </Button>
                <Button  className="bg-green-800 w-56 font-medium text-white text-sm" onClick={() => createNewName()}>
                  Crear
                </Button>
              </ModalFooter>
              {succesMessage ? 
              <div className="mt-4 mb-4 flex items-center justify-center">
                    <p className="font-medium text-sm text-green-800">Tipo de gasto añadido con Exito</p>
              </div> : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddNewFixedType
