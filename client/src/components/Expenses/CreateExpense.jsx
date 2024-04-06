import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem} from "@nextui-org/react";
import axios from "axios"
import { useState, useEffect } from "react";
import {formatePrice, getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions"


const CreateExpense = () => {
  
   const {isOpen, onOpen, onOpenChange} = useDisclosure();
   const [actualDay, setActualDay] = useState(getDay())
   const [actualMonth, setActualMonth] = useState(getMonth())
   const [actualYear, setActualYear] = useState(getYear())
   const [actualDate, setActualDate] = useState(getDate())
   const [amount, setAmount] = useState(0)
 
//nafta edelap gas alquilerLocal mecaico vtv


  return (
    <>
      <p className="text-zinc-600 font-medium text-sm" onClick={onOpen}>Crear Gasto Fijo</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Gasto Fijo</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-6">
                <Button className="bg-green-800 text-white text-sm font-medium w-52"  onPress={onClose}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 text-white text-sm font-medium w-52"  onPress={onClose}>
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

export default CreateExpense