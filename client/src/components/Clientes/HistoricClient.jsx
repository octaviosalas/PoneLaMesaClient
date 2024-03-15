import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from "axios";
import Loading from "../Loading/Loading"

import { useState, useEffect } from "react";
import MarkDebtAsPaid from "../Modals/MarkDebtAsPaid";

const HistoricClient = ({clientData}) => {
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
        const res = await axios.get("http://localhost:4000/orders");
        const data = res.data;
        console.log(data)
        const theClientOrders = data.filter((d) => d.clientId === clientData.id)
        console.log(theClientOrders)
        const productOrderDetails = theClientOrders
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

    useEffect(() => {
      if (ordersProducts.length > 0) {
        console.log("me ejecuto")
        const firstDetail = ordersProducts[0];
        const properties = Object.keys(firstDetail);
        const filteredProperties = properties.filter(property => property !== 'productOrderDetail' && property !== 'orderId'  && property !== 'quantity');
      
        const columnLabelsMap = {
          month: 'Mes',
          year: 'Año',
          total: 'Facturacion',
          orderNumber: 'Orden',
        };
      
        const tableColumns = filteredProperties.map(property => ({
          key: property,
          label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
        }));
      
        setColumns(tableColumns);
        console.log(tableColumns);
      } else { 
        setError(true)
      }
    }, [ordersProducts]);

  return (
    <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Historico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-xl bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p  className="text-zinc-600 font-bold text-md">Historico de Pedidos</p>
                <p  className="text-zinc-600 font-medium text-sm">Cliente: {clientData.name}</p>
               {loadingData ? null :
                <div>
                    <p className="text-zinc-600 font-medium text-xs">Facturacion total:  {formatePrice(ordersProducts.reduce((acc, el) => acc + el.total, 0))}</p>
                    <p className="text-zinc-600 font-medium text-xs mt-1">Cantidad de Alquileres:  {ordersProducts.length}</p>
                      {debtorClient ? <p className="text-red-600 font-bold underline cursor-pointer text-xs mt-1" onClick={() => setViewDebt(prevState => !prevState)}>Este Cliente posee {clientDebtDetail.length} deudas</p> 
                      : 
                      <p className="text-green-800 font-medium text-xs">Este cliente no posee deudas</p>
                      }
                </div>
               }                        
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center">   
                    
              {viewDebt ? 
                <div className="flex flex-col items-start justify-start text-start w-full overflow-y-auto max-h-[200px]">
                  <h5 className="text-md font-medium text-green-800">Detalle de Deuda:</h5>
                   {clientDebtDetail.map((d) => (
                    <div className="flex flex-col items-start justify-start mt-2">
                       <p className="font-medium text-xs text-zinc-600">Tipo de deuda: Reposicion</p>
                       <p className="font-medium text-xs text-zinc-600">Monto a pagar: {formatePrice(d.amountToPay)}</p>
                       <p className="font-medium text-xs text-zinc-600">Producto Sin devolver: {d.productsMissed.map((prod) => prod.productName)}</p>
                       <p className="font-medium text-xs text-zinc-600">Cantidad: {d.productsMissed.map((prod) => prod.missing)}</p>
                       <p className="font-medium text-xs text-zinc-600">
                           Correspondiente a la orden: {d.orderCompletedData.map((ord) => ord.orderNumber)} del mes {d.orderCompletedData.map((ord) => ord.month)} del {d.orderCompletedData.map((ord) => ord.year)} 
                       </p>
                       <MarkDebtAsPaid debtId={d.debtId} completeDebtData={d} clientData={clientData}/>
                    </div>
                   ))}
                </div>
                :
                null}     

             {loadingData ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loading />
                    </div>       
                    ) : (
                      ordersProducts.length > 0 ? (
                        <div className="mt-4 flex flex-col">
                          <input type="text" className="w-72 border border-gray-200  focus:border-gray-300 focus:ring-0 rounded-lg text-sm ml-2 h-7" placeholder="Buscador.."/>                         
                          <Table                          
                           columnAutoWidth={true} 
                           columnSpacing={10}  
                           aria-label="Selection behavior table example with dynamic content"   
                           selectionBehavior={selectionBehavior} 
                           className="w-[480px] 2xl-w-[550px] flex items-center justify-center mt-2 shadow-2xl overflow-y-auto max-h-[400px] border rounded-xl">
                            <TableHeader columns={columns}>
                              {(column) => (
                                <TableColumn key={column.key} className="text-xs gap-6">
                                  {column.label}
                                </TableColumn>
                              )}
                            </TableHeader>
                            <TableBody items={ordersProducts}>
                              {(item) => (
                                <TableRow key={item.orderId}>
                                  {columns.map(column => (
                                     <TableCell key={column.key}  className='text-left' >
                                      {column.cellRenderer ? (
                                        column.cellRenderer({ row: { original: item } })
                                      ) : (
                                        (column.key === "total") ? (
                                          formatePrice(item[column.key])
                                        ) : (
                                          item[column.key]
                                        )
                                      )}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        
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


