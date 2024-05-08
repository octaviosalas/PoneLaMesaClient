import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const ViewLicenseModal = ({item}) => {


    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const handleOpen = () => { 
        console.log(item)
    }

  return (
    <div>
      <p className='text-green-800 text-xs font-medium cursor-pointer' onClick={onOpen}>Ver Licencia</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Licencia de Conducir {item.name}</ModalHeader>
              <ModalBody>
                {item.license ? 
                   <div className='flex tems-center jsutify-center'>
                        <img src={item.license} className='w-96 h-96'/> 
                   </div>
                 : 
                 <div className='flex items-center justify-center mt-4'>
                   <p className='text-black text-sm'>No hay licencia de conducir cargada</p>
                 </div>
                 }
              </ModalBody>
              <ModalFooter className='flex items-center justify-center mt-2'>
                
                <Button className='bg-green-800 text-white font-medium text-sm w-72' onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ViewLicenseModal
