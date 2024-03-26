import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import { useState, useEffect } from "react";
import axios from "axios";

const OrderDetail = ({orderData, collectionDetail}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
    const [viewDownPaymentData, setViewDownPaymentData] = useState(false);
    const [orderHasMissedArticles, setOrderHasMissedArticles] = useState(false);
    const [viewMissedData, setViewMissedData] = useState(false);
    const [error, setError] = useState(false);
    const [viewOrderDetail, setViewOrderDetail] = useState(false)
    const [collectionOrderDetailArticles, setCollectionOrderDetailArticles] = useState([])
    const [secondTableColumns, setSecondTableColumns] = useState([])


  useEffect(() => {
    if (orderData && orderData.detail && Array.isArray(orderData.detail) && orderData.detail.length > 0) {
      const firstDetail = orderData.detail[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== 'productId' &&  property !== 'choosenProductCategory');
  
      const columnLabelsMap = {
        productName: 'Articulo',
        quantity: 'Cantidad',
        price: 'Precio Alquiler',
        replacementPrice: 'Precio Reposicion',
        choosenProductTotalPrice: 'Monto Total',
      };
  
      const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
      }));
  
      setColumns(tableColumns);
    }
  }, [orderData]);

  const handleOpen = () => { 
    console.log(orderData)
    onOpen()
    console.log(orderData.paid)
    if(orderData.missingArticlesData.length > 0) { 
      setOrderHasMissedArticles(true)
    }
  }

  const getOrderOfCollections = async () => { 
     try {
      const getOrderData = await axios.get(`http://localhost:4000/orders/${collectionDetail.orderId}`)
      console.log(getOrderData.data)
      if(getOrderData.status === 200) { 
        console.log("status 200 confirmado")
        setCollectionOrderDetailArticles(getOrderData.data.orderDetail)
        /*setViewOrderDetail(true)
        if (getOrderData.data.orderDetail && getOrderData.data.orderDetail.length > 0) {
          const firstDetail = getOrderData.data.orderDetail[0];

          const properties = Object.keys(firstDetail);

          const filteredProperties = properties.filter(property => 
           property !== 'productId' &&  
           property !== 'choosenProductCategory' &&  
           property !== 'choosenProductTotalPrice' && 
           property !== 'price' &&  
           property !== 'replacementPrice');

          console.log(filteredProperties)

          const columnLabelsMap = {
            productName: 'Articulo',
            quantity: 'Cantidad',
          };

          console.log(collectionOrderDetailArticles)
      
          const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));

          console.log(filteredProperties.length)
          console.log(tableColumns.length)
      
          setSecondTableColumns(tableColumns);
        }*/
      }
     } catch (error) {
       console.log(error)
       setError(true)
     }
  }





  
  return (
    <>
      {orderData ? <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Detalle</p> : <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Detalle del Cobro</p>}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              {orderData ? 
               <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Detalle del Pedido</ModalHeader>
               :
               <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Detalle del Cobro</ModalHeader>
              }
             {orderData ?
              <ModalBody>
                <div className="flex flex-col text-start justify-start">
                    <p className="text-zinc-600 font-medium text-sm"><b>Pedido cargador por:</b> {orderData.creator}</p>
                    <p className="text-zinc-600 font-medium text-sm"><b>Fecha de creacion:</b> {orderData.day} de {orderData.month} de {orderData.year}</p>
                    <p className="text-zinc-600 font-medium text-sm"><b>Cliente:</b> {orderData.client}</p>

                    {orderData.downPaymentData.length > 0 && orderData.paid === false ? (
                          <p className="text-green-800 underline font-medium text-sm mt-2 cursor-pointer" onClick={() => setViewDownPaymentData(prevState => !prevState)}>Este pedido fue señado</p>
                        ) : (
                          orderData.paid === true ? (
                            <p className="text-green-800 underline font-medium text-sm mt-2 cursor-pointer">Este pedido fue abonado ✔</p>
                          ) : (
                            orderData.paid === false && orderData.downPaymentData.length === 0 ? (
                              <p className="text-green-800 underline font-medium text-sm mt-2 cursor-pointer">Este pedido se encuentra pendiente de pago</p>
                            ) : null
                          )
                        )}

                   {viewDownPaymentData ?
                    <div className="flex flex-col items-start justify-start text-start">
                     {orderData.downPaymentData.map((ord) => ( 
                       <div className="flex flex-col items-start justify-start">
                         <p className="font-medium text-zinc-600 text-sm"><b>Fecha de la Seña: </b>{ord.date}</p>
                         <p className="font-medium text-zinc-600 text-sm"><b>Cuenta Destino: </b> {ord.account}</p>
                         <p className="font-medium text-zinc-600 text-sm"><b>Monto Señado: </b> {formatePrice( ord.amount)}</p>
                       </div>
                     ))}
                    </div>
                    :
                    null
                   }


                    {orderData.orderSublets.length === 0 ? 
                    <p className="text-zinc-600 underline font-medium text-sm mt-2">Este pedido no tiene Articulos Sub Alquilados</p>
                     : null}

                    {orderData.orderSublets.length > 0 ?
                      <div className="mt-2">
                        <p className="text-green-800 underline font-medium text-sm">Este pedido contiene Articulos Sub Alquilados</p>
                          <div className="mt-2">
                           {orderData.orderSublets.map((ord) => ( 
                              <div className="flex items-center gap-2" key={ord.productId}>
                                <p className="text-sm font-medium"><b>Articulo: </b>{ord.productName}</p>
                                <p className="text-sm font-medium"><b>Cantidad: </b>{ord.quantity}</p>
                              </div>
                           ))}
                          </div> 
                      </div>
                    : null}

                    {orderHasMissedArticles ? <p  className="text-green-800 underline font-medium text-sm mt-2" onClick={() => setViewMissedData(true)}>Este pedido tiene Articulos sin Devolver </p> : null}
                    
                </div>
                   <Table aria-label="Example table with dynamic content" className="w-full shadow-xl flex items-center justify-center mt-2">
                              <TableHeader columns={columns} className="">
                                {(column) => (
                                  <TableColumn key={column.key} className="text-xs gap-6">
                                    {column.label}
                                  </TableColumn>
                                )}
                              </TableHeader>
                              <TableBody items={orderData.detail}>
                              {(item) => (
                                <TableRow key={item.productName}>
                                  {columns.map(column => (
                                   <TableCell key={column.key} className="text-start items-start">
                                   {column.cellRenderer ? (
                                       column.cellRenderer({ row: { original: item } })
                                     ) : (
                                       (column.key === "price" || 
                                        column.key === "replacementPrice" ||
                                        column.key === "choosenProductTotalPrice" ) ? (
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
                        <div className="flex flex-col items-end justify-end">
                           <p className="text-sm text-zinc-600 font-bold">Valor total del Pedido: {formatePrice(orderData.total)} </p>
                           {orderData.orderSublets.length > 0 ? <p className="text-xs text-green-800 font-medium"> (La suma total Incluye los SubAlquileres)</p> : null}
                        </div>        
              </ModalBody>
               :
              <div className="flex flex-col items-start justify-start text-start w-[500px] ml-6">
                  <p className="text-sm font-medium text-zinc-600"><b>Cargado por: </b> {collectionDetail.loadedBy}</p>
                  <p  className="text-sm font-medium text-zinc-600"><b>Fecha de Cobro: </b>{collectionDetail.day} de {collectionDetail.month} del {collectionDetail.year}</p>
                  <p className="text-sm font-medium text-zinc-600"><b>Monto Cobrado:</b>{formatePrice(collectionDetail.amount)}</p>
                  {collectionDetail.account === "Efectivo" ? 
                     <p className="text-sm font-medium text-zinc-600"><b>Pago realizado en : </b> {collectionDetail.account}</p> : 
                     <p className="text-sm font-medium text-zinc-600"><b>Pago realizado en :  </b> {collectionDetail.account}</p>
                   }
              </div>      
               }
              <ModalFooter className="flex items-center justify-center mt-2">
               {orderData ? 
               <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onPress={onClose}> Cerrar </Button> 
                : 
                <div className="flex items-center justify-center gap-4">
                    {viewOrderDetail === false ?
                        <div className="gap-4 flex items-center">
                          <Button className="bg-green-800 text-white font-medium w-72" onClick={() => getOrderOfCollections()}>Ver Orden Correspondiente</Button>
                          <Button className="bg-green-800 text-white font-medium w-72">Cerrar</Button> 
                        </div> 
                    : null}
                </div>
               }

               {viewOrderDetail === true ? 
                  <div>
                     {collectionOrderDetailArticles.length > 0 ?
                      <Table aria-label="Example table with dynamic content" className="w-full shadow-xl flex items-center justify-center mt-2">
                              <TableHeader columns={secondTableColumns} className="">
                                {(column) => (
                                  <TableColumn key={column.key} className="text-xs gap-6">
                                    {column.label}
                                  </TableColumn>
                                )}
                              </TableHeader>
                              <TableBody items={collectionOrderDetailArticles}>
                              {(item) => (
                                <TableRow key={item.productName}>
                                  {columns.map(column => (
                                   <TableCell key={column.key} className="text-start items-start">
                                   {column.cellRenderer ? (
                                       column.cellRenderer({ row: { original: item } })
                                     ) : (
                                       (column.key === "price" || 
                                        column.key === "replacementPrice" ||
                                        column.key === "choosenProductTotalPrice" ) ? (
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
                        </Table> : <p>aa</p>}
                  </div>
                  :
                  null
                }
           
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default OrderDetail

