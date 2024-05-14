import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

const DeleteOrderrr = ({orderData, update, closeModal}) => {

    const [successMessage, setSuccessMessage] = useState(false)
    const [messageSuccesDeleteArticle, setMessageSuccesDeleteArticle] = useState(false)
    const [secondStepOfDelete, setSecondStepOfDelete] = useState(false)
  
  

    const deleteOrderAndReplenishStock = async () => { 
      try {
        const deleteOrderWithReplenishStock = await axios.delete(`http://localhost:4000/orders/replenishStock/${orderData.id}`)
        console.log(deleteOrderWithReplenishStock.data)
        if(deleteOrderWithReplenishStock.status === 200) { 
          update()
          setSuccessMessage(true)
          setTimeout(() => { 
            setSuccessMessage(false)
            closeModal()
          }, 1500)
        }
      } catch (error) {
        console.log(error)
      }    
   }


   useEffect(() => { 
    console.log(orderData)
    console.log(orderData.downPaymentData)
   }, [orderData])
 
   

  return (
    <div>
    {((orderData.paid!== true && orderData.orderStatus === "Armado") || orderData.orderStatus === "A Confirmar") ? (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <p className="flex flex-col gap-1 text-zinc-700 font-bold text-md">
            ¿Estás seguro de eliminar el pedido? {orderData.orderStatus}
          </p>
          {orderData.downPaymentData.length > 0? (
            <p className="text-sm text-zinc-600">
              Los artículos se repondrán al stock y la seña será eliminada
            </p>
          ) : (
            <p className="text-sm text-zinc-600">
              Los artículos se repondrán al stock
            </p>
          )}
        </div>
        <div className="flex items-center gap-6 mt-4 mb-4">
          <Button
            className="text-sm font-medium text-white bg-green-800 w-60"
            onClick={() => deleteOrderAndReplenishStock()}
          >
            Eliminar
          </Button>
          <Button
            className="text-sm font-medium text-white bg-green-800 w-60"
            onPress={closeModal}
          >
            Cancelar
          </Button>
        </div>
        {successMessage? (
          <div className="flex items-center mt-4 mb-2">
            <p className="text-green-600 text-sm font-medium">
              Orden Eliminada Correctamente ✔
            </p>
          </div>
        ) : null}
      </div>
    ) : orderData.paid === true? (
      <div className="flex flex-col items-center justify-center">
        <p className="text-md font-medium text-white bg-red-600 w-full text-center">
          No puedes eliminar un alquiler que ya se encuentra abonado
        </p>
        <Button className="bg-green-800 text-white font-medium text-sm w-72 mt-4 mb-2" onClick={() => closeModal()}>
          Cerrar
        </Button>
      </div>
    ) : (
      ((orderData.paid!== true && orderData.orderStatus === "Lavado") || orderData.orderStatus === "Entregado" || orderData.orderStatus === "Devuelto")? (
         <div className="flex items-center justify-center text-center">
             <p className="text-md font-medium text-zinc-600">No podes eliminar una orden que se encuentra en {orderData.orderStatus}</p>
         </div>    
      ) : null
    )}
  </div>
  )
}

export default DeleteOrderrr
