import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from "axios";
import Loading from "../Loading/Loading"

import { useState, useEffect } from "react";

const HistoricProviders = ({providerData, updateList}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
  

    const handleOpen = async () => { 
      onOpen();
    }


  return (
    <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Historico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-xl bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p  className="text-zinc-600 font-bold text-md">Historico de Proveedor</p>
                <p  className="text-zinc-600 font-medium text-sm">{providerData.id}</p>
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center">   
            lala
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-2">
                <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onPress={onClose}> Cerrar </Button>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default HistoricProviders


