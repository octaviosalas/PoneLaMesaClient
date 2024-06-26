import React, { useState, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { getProductsClients } from "../../functions/gralFunctions";
import EditArticle from "./EditArticle";
import EditOrderData from "./EditOrderData";
import EditPurchase from "./EditPurchase";
import EditClient from "./EditClient";
import EditProvider from "./EditProvider";
import EditCollection from "./EditCollection";
import EditSublet from "./EditSublet";
import EditEmployee from "./EditEmployee";

const EditModal = ({
                    type, statusOrder, 
                    updateList,  orderData, 
                    purchaseData,  articleData, 
                    updateChanges, updateClientsChanges, 
                    clientData, providerData, 
                    updateProvidersList, collectionData, 
                    updateCollectionsList, updatePurchaseList, 
                    subletData, updateSubletList, employeeData, updateEmployee}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [step, setStep] = useState(0)

  const closeModal = () => { 
    onClose()
    setStep(0)
  }

  


  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Editar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-[750px] bg-white text-black'>
         {type === "orders" ? 
          <ModalContent>
            {(onClose) => (
              <EditOrderData orderData={orderData} updateList={updateList} closeModalNow={closeModal} orderStatus={statusOrder}/>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "product" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Producto </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                  <EditArticle articleData={articleData} closeModalNow={closeModal} updateChanges={updateChanges}/>
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "purchase" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Compra </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                  <EditPurchase purchaseData={purchaseData} closeModalNow={closeModal} updateChanges={updatePurchaseList}/>
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "client" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Cliente </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                  <EditClient clientData={clientData} closeModalNow={closeModal} updateChanges={updateClientsChanges}/>
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "provider" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Cliente </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                  <EditProvider providerData={providerData} closeModalNow={closeModal} updateChangesProviders={updateProvidersList}/>
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "collection" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Cobro </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                  <EditCollection collectionData={collectionData} closeModalNow={closeModal} updateCollectionList={updateCollectionsList}/>
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "sublets" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Sub Alquiler </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                  <EditSublet subletData={subletData} closeModalNow={closeModal} updateSubletList={updateSubletList}/>
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "employee" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Empleado </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                  <EditEmployee data={employeeData} closeModalNow={closeModal} update={updateEmployee}/>
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>
    </>
  );
}

export default EditModal




/*
                      <div className="flex flex-col items-center justify-center">
                        <Input type="text" variant="faded" label="Fecha de Entrega" value={newOrderDeliveryDate} className="w-56" onChange={(e) => setNewOrderDeliveryDate(e.target.value)}/>
                        <Input type="text" variant="faded" label="Fecha de Devolucion" value={newOrderReturnDate} className="w-56 mt-2" onChange={(e) => setNewOrderReturnDate(e.target.value)}/>
                        <Input type="text" variant="faded" label="Cliente" value={newOrderClient} className="w-56 mt-2"  onChange={(e) => setNewOrderClient(e.target.value)}/>
                        <div className="flex flex-col justify-start items-start  border"> 
                          {newOrderDetail.map((ord) => ( 
                            <div className="flex flex-col items-center mt-2 ">
                              <div className="flex items-center gap-2">
                                <p>{ord.productName}</p> 
                                <p>{ord.quantity}</p> 
                                <p>{ord.choosenProductTotalPrice}</p>
                              </div> 
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 mb-4 flex items-center gap-6">
                           <Button className="font-bold text-white text-xs bg-green-600 w-40">Cancelar</Button>
                           <Button className="font-bold text-white text-xs bg-green-600 w-40">Editar</Button>
                        </div>
                      </div>*/