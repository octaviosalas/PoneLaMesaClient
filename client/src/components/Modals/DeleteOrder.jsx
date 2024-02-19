import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

const DeleteOrder = ({type, orderData, productData, purchaseData, updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [successMessage, setSuccessMessage] = useState(false)
  const [messageSuccesDeleteArticle, setMessageSuccesDeleteArticle] = useState(false)
  const [secondStepOfDelete, setSecondStepOfDelete] = useState(false)

  const deleteOrder = () => { 
     axios.delete(`http://localhost:4000/orders/${orderData.id}`)
          .then((res) => { 
            console.log(res.data)
            updateList()
            setSuccessMessage(true)
            setTimeout(() => { 
              setSuccessMessage(false)
              onClose()
            }, 1500)
          })
  }
  
  const deleteArticle = () => { 
    axios.delete(`http://localhost:4000/products/delete/${productData.id}`)
         .then((res) => { 
          console.log(res.data)
          updateList()
          setMessageSuccesDeleteArticle(true)
          setTimeout(() => { 
            onClose()
            setMessageSuccesDeleteArticle(false)
          }, 1500)
         })
         .catch((err) => { 
          console.log(err)
         })
  }

  const deletePurchase = () => { 
    axios.delete(`http://localhost:4000/purchases/${purchaseData.id}`)
         .then((res) => { 
          console.log(res.data)
         })
         .catch((err) => { 
          console.log(err)
         })
  }

  const deletePurchaseAndUpdateProductStock = () => { 
    axios.delete(`http://localhost:4000/purchases/replenishShares/${purchaseData.id}`)
         .then((res) => { 
          console.log(res.data)
         })
         .catch((err) => { 
          console.log(err)
         })
  }

  const goToSecondStepOfDelete = () => { 
    setSecondStepOfDelete(true)
  }


  return (
    <>
     <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Eliminar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-xl">
      {type === "orders" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Pedido</ModalHeader>
              <ModalBody>
               <div className="flex flex-col items-center justify-center">
                  <div>
                     <p className="flex flex-col gap-1 text-black font-bold text-md">¿Estas seguro de eliminar el pedido?</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteOrder()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={onClose}>Cancelar</Button>
                  </div>
                 {successMessage ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Orden Eliminada Correctamente ✔</p>
                  </div>
                  : null}
               </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}

       {type === "product" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Pedido</ModalHeader>
              <ModalBody>
               <div className="flex flex-col items-center justify-center">
                  <div>
                     <p className="flex flex-col gap-1 text-black font-bold text-md">¿Estas seguro de eliminar el producto?</p>
                     {productData.id}
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteArticle()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={onClose}>Cancelar</Button>
                  </div>
                 {messageSuccesDeleteArticle ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Articulo Eliminado Correctamente ✔</p>
                  </div>
                  : null}
               </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null} 

     {type === "purchase" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Pedido</ModalHeader>
              <ModalBody>
               <div className="flex flex-col items-center justify-center">
                  <div>
                     <p className="flex flex-col gap-1 text-black font-bold text-md">¿Estas seguro de eliminar La compra?</p>
                  </div>

                 {secondStepOfDelete ? null
                  :
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white w-auto bg-green-600" onClick={() => goToSecondStepOfDelete()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white w-auto bg-green-600" onPress={onClose}>Cancelar</Button>
                  </div>}

                 {secondStepOfDelete ? 
                  <div className="flex gap-4 mt-4 mb-4">
                    <Button className="text-sm font-medium text-white w-auto bg-green-600" onClick={() => deletePurchaseAndUpdateProductStock()}>Deshacer del Stock</Button>
                    <Button className="text-sm font-medium text-white w-auto bg-green-600" onClick={() => deletePurchase()}>No Deshacer productos del Stock</Button>
                  </div> : null}

                 {messageSuccesDeleteArticle ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Articulo Eliminado Correctamente ✔</p>
                  </div>
                  : null}

               </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}  
      </Modal>
    </>
  );
}

export default DeleteOrder