import React, { useState } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import axios from 'axios';

const IncreasePriceWithPercentage = () => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [percentageValue, setPercentageValue] = useState("")

    const applyIncrease = () => { 
      const theValue = ({ 
        percentage: percentageValue
      })
      axios.post("http://localhost:4000/increasePrices", theValue)
           .then((res) => { 
            console.log(res.data)
           })
           .catch((err) => { 
            console.log(err)
           })
    }

    
    

    return (
        <>
          <p className="text-zinc-600 font-medium text-sm 2xl:text-md cursor-pointer" onClick={onOpen}>Aplicar aumento de precios</p>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col mr-4">Aumentar precio de Articulos</ModalHeader>
                  <ModalBody>
                    
                  <Input
                    type="number"
                    label="Porcentaje"
                    placeholder="0"
                    labelPlacement="outside"
                    value={percentageValue}
                    onChange={(e) => setPercentageValue(e.target.value)}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                  />

                  </ModalBody>
                  <ModalFooter className='flex items-center justify-center'>
                      <Button variant="light" onPress={onClose} className='bg-green-800 text-white font-bold'>
                        Confirmar Aumento
                      </Button>
                      <Button  onPress={onClose} className='bg-green-800 text-white font-bold'>
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

export default IncreasePriceWithPercentage


