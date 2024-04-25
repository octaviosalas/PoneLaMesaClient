import React, { useState } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure} from "@nextui-org/react";

const AddShippingCost = ({addCost}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [cost, setCost] = useState(0)
  const [error, setError] = useState(false)

  const confirmTheCost = () => { 
    onClose()
    addCost(cost)
  }
  

  return (
    <div>
        <Button className='text-sm bg-green-800 text-white font-medium cursor-pointer w-44' onClick={onOpen}>Agregar costo de Envio</Button>
       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Asentar costo de Envio</ModalHeader>
                <ModalBody className='flex items-center justify-center'>
                      <Input 
                        variant="underlined" 
                        type="number" 
                        className='w-48 items-center' 
                        onChange={(e) => {
                            if(e.target.value <= 0) { 
                              setError(true)
                            } else { 
                              setCost(e.target.value)
                              setError(false)
                            }
                          }
                          }
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">$</span>
                          </div>
                        }/> 
                </ModalBody>
                <ModalFooter className='flex flex-col items-center justify-enter mt-2'>
                  {error ? null : <Button className='bg-green-800 text-white font-medium cursor-pointer w-96' onClick={() => confirmTheCost()}>Confirmar</Button>}
                  {error ? <p className='text-green-800 font-medium text-sm mt-2 mb-2'>El costo de envio debe ser mayor a 0</p> : null}
                </ModalFooter>
              </>
            )}
          </ModalContent>
      </Modal>
    </div>
  )
}

export default AddShippingCost
