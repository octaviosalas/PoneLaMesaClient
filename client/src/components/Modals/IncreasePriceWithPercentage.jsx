import React, { useState } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import axios from 'axios';
import Loading from '../Loading/Loading';

const IncreasePriceWithPercentage = ({updateList}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [percentageValue, setPercentageValue] = useState("")
    const [inProcess, setInProcess] = useState(false)
    const [succesMessage, setSuccesMessage] = useState(false)

    const applyIncrease = () => { 
      setInProcess(true)
      const theValue = ({ 
        percentage: percentageValue
      })
      axios.post("http://localhost:4000/products/increasePrices", theValue)
           .then((res) => { 
            console.log(res.data)
            console.log("enviando funcion")
            setInProcess(false)
            setSuccesMessage(true)
            updateList()
            setTimeout(() => { 
              onClose()
              setSuccesMessage(false)
            }, 2500)
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
                    labelPlacement="outside"
                    variant="underlined"
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
                      <Button variant="light" onClick={() => applyIncrease()} className='bg-green-800 text-white font-bold'>
                        Confirmar Aumento
                      </Button>
                      <Button  onPress={onClose} className='bg-green-800 text-white font-bold'>
                        Cancelar
                      </Button>
                  </ModalFooter>

                    {inProcess ? 
                    <div className='mt-4 mb-4 flex items-center justify-center'>
                      <Loading/>
                    </div>
                      : null
                    }

                    {succesMessage ? 
                      <div className='mt-4 mb-4 flex items-center justify-center'>
                        <p className='text-green-700 font-medium text-sm'>Aumento aplicado con Exito ✔</p>
                      </div>
                    : null
                      }
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      );
}

export default IncreasePriceWithPercentage


