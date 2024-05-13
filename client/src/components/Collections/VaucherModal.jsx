import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import Loading from "../Loading/Loading";
import axios from "axios";
import { formatePrice } from "../../functions/gralFunctions";


const VaucherModal = ({showingOn, detail, orderId}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [load, setLoad] = useState(false)
  const [orderData, setOrderData] = useState({})

  const handleOpen = () => { 
    onOpen()
    if(showingOn !== "table") { 
      getDataOfCollectionOrder()
    } else { 
      setTimeout(() => { 
        setLoad(true)
      }, 2000)
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
                         <div className="flex flex-col items-center justify-center w-full">
                            <p className="font-medium text-sm text-white bg-red-600 w-full text-center">No se ha cargado un Comprobante de Pago</p> 
                            <Button className="bg-green-800 text-white font-medium w-72 mt-4 mb-2" onClick={() => onClose()}>Cerrar</Button>       
                         </div>
                       : 
                       <div className="flex flex-col items-center justify-center w-full ">
                         {load && detail.voucher.length > 0 ?  <img src={detail.voucher} className="w-72 h-72 rounded-2xl "/> : <Loading/>}
                      
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