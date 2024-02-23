import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import DeleteOrderrr from "./DeleteOrderrr";
import DeleteArticle from "./DeleteArticle";
import DeletePurchase from "./DeletePurchase";

const DeleteOrder = ({type, orderData, productData, purchaseData, updateList, updatePurchasesList}) => {
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

  const deleteOrderAndReplenishStock = () => { 
    axios.delete(`http://localhost:4000/orders/replenishStock/${orderData.id}`)
         .then((res) => { 
           console.log(res.data)
           updateList()
           setSuccessMessage(true)
           setTimeout(() => { 
             setSuccessMessage(false)
             onClose()
           }, 2500)
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
                <DeleteOrderrr update={updateList} orderData={orderData} closeModal={onClose}/>
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
                 <DeleteArticle productData={productData} closeModalNow={onClose} updateList={updateList}/>
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
                <DeletePurchase purchaseData={purchaseData} closeModalNow={onClose} updateList={updatePurchasesList}/>
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