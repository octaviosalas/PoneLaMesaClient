import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderDetailInCollectionDetail from "../Collections/OrderDetailInCollectionDetail";
import ShowParcialPayment from "./ShowParcialPayment";

const OrderDetail = ({orderData, collectionDetail, update}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
    const [viewDownPaymentData, setViewDownPaymentData] = useState(false);
    const [orderHasMissedArticles, setOrderHasMissedArticles] = useState(false);
    const [viewMissedData, setViewMissedData] = useState(false);
    const [error, setError] = useState(false);
    const [viewOrderDetail, setViewOrderDetail] = useState(false)
    const [collectionOrderDetailArticles, setCollectionOrderDetailArticles] = useState([])
    const [collectionOrderDetail, setCollectionOrderDetail] = useState([])
    const [missedArticlesDetail, setMissedArticlesDetail] = useState([])
    const [deleteDownPaymentSuccesMessage, setDeleteDownPaymentSuccesMessage] = useState(false)
    
    const navigate = useNavigate()

    const redirectToPage = (item) => { 
      navigate(`/${item}`)
    }

    const getOrderOfCollections = async () => { 
        console.log(collectionDetail)
        try {
          const getOrderData = await axios.get(`http://localhost:4000/orders/${collectionDetail.orderId}`)
          console.log(getOrderData.data.orderDetail)
          if(getOrderData.status === 200) { 
             setCollectionOrderDetailArticles(getOrderData.data.orderDetail)
             setCollectionOrderDetail(getOrderData.data)
          }
         } catch (error) {
           console.log(error)
           setError(true)
         }        
    }

   const createTable = (orderData) => { 
    console.log("SHIPPINGCOST", orderData.shippingCost)
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
   }

    const handleOpen = () => { 
      console.log(orderData)
      console.log(orderData.downPaymentData)

      onOpen()
      console.log(orderData.paid)
      createTable(orderData)
      if(orderData.missingArticlesData.length > 0) { 
        setOrderHasMissedArticles(true)
        console.log("ACACACACA", orderData.missingArticlesData)
        console.log(orderData.missingArticlesData.map((ord) => ord.missedProductsData).map((a) => a.productMissed).flat())
        setMissedArticlesDetail(orderData.missingArticlesData.map((ord) => ord.missedProductsData).map((a) => a.productMissed).flat())
      }
    }

    const handleOpenCollectionsDetail = () => { 
      getOrderOfCollections()
      onOpen()
    }

    const closeCollectionOrderDetail = () => { 
      setViewOrderDetail(false)
    }

  
  const createNewPdf = async (data) => { 
         console.log("Data que recibo para imprimir orden!", data)
         console.log(data)       
            const articulos = data.detail.map((detail) => { 
              return { 
                articulo: detail.productName,
                cantidad: detail.quantity,
                total:  detail.choosenProductTotalPrice,
                reposicion: detail.replacementPrice,
              }
            })
    
            const result = { 
              cliente: data.client,
              total: formatePrice(data.total),
              articles: articulos,
              envio: data.shippingCost,
              seña: data.downPaymentData,
              pago: data.paid,
              lugarDeEntrega: data.placeOfDelivery
            }

          console.log("Esto recibe el backend", result)
          try {
              const response = await axios.post("http://localhost:4000/orders/createDetailPdf", {result}, {
                  responseType: 'blob',
              });
              const blob = new Blob([response.data], { type: 'application/pdf' });      
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = 'archivo.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } catch (error) {
              console.log(error);
          } 
  };
  
  const deleteDownPayment = async () => { 
    const downPaymentReference = orderData.downPaymentData.map((ord) => ord.downPaymentId)[0]
    try {
      const deleteDownPaymentData = await axios.delete(`http://localhost:4000/orders/deleteDownPayment/${orderData.id}`, { data: { downPaymentReference } })
      if(deleteDownPaymentData.status === 200) { 
        setDeleteDownPaymentSuccesMessage(true)
        setTimeout(() => { 
          setDeleteDownPaymentSuccesMessage(false)
          onClose()
          update()
        }, 2100)
      }
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <>
      {orderData ?
       <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Detalle</p> :
       <p onClick={handleOpenCollectionsDetail} className="text-green-700 font-medium text-xs cursor-pointer">Detalle del Cobro</p>}
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
                    <p className="text-zinc-600 font-medium text-md"><b>Pedido cargador por:</b> {orderData.creator}</p>
                    <p className="text-zinc-600 font-medium text-md"><b>Fecha de creacion:</b> {orderData.day} de {orderData.month} de {orderData.year}</p>
                    <p className="text-zinc-600 font-medium text-md"><b>Fecha de Entrega:</b> {orderData.dateOfDelivery}</p>
                    <p className="text-zinc-600 font-medium text-md"><b>Cliente:</b> {orderData.client}</p>
                    {orderData.shippingCost !== undefined ? <p className="text-zinc-600 font-medium text-md"><b>Costo de Envio:</b> {formatePrice(orderData.shippingCost)} </p> : null}

                    {orderData.downPaymentData.length > 0 && orderData.paid === false && (orderData.parcialPayment?.length ?? 0) === 0 ? (
                      <p className="text-green-800 underline font-medium text-md mt-2 cursor-pointer" onClick={() => setViewDownPaymentData(prevState => !prevState)}>Este pedido fue señado</p>
                    ) : orderData.paid === true ? (
                      <p className="text-white bg-green-800 w-full text-center font-medium text-md mt-2 cursor-pointer">Este pedido fue abonado ✔</p>
                    ) : orderData.paid === false && orderData.downPaymentData.length === 0 && (orderData.parcialPayment?.length ?? 0) === 0 ? (
                      <p className="text-white bg-red-500 font-medium text-md mt-2 cursor-pointer">Este pedido se encuentra pendiente de pago</p>
                    ) : (orderData.parcialPayment?.length ?? 0) > 0 && orderData.paid !== true ? (
                      <ShowParcialPayment orderData={orderData} update={update}/>
                    ) : orderData.downPaymentData.length > 0 && orderData.paid === false && (orderData.parcialPayment?.length ?? 0) > 0 ? (
                      <div>
                        <p className="text-green-800 underline font-medium text-md mt-2 cursor-pointer" onClick={() => setViewDownPaymentData(prevState => !prevState)}>Este pedido fue señado</p>
                        <ShowParcialPayment orderData={orderData} update={update}/>
                      </div>
                    ) : null}

                   {viewDownPaymentData ?
                    <div className="flex flex-col items-start justify-start text-start">
                     {orderData.downPaymentData.map((ord) => ( 
                       <div className="flex flex-col items-start justify-start">
                         <p className="font-medium text-zinc-600 text-sm"><b>Fecha de la Seña: </b>{ord.date}</p>
                         <p className="font-medium text-zinc-600 text-sm"><b>Cuenta Destino: </b> {ord.account}</p>
                         <p className="font-medium text-zinc-600 text-sm"><b>Monto Señado: </b> {formatePrice( ord.amount)}</p>
                         <Button className="bg-red-500 font-medium text-white w-36 text-xs h-7 mt-1" onClick={() => deleteDownPayment()}>Eliminar Seña</Button>
                       </div>
                     ))}
                    </div>
                    :
                    null
                   }

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
                    {orderHasMissedArticles ? <p  className="text-red-500 underline font-medium text-sm cursor-pointer mt-4" onClick={() => setViewMissedData(prevState => !prevState)}>Se registraron Faltantes en este Pedido </p> : null}
                    {viewMissedData ? 
                    <div>
                       {missedArticlesDetail.map((p) => ( 
                        <div className="flex items-center gap-4">
                           <p className="text-sm font-medium text-zinc-600">Articulo: {p.productName}</p>
                           <p className="text-sm font-medium text-zinc-600">Cantidad Faltante: {p.missedQuantity}</p>
                        </div>
                       ))}
                    </div> : null}
                    
                    
                </div>
                   <Table aria-label="Example table with dynamic content" className="w-full shadow-xl flex items-center justify-center mt-2 max-h-[200px] 2xl:max-h-[350px] overlfow-y-auto">
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
                  <p className="text-md font-medium text-zinc-600"><b>Cargado por: </b> {collectionDetail.loadedBy}</p>
                  <p  className="text-md font-medium text-zinc-600"><b>Fecha: </b>{collectionDetail.day} de {collectionDetail.month} del {collectionDetail.year}</p>
                  <p className="text-md font-medium text-zinc-600"><b>Monto: </b>{formatePrice(collectionDetail.amount)}</p>
                  {collectionDetail.account === "Efectivo" ? 
                     <p className="text-md font-medium text-zinc-600"><b>Cuenta: </b> {collectionDetail.account}</p> : 
                     <p className="text-md font-medium text-zinc-600"><b>Cuenta:  </b> {collectionDetail.account}</p>
                   }
              </div>      
               }
              <ModalFooter className="flex items-center justify-center mt-2">

               {orderData ? 

               <div className="flex flex-col items-center jsutify-center">

                  <div className="flex gap-4 items-center">
                    <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onPress={onClose}> Cerrar </Button> 
                    <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onClick={() => createNewPdf(orderData)}> Imprimir </Button> 
                  </div>

                  {deleteDownPaymentSuccesMessage ? 
                  <div className="flex items-center jsutify-center mt-2 mb-2">
                    <p className="text-green-800 font-medium text-sm">Seña eliminada con exito</p>
                  </div> 
                  : null}

               </div>
               
                : 
              
                <div className="flex items-center justify-center gap-4">
                    {viewOrderDetail === false ?
                        <div className="gap-4 flex items-center">
                          <Button className="bg-green-800 text-white font-medium w-72" onClick={() => setViewOrderDetail(true)}>Ver Orden Correspondiente</Button>
                          <Button className="bg-green-800 text-white font-medium w-72" onPress={onClose}>Cerrar</Button> 
                        </div> 
                    :  
                      <OrderDetailInCollectionDetail closeDetail={closeCollectionOrderDetail} orderDetail={collectionOrderDetail} orderDetailData={collectionOrderDetailArticles}/>
                    }
                </div>
                             
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


/*
import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate()

    const redirectToPage = (item) => { 
      navigate(`/${item}`)
    }

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
         setViewOrderDetail(true)
         setCollectionOrderDetailArticles(getOrderData.data)
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
                <> 
                <div className="flex items-center justify-center gap-4">
                    {viewOrderDetail === false ?
                        <div className="gap-4 flex items-center">
                          <Button className="bg-green-800 text-white font-medium w-72" onClick={() => getOrderOfCollections()}>Ver Orden Correspondiente</Button>
                          <Button className="bg-green-800 text-white font-medium w-72">Cerrar</Button> 
                        </div> 
                    :  null}
                </div>
                 {viewOrderDetail === true ?
                    <div className="flex flex-col items-start justify-start text-start w-full">
                          <h5 className="text-sm font-bold text-zinc-700">Detalle de la orden:</h5>
                          <li className="flex flex-col items-start justify-start">
                            <ul className="text-sm font-medium text-zinc-700"><b>Numero de Orden:</b> {collectionOrderDetailArticles.orderNumber}</ul>
                            <ul className="text-sm font-medium text-zinc-700"><b>Cliente:</b>  {collectionOrderDetailArticles.client}</ul>
                            <ul className="text-sm font-medium text-zinc-700"><b>Mes:</b>  {collectionOrderDetailArticles.month}</ul>
                            <ul className="text-sm font-medium text-zinc-700"><b>Año:</b> : {collectionOrderDetailArticles.year}</ul>
                            <div className="flex items-center justify-center gap-4 mt-4 mtb-2">
                                <Button className="bg-green-800 text-white font-medium text-sm w-52" onClick={() => redirectToPage("pedidos")}>Ir a pedidos</Button>
                                <Button className="bg-green-800 text-white font-medium text-sm w-52" onClick={() => setViewOrderDetail(false)}>Cerrar</Button>
                            </div>

                          </li>
                      </div> : null}
                 </>
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



*/