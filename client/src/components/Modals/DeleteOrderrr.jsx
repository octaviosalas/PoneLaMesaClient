import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

const DeleteOrderrr = ({orderData, update, closeModal}) => {

    const [successMessage, setSuccessMessage] = useState(false)
    const [messageSuccesDeleteArticle, setMessageSuccesDeleteArticle] = useState(false)
    const [secondStepOfDelete, setSecondStepOfDelete] = useState(false)
  
    const deleteOrder = () => { 
       axios.delete(`http://localhost:4000/orders/${orderData.id}`)
            .then((res) => { 
              console.log(res.data)
              update()
              setSuccessMessage(true)
              setTimeout(() => { 
                setSuccessMessage(false)
                closeModal()
              }, 1500)
            })
    }
  
    const deleteOrderAndReplenishStock = () => { 
      axios.delete(`http://localhost:4000/orders/replenishStock/${orderData.id}`)
           .then((res) => { 
             console.log(res.data)
             update()
             setSuccessMessage(true)
             setTimeout(() => { 
               setSuccessMessage(false)
               closeModal()
             }, 2500)
           })
   }
 
   

  return (
    <div>
              <div className="flex flex-col items-center justify-center">
                  <div>
                     <p className="flex flex-col gap-1 text-black font-bold text-md">¿Estas seguro de eliminar el pedido?</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteOrder()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteOrderAndReplenishStock()}>Eliminar y Reponer Stock</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={closeModal}>Cancelar</Button>
                  </div>
                 {successMessage ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Orden Eliminada Correctamente ✔</p>
                  </div>
                  : null}
               </div>
    </div>
  )
}

export default DeleteOrderrr
