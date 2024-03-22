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
    onOpen()
    if(showingOn !== "table") { 
      getDataOfCollectionOrder()
    }
  }

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
      showingOn === "table" ? <p className="font-medium text-green-700 text-xs cursor-pointer" onClick={handleOpen}>Ver Comprobante</p>
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
                      {detail.voucher === "" ?
                       <p className="font-medium text-sm text-zinc-600">No se ha cargado un Comprobante de Pago</p> 
                       : 
                       <div className="flex flex-col items-center justify-center w-full ">
                         <img src={detail.voucher} className="w-72 h-72 rounded-2xl "/>
                       </div>}
                    </div>
                  ) : ( 
                    load ? (
                      <Loading />
                    ) : ( 
                      <div className="flex flex-col items-start justify-start">
                          <div className="flex flex-col items-start justify-start">
                            <p className="font-medium text-sm text-zinc-600"><b>Cargado por: </b> {orderData.loadedBy}</p>
                            <p className="font-medium text-sm text-zinc-600"><b>Fecha de Cobro: </b> {orderData.day} de {orderData.month} del {orderData.year}</p>
                            <p className="font-medium text-sm text-zinc-600"><b>Cuenta: </b>{orderData.account}</p>
                            <p className="font-medium text-sm text-zinc-600"><b>Monto: </b>{formatePrice(orderData.amount)}</p>
                          </div>
                          {orderData.account !== "Efectivo" ? (
                              <div className="mt-4">
                                {orderData.voucher === "" ? (
                                  <p className="font-sm font-medium text-zinc-600">No Subiste un Comprobante</p>
                                ) : (
                                  <img src={orderData.voucher} className="w-72 h-36 rounded-lg"/>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <p className="font-medium text-sm text-green-800 mt-6 mb-4">El pago se realizó en efectivo</p>
                              </div>
                            )}
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