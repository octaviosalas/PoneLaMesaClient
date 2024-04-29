import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from "axios";
import Loading from "../Loading/Loading"
import { useState, useEffect } from "react";
import MarkDebtAsPaid from "../Modals/MarkDebtAsPaid";
import ClientHistoricOrdersTable from "./ClientHistoricOrdersTable";
import { Card } from '@tremor/react';

const HistoricClient = ({clientData, updateClientData}) => {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
    const [ordersProducts, setOrdersProducts] = useState([])
    const [error, setError] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [debtorClient, setDebtorClient] = useState(false)
    const [viewDebt, setViewDebt] = useState(false)
    const [clientDebtDetail, setClientDebtDetail] = useState([])

    const handleOpen = async () => { 
      onOpen();
      await getProductOrders();
      console.log(clientData)
    }

    const getProductOrders = async () => { 
      try {
        const res = await axios.get(`http://localhost:4000/orders/getByClient/${clientData.id}`);
        const data = res.data;
        console.log(data)
    
        const productOrderDetails = data
           .map((ord) => {
            return {
              orderId: ord._id,
              orderNumber: ord.orderNumber,
              month: ord.month,
              year: ord.year,
              productOrderDetail: ord.orderDetail,
              total: ord.total
            };
          })
          .filter((result) => result.productOrderDetail.length > 0);   
        if (productOrderDetails.length !== 0) { 
          setOrdersProducts(productOrderDetails);
          const response = axios.get(`http://localhost:4000/clients/${clientData.id}`)
          const data = await response
          const finalClientData = data.data
          console.log(finalClientData.clientDebt)
          const verifyDebt = finalClientData.clientDebt.some((s) => s.paid === false)
          console.log(verifyDebt)
          if(verifyDebt === true) { 
            setDebtorClient(true)
            const filterUnpaidDebts = finalClientData.clientDebt.filter((debt) => debt.paid === false)
            setClientDebtDetail(filterUnpaidDebts)
            console.log(filterUnpaidDebts)
          } else { 
            setDebtorClient(false)
          }
        } else { 
          setError(true);
        }
        setTimeout(() => { 
          setLoadingData(false)
        }, 2000)
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };


    const closeModalWhenMarktTheDebtAsPaid = () => { 
      onClose()
      setViewDebt(false)
    }

  return (
    <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Historico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"><p  className="text-zinc-600 font-bold text-md">Historico de Pedidos</p>
           {loadingData ? null :
                <div>
                    <Card className="mx-auto h-auto w-[550px] 2xl:[650px] mt-4" decoration="top"  decorationColor="green-800" >                   
                        <div className='flex justify-between items-center mt-4'>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Cliente</p>
                              <p className='font-medium text-xl text-black'>{clientData.name}</p>
                          </div>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Facturacion Total:</p>
                              <p className='font-medium text-xl text-black'>{formatePrice(ordersProducts.reduce((acc, el) => acc + el.total, 0))}</p>
                          </div>
                            <div className='flex flex-col items-center justify-enter'>
                                <p className='text-zinc-500 text-xs font-medium'>Cantidad de Alquileres:</p>
                                <p className='font-medium text-xl text-black'>{ordersProducts.length}</p>
                            </div>
                        </div>
                    </Card>
                   
                      {debtorClient ?
                      <div className="flex flex-col items-start justify-start ">
                         <p className="text-white bg-red-500 font-medium text-sm mt-4">Este Cliente posee {clientDebtDetail.length} deudas</p> 
                         <p className="text-red-600 cursor-pointer text-xs" onClick={onClose}>Para verlas en detalle, ingresa en su estado de cuenta.</p> 
                      </div>
                      : 
                      <p className="text-green-800 font-medium text-xs">Este cliente no posee deudas</p>
                      }
                </div>
               }                        
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center">   
                    
             

             {loadingData ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loading />
                    </div>       
                    ) : (
                      ordersProducts.length > 0 ? (
                        <div className="flex flex-col">
                          <ClientHistoricOrdersTable ordersProducts={ordersProducts}/>                  
                        </div>
                      ) : (
                        <div className="flex flex-col items-cemnter justify-center">
                           <p className="font-medium text-zinc-600 text-sm">Al momento no se han registrado pedidos de este Cliente</p>
                        </div>

                      )
                    )}
          
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-2">
                <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onPress={onClose}> Cerrar </Button>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default HistoricClient


