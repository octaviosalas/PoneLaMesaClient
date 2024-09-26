
import React, {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from 'axios';
import {  getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";


const PayReplacementFree = ({item, updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [actualDate, setActualDate] = useState(getDate())
  const [actualDay, setActualDay] = useState(getDay())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())

  const userCtx = useContext(UserContext)

  const handleOpen = () => { 
    onOpen()
    console.log("ITEM", item)
  }

  const deleteReplacement = async () => { 
    const productsToUpdateStock = ({ 
      products: item.detail,
      collectionData: { 
        orderId: item.orderCompletedData[0]._id,
        collectionType:"Reposicion",
        paymentReferenceId: item.debtId,
        client: item.clientData.name,
        orderDetail: item.orderCompletedData,
        date: actualDate,
        day: actualDay,
        month: actualMonth,
        year: actualYear,
        amount: 0,
        account: "",
        loadedBy: userCtx.userName,
        productsReplacementDetail: item.detail,
        voucher: ""
      }
     
    })
    try {
        const response = await axios.post(`http://localhost:4000/clients/cancelDebt/${item.clientData.id}/${item.debtId}`, productsToUpdateStock)
        console.log(response.data)
        updateList()
        onClose()
    } catch (error) {
        console.log(error)
    }
}

  return (
    <>
  
      <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={handleOpen}>Asentar </p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Hacer atencion al cliente</ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center">
                  <p className="font-medium text-black text-md">Valor de la reposicion: {formatePrice(item.amountToPay)}</p> 
              </ModalBody>
                <ModalFooter className="flex items-center justify-center gap-4">
                        <Button className="bg-green-800 text-white font-medium" onPress={() => deleteReplacement()}>
                           Confirmar
                        </Button>
                        <Button className="bg-green-800 text-white font-medium" onPress={onClose}>
                            Cancelar
                        </Button>
                </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default PayReplacementFree