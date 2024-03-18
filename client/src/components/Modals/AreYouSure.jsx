import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import { formatePrice } from "../../functions/gralFunctions";

const AreYouSure = ({subletData, dataOrder, closeModal, updateListOfSublets, updateOrderList})  => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [load, setLoad] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)

  const handleOpen = () => { 
    onOpen()
    console.log("subletData", subletData)
    console.log("dataOrder", dataOrder)
  }

  const addSubletToTheOrder = async () => {
    setLoad(true);
    try {
      const newStatus = "Armado";
      const statusUpdateResponse = await axios.put(`http://localhost:4000/orders/changeOrderState/${dataOrder.id}`, { newStatus });
      console.log(statusUpdateResponse.data);
  
      if (statusUpdateResponse.status === 200) {
        const detailOrder = {
          orderDetail: dataOrder.orderDetail,
          subletDetail: subletData.subletProductsDetail,
          newAmount: dataOrder.total + subletData.amountToBeAdded
        };
        console.log(detailOrder);
  
        const stockUpdateResponse = await axios.post(`http://localhost:4000/orders/confirmOrderAndDiscountStock/${dataOrder.id}`, { detailOrder });
        console.log(stockUpdateResponse.data);
  
        if (stockUpdateResponse.status === 200) {
          const newSubletState = await axios.put(`http://localhost:4000/sublets/updateState/${subletData.id}`);
          console.log(newSubletState.data);
  
          if (newSubletState.status === 200) {
            setSuccesMessage(true);
            setLoad(false);
            setTimeout(() => {
              updateListOfSublets()
              updateOrderList()
              closeModal();
              setSuccesMessage(false);
            }, 2800);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };

  return (
    <>
        <p className="font-medium text-xs text-green-800 cursor-pointer" onClick={handleOpen}>Anexar</p>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Confirmacion</ModalHeader>
                    <ModalBody>
                        <div className='flex flex-col items-center justify-center'>
                                <div className="flex flex-col items-start justify-start">
                                    <p className="font-medium text-sm text-green-800">¿Estas seguro de utilizar este SubAlquiler para esta orden?</p>
                                    <div className="mt-6">
                                      <p className="font-medium text-sm text-green-800">Se añadira a tu Orden: </p>
                                      {subletData.subletProductsDetail.map((sub) => (
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-zinc-600 text-sm">Articulo: {sub.productName}</p>
                                            <p className="font-medium text-zinc-600 text-sm">Cantidad: {sub.quantity}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex flex-col items-start justify-start mt-4">
                                         <p className="font-medium text-sm text-green-800">Tu orden tenia un total de: {formatePrice(dataOrder.total)}</p>
                                         <p className="font-medium text-sm text-green-800">Ahora pasara a tener un total de: {formatePrice(dataOrder.total + subletData.amountToBeAdded)}</p>
                                    </div>                                                      
                                </div>
                                <div className='flex gap-4 items-center justify-center mt-4 mb-4'>
                                    <Button className='bg-green-800 text-white font-medium text-sm' onClick={() => addSubletToTheOrder()}>Confirmar</Button>
                                    <Button className='bg-green-800 text-white font-medium text-sm'>Cancelar</Button>
                                </div>
                            </div>

                            {succesMessage ? 
                             <div className="mt-6 mb-4 flex items-center justify-center">
                               <p className="font-medium text-sm text-green-800">El Sub Alquiler fue añadido a la orden</p>
                            </div> 
                            : null}
                    </ModalBody>
                  
                    </>
                )}
                </ModalContent> 
            </Modal>
    </>
  );
}

export default AreYouSure