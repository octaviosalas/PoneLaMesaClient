import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import { formatePrice, getDate, getDay, getMonth } from "../../functions/gralFunctions";

/* 
1- añadir cobro al modelo.
2- pasar a true la propiedad paid de la deuda del cliente.
3- pasar a true la propiedad paid en missingArticles en la orden.
*/

const MarkDebtAsPaid = ({debtId, clientData, completeDebtData}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [orderId, setOrderId] = useState("")
  const [completeOrderOfTheDebt, setCompleteOrderOfTheDebt] = useState([])
  const [actualDate, setActualDate] = (getDate())
  const [actualDay, setActualDay] = (getDay())
  const [actualMonth, setActualMonth] = (getMonth())


  const handleOpen = () => { 
    console.log(debtId)
    console.log(clientData)
    const getOrderIdOfTheDebt = completeDebtData.orderCompletedData.map((d) => d._id)[0]
    const getOrderCompleted = completeDebtData.orderCompletedData
    setCompleteOrderOfTheDebt(getOrderCompleted)
    setOrderId(getOrderIdOfTheDebt)
    onOpen()
  }

  /*const updateDebtToPaid = async () => { 
     try {
        const collecctionData = ({ 
            orderId: orderId,
            collectionType:"replacement",
            client: clientData.name,
            orderDetail: completeOrderOfTheDebt,
            date: actualDate,
            day: day,
            month: month,
            year: year,
            amount: orderData.total,
            account: account,
            loadedBy: userCtx.userName,
            voucher: payImage
          })
        const response = await axios.post("http://localhost:4000/collections/addNewCollection/")
     } catch (error) {
        
     }
  }
*/
  return (
    <>
      <p className="underline text-xs text-green-800 font-medium" onClick={handleOpen}>Asentar pago</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Asentar pago de Deuda</ModalHeader>
              <ModalBody>
                  <div className="flex gap-4 items-center justify-center mb-4">
                     <Button className="text-white font-medium bg-green-800">Confirmar</Button>
                     <Button className="text-white font-medium bg-green-800">Cancelar</Button>
                  </div>
              </ModalBody>           
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MarkDebtAsPaid