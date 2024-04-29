import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const ViwShiftActivitiesModal = ({activities}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleOpen = () => { 
    onOpen()
    console.log(activities)
  }

  return (
    <>
      <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={handleOpen}>Ver Actividades</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Actividades del Turno</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                {activities.activities.map((act) => ( 
                    <div className="flex flex-col items-start justify-start">
                        <p className="font-medium text-zinc-600 text-md">{act}</p>
                    </div>
                ))}
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button className="bg-green-800 font-medium text-white w-52" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ViwShiftActivitiesModal
