import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

const QuestionBeforeReturn = ({item, updateNumbers}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  //subletsToReturn.put('/updateQuantity/:productId', returnToProvider); 

  const returnToProvider = async () => { 
    console.log(item)
    console.log(item.productId)
    const quantityData = ({ 
        quantity: item.quantity
    })
      try {
         const {data, status} = await axios.put(`http://localhost:4000/subletsToReturn/updateQuantity/${item.productId}`, quantityData)
         if(status === 200) { 
             onClose()
             updateNumbers()
             console.log("se actgualizo", data)
         }
      } catch (error) {
            console.log(error)
      }
  }
  return (
    <>
      <p className="text-green-800 font-medium text-sm cursor-pointer" onClick={onOpen}>Registrar Devolucion</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Devolucion al Proveedor</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                    <div>
                         {item.quantity > 1 ?<p>¿Estas seguro de asentar la devolucion de estos articulos ?</p> : 
                            <p>¿Estas seguro de asentar la devolucion de este articulo?</p>
                         }
                    </div>
                    <div className="flex items-center gap-4 mt-4 mb-2">
                        <Button className="bg-green-800 text-white font-medium text-sm w-44" onClick={() => returnToProvider()}>Asentar</Button>
                        <Button className="bg-green-800 text-white font-medium text-sm w-44">Cancelar</Button>
                    </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default QuestionBeforeReturn