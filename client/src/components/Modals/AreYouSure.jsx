import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

const AreYouSure = ({subletData, dataOrder, closeModal, updateListOfSublets, updateOrderList})  => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [load, setLoad] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)

  const handleOpen = () => { 
    onOpen()
    console.log(subletData)
  }

  const addSubletToTheOrder = async () => {
    setLoad(true);
    try {
      const newStatus = "Armado";
      const statusUpdateResponse = await axios.put(`http://localhost:4000/orders/changeOrderState/${dataOrder.id}`, { newStatus });
      console.log(statusUpdateResponse.data);
  
      if (statusUpdateResponse.status === 200) {
        const detailOrder = {
          orderDetail: subletData.subletProductsDetail,
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
                                <div>
                                    <p className="font-medium text-sm text-green-800">¿Estas seguro de utilizar este SubAlquiler para esta orden?</p>
                                    {subletData.id}
                                    {dataOrder.id}
                                    {subletData.amountToBeAdded}
                                    <div>
                                    <p>aca:{dataOrder.total} </p> 
                                    </div>
                            

                                </div>
                                <div className='flex gap-4 items-center justify-center mt-4 mb-4'>
                                    <Button className='bg-green-800 text-white font-medium text-sm' onClick={() => addSubletToTheOrder()}>Confirmar</Button>
                                    <Button className='bg-green-800 text-white font-medium text-sm'>Cancelar</Button>
                                </div>
                            </div>

                            {succesMessage ? 
                             <div className="mt-6 mb-4 flex items-center jsutify-center">
                               <p className="font-medium text-sm text-green-800">Salio bien</p>
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