import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const CancelPendingReplacement = ({data, updateList}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    console.log(data)

    const handleOpen = () => { 
        console.log(data)
        onOpen()
    }

    const deleteReplacement = async () => { 
        try {
            
        } catch (error) {
            
        }
    }


  return (
    <>
    <p className='text-green-800 font-medium text-sm' onClick={handleOpen}>Cancelar</p>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Cancelar Reposicion</ModalHeader>
            <ModalBody className='flex flex-col items-center justify-center'>
              <div className='flex flex-col items-center justify-center'> 
                 <p className='text-black text-sm font-medium'>¿Estas seguro de cancelar la reposicion?</p>
                 <p className='text-black text-sm font-medium'>La deuda del cliente sera eliminada</p>
              </div>
              <div className='flex gap-6 items-center justify-center mt-4 mb-2'>
                <Button className='bg-green-800 text-white font-medium text-sm'>Confirmar</Button>
                <Button className='bg-green-800 text-white font-medium text-sm'>Cancelar</Button>
              </div>           
            </ModalBody>
           
          </>
        )}
      </ModalContent>
    </Modal>
  </>
  )
}

export default CancelPendingReplacement
