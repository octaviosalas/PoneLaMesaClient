import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import DeleteOrderrr from "./DeleteOrderrr";
import DeleteArticle from "./DeleteArticle";
import DeletePurchase from "./DeletePurchase";
import DeleteClient from "./DeleteClient";
import DeleteProvider from "./DeleteProvider"
import DeleteSublet from "./DeleteSublet";
import DeleteCollection from "./DeleteCollection";
import DeleteEmployee from "./DeleteEmployee";
import DeleteExpense from "./DeleteExpense";

const DeleteOrder = ({
                        type, 
                        orderData, 
                        productData, 
                        purchaseData, 
                        updateList, 
                        updateListArticles, 
                        updatePurchasesList, 
                        clientData, 
                        updateClientList, 
                        providerData, 
                        updateProviderList, 
                        subletData, 
                        updateSubletsList, 
                        collectionData, 
                        updateCollectionList,
                        employeeData,
                        updateEmployee,
                        expenseData,
                        updateExpenseList}) => {
 
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [successMessage, setSuccessMessage] = useState(false)
  const [messageSuccesDeleteArticle, setMessageSuccesDeleteArticle] = useState(false)
  const [secondStepOfDelete, setSecondStepOfDelete] = useState(false)

 
 
   return (
    <>
     <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Eliminar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-xl">
      {type === "orders" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Pedido </ModalHeader>
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
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Producto</ModalHeader>
              <ModalBody>
                 <DeleteArticle productData={productData} closeModalNow={onClose} updateList={updateListArticles}/>
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
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Compra</ModalHeader>
              <ModalBody>
                <DeletePurchase purchaseData={purchaseData} closeModalNow={onClose} updateList={updatePurchasesList}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}  

       {type === "client" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Cliente</ModalHeader>
              <ModalBody>
                <DeleteClient clientData={clientData} closeModalNow={onClose} updateClientList={updateClientList}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}   

       {type === "providers" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Proveedor</ModalHeader>
              <ModalBody>
                <DeleteProvider providerData={providerData} closeModalNow={onClose} updateProviderList={updateProviderList}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}   

      {type === "sublets" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar SubAlquiler</ModalHeader>
              <ModalBody>
                <DeleteSublet subletData={subletData} closeModalNow={onClose} updateSubletList={updateSubletsList}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}   

    {type === "collection" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar cobro de {collectionData.collectionType}</ModalHeader>
              <ModalBody>
                <DeleteCollection collectionData={collectionData} closeModalNow={onClose} updateCollections={updateCollectionList}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}   

     {type === "expense" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar Gasto</ModalHeader>
              <ModalBody>
                <DeleteExpense expenseData={expenseData} closeModalNow={onClose} updateExpenseList={updateExpenseList}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
        :
        null}   

      {type === "employee" ? 
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Eliminar empleado</ModalHeader>
              <ModalBody>
                <DeleteEmployee employeeData={employeeData} closeModalNow={onClose} updateEmployee={updateEmployee}/>
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