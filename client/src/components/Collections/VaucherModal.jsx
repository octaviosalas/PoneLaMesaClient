import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import Loading from "../Loading/Loading";
import axios from "axios";
import { formatePrice } from "../../functions/gralFunctions";

const VaucherModal = ({showingOn, detail, orderId}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [load, setLoad] = useState(false)
  const [orderData, setOrderData] = useState({})

  const handleOpen = () => { 
    console.log(orderId)
    console.log("DETALLE", detail)
    onOpen()
    if(showingOn !== "table") { 
      getDataOfCollectionOrder()
      console.log(orderData.length)
    }
  }

  useEffect(() => { 
    console.log(orderData)
  }, [orderData])


  const getDataOfCollectionOrder = async () => { 
   try {
        const response = await axios.get(`http://localhost:4000/collections/getByOrderId/${orderId}`)
        const data = await response.data
        console.log(data)
        if(data) { 
          setOrderData(data)
          setTimeout(() => { 
            setLoad(false)
          }, 1500)
        }
   } catch (error) {
      console.log(error)
      setLoad(false)
   }
  }

  return (
    <>
      {
      showingOn === "table" ? <p className="font-medium text-green-700 text-xs" onClick={handleOpen}>Ver Comprobante</p>
       :
      <p className="font-medium text-zinc-600 text-sm underline cursor-pointer"  onClick={handleOpen}>Este pedido se encuentra Abonado</p>
      }
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Comprobante de Pago</ModalHeader>         
                <ModalBody className="flex items-center jsutify-center">
                {showingOn === "table" ? (
                    <div className="m-2">
                      <img src={detail.voucher} className="w-72 h-72 rounded-2xl"/>
                    </div>
                  ) : ( 
                    load ? (
                      <Loading />
                    ) : ( 
                      <div className="flex flex-col items-start justify-start">
                          <div className="flex flex-col items-start justify-start">
                            <p className="font-medium text-sm text-zinc-600">El cobro del pedido fue cargado por {orderData.loadedBy}</p>
                            <p className="font-medium text-sm text-zinc-600">Se cargo el cobro el dia {orderData.day} de {orderData.month} del {orderData.year}</p>
                            <p className="font-medium text-sm text-zinc-600">La cuenta destino fue: {orderData.account}</p>
                            <p className="font-medium text-sm text-zinc-600">Monto Cobrado: {formatePrice(orderData.amount)}</p>
                          </div>
                         {orderData.account !== "Efectivo" ?
                          <div className="mt-4">
                            <img src={orderData.voucher} className="w-72 h-36 rounded-lg"/>
                          </div> : 
                          <div className="flex flex-col items-center justify-center">
                             <p className="font-medium text-sm text-green-800 mt-6 mb-4">El pago se realizo en efectivo</p>
                          </div>
                          }
                      </div>
                     
                    )
                  )}
                                  </ModalBody>            
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default VaucherModal