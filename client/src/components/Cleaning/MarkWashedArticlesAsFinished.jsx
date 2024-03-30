import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import axios from "axios";

const MarkWashedArticlesAsFinished = ({washedData, updateNumbers}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [newQuantity, setNewQuantity] = useState(0)
  const [succesUpdate, setSuccesUpdate] = useState(false)
  const [errorInQuantity, setErrorInQuantity] = useState(false)
  const [missedData, setMissedData] = useState(false)


  const handleOpen = () => { 
    console.log(washedData)
    onOpen()
  }

  const updateArticleStock = async () => { 
    if(newQuantity !== 0 && errorInQuantity !== true) { 
      const quantityToBeUpdated = ({ 
        newQuantity: washedData.quantity - newQuantity,
        quantity: Number(newQuantity),
        productId: washedData.productId
       });
  
       try {
          const updateStockAndUpdateCleaningQuantity = await axios.put(`http://localhost:4000/cleaning/updateQuantity/${washedData.productId}`, quantityToBeUpdated)
          console.log(updateStockAndUpdateCleaningQuantity)
          if(updateStockAndUpdateCleaningQuantity.status === 200) { 
            setSuccesUpdate(true)
            setTimeout(() => { 
              updateNumbers()
              setSuccesUpdate(false)
              setNewQuantity(0)
              onClose()
            }, 2000)
          }
       } catch (error) {
        console.log(error)
       }
    } else { 
      setMissedData(true)
      setTimeout(() => { 
        setMissedData(false)
      }, 1500)
    }
  }

  

  return (
    <>
      <p className="text-green-800 text-xs font-medium cursor-pointer" onClick={handleOpen}>Reponer Stock</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reponer {washedData.productName}</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                 <Input type="text" variant="underlined" label="Cantidad en Lavado" value={washedData.quantity - newQuantity}/>
                 <Input type="number" variant="underlined"  label="Cantidad a Reponer"  value={newQuantity}  onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (value > 0 && !isNaN(value))) {
                             setNewQuantity(e.target.value);
                             setErrorInQuantity(false)
                            } else {
                              setErrorInQuantity(true)
                            }
                        }} 
                        />
                  {errorInQuantity ? <p className="text-xs text-zinc-600 font-medium">El numero debe ser mayor a 0</p> : null}

              </ModalBody>
              <ModalFooter className="flex gap-6 items-center justify-center">
                <Button className="bg-green-800 text-white font-medium w-52" onClick={() => updateArticleStock()}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 text-white font-medium w-52" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
              {succesUpdate ?
                <div className="flex flex-col items-center justify-center mt-4 mb-2">
                  <p className="text-sm font-medium text-green-800">Se actualizado la cantidad Correctamente ✔</p>
                </div> : null}
                {missedData ?
                <div className="flex flex-col items-center justify-center mt-4 mb-2">
                  <p className="text-sm font-medium text-green-800">No podes actualizar por un numero igual a 0</p>
                </div> : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MarkWashedArticlesAsFinished
