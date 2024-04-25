import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const ModalCardEmployeesShifts = ({data}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const handleOpen = () => { 
        console.log(data)
        onOpen()
    }


  return (
    <div>
        <p className='text-xs text-green-800 font-medium cursor-pointer' onClick={handleOpen}>Ver Empleados</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Empleados turno {data.map((d) => d.turno)[0]}</ModalHeader>
              <ModalBody>
                   {data.map((data) => data.empleados.map((emp) => ( 
                     <div className='flex flex-col items-start justify-start mt-2'>
                        <p className='text-zinc-600 text-sm font-medium'>Empleado: {emp.name}</p>
                        <p className='text-zinc-600 text-sm font-medium'>Horas Trabajadas: {emp.workedHours}</p>
                     </div>
                   )))}
              </ModalBody>
              <ModalFooter className='flex items-center justify-enter mt-2'>
                <Button className='bg-green-800 text-white font-medium cursor-pointer w-96' onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ModalCardEmployeesShifts
