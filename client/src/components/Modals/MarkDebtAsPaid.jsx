import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import { formatePrice, getDate, getDay, getMonth, getYear } from "../../functions/gralFunctions";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import PostPaymentReplacement from "../Returns/PostPaymentReplacement";

const MarkDebtAsPaid = ({debtId, clientData, completeDebtData, debtAmount, updateClientData, closeModal, type}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const userCtx = useContext(UserContext)
  const [orderId, setOrderId] = useState("")
  const [completeOrderOfTheDebt, setCompleteOrderOfTheDebt] = useState([])
  const [actualDate, setActualDate] = useState(getDate())
  const [actualDay, setActualDay] = useState(getDay())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())
  const [account, setAccount] = useState("")
  const [payImage, setPayImage] = useState("")
  const [secondStep, setSecondStep] = useState(false)


  const handleOpen = () => { 
    console.log("id de deuda", debtId)
    console.log("datos cleinte", clientData)
    console.log("monto deuda", debtAmount)
    console.log("datos enteros", completeDebtData)
    console.log("BACKEND", completeDebtData.detail)
    const getOrderIdOfTheDebt = completeDebtData.orderCompletedData.map((d) => d._id)[0]
    const getOrderCompleted = completeDebtData.orderCompletedData
    setCompleteOrderOfTheDebt(getOrderCompleted)
    setOrderId(getOrderIdOfTheDebt)
    onOpen()
    console.log(debtAmount)
  }

  const comeBack = () => { 
    setSecondStep(false)
  }


  return (
    <>
      {type === "pendingReplacements" ? <Button className="bg-green-800 text-white font-medium text-sm w-56" onClick={handleOpen}>Asentar Pago</Button>
      :  
      <p className="underline text-xs text-green-800 font-medium cursor-pointer" onClick={handleOpen}>Asentar pago</p>}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Asentar pago de Deuda</ModalHeader>
              <ModalBody>
                 {secondStep === false ?
                  <div className="flex gap-4 items-center justify-center mb-4">
                     <Button className="text-white font-medium bg-green-800 w-60" onClick={() => setSecondStep()}>Confirmar</Button>
                     <Button className="text-white font-medium bg-green-800 w-60" onPress={onClose}>Cancelar</Button>
                  </div>
                  :
                  <div>
                    <PostPaymentReplacement 
                      updateClientData={updateClientData}
                      completeDebtData={completeDebtData}
                      comeBack={comeBack} 
                      orderId={orderId}
                      debtId={debtId} 
                      clientId={clientData.id} 
                      clientName={clientData.name} 
                      orderDetail={completeOrderOfTheDebt} 
                      debtAmount={debtAmount}
                      closeModal={closeModal}/>
                  </div>
                 }
              </ModalBody>           
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MarkDebtAsPaid