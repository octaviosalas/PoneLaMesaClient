import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";

const ChangeSomeOrderState = ({orders, update, cleanItems}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [show, setShow] = useState(false);
  const [statusSelected, setStatusSelected] = useState(false);
  const [newStatusSelected, setNewStatusSelected] = useState(false);
  const [size, SetSize] = useState("2xl");

        const checkStatus = (orders) => {
            const areAllStatusesEqual = orders.every(order => order.orderStatus === orders[0].orderStatus);
            setShow(areAllStatusesEqual);
            if(areAllStatusesEqual) { 
                const statusChoosen = orders[0].orderStatus
                setStatusSelected(statusChoosen)
                if(statusChoosen === "Armado") { 
                    setNewStatusSelected("Entregado")
                }
            }  
        };

        const handleOpen = () => { 
            onOpen()
            checkStatus(orders)
        }

        const changeState = async () => { 
            const ordersSelected = orders
            console.log(ordersSelected)
            try {
                const {data, status} = await axios.post(`http://localhost:4000/orders/updateSomeOrdersStates`, ordersSelected)
                if(status === 200) { 
                    cleanItems()
                    onClose()
                    update("everyOrders")
                }
            } catch (error) {
                console.log(error)
            }
        }

  return (
    <>
      <Button onPress={handleOpen} className='bg-green-800 text-white font-medium'>Cambiar Estado</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modificar estados</ModalHeader>
              <ModalBody>
                  <div className="flex flex-col items-center justify-center">
                    {!show ? 
                       <div>
                          <p className="bg-red-600 text-white">Para modificar el estado de multiples pedidos a la vez, todos deben tener el mismo estado</p>
                       </div> 
                        : 
                       <div>
                            {statusSelected === "Armado" ? 
                               <div className="flex flex-col items-center justify-center">
                                   <p className="font-medium">Seleccionaste {orders.length} pedidos con estado en "{statusSelected}"</p>
                                   <p>Seran pasados al estado "Entregado"</p>
                                    <div className="flex items-center justify-center gap-4 mt-4 mb-2">
                                        <Button  className='bg-green-800 text-white font-medium' onClick={() => changeState()}>Confirmar</Button>
                                        <Button onPress={onClose} className='bg-green-800 text-white font-medium'>Cancelar</Button>
                                    </div>
                               </div> : 
                               <div className="w-full flex flex-col items-center justify-center">
                                  <p className="font-medium">Los pedidos con estado en "{statusSelected}" deben ser modificados manualmente</p>
                                  <Button onPress={onClose} className='bg-green-800 text-white font-medium mt-6 mb-2 w-72' onClick={() =>   cleanItems()()}>Cerrar</Button>
                               </div>
                            }
                       </div> 
                    }
                  </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default ChangeSomeOrderState