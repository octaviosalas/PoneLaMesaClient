import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import { useState, useEffect } from "react";

const CleaningDetail = ({orderData}) => {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
    const [orderHasMissedProducts, setOrderHasMissedProducts] = useState(false)
    const [viewMissedProducts, setViewMissedProducts] = useState(false)
    const [productsMissedDetail, setProductsMissedDetail] = useState([])
    const [productsToWashDetail, setProductsToWashDetail] = useState([])

    const handleOpen = () => { 
      onOpen()
      console.log("orden original", orderData)
      console.log("DETALLE DE LA ORDEN ORIGINAL", orderData.detail)
      const missed = orderData.missedArticles.map((miss) => miss.missedProductsData)
      if(missed.length > 0) { 
        console.log("encontre missed products")
        setOrderHasMissedProducts(true)
        const missedDetail = missed.flatMap((m) => m.productMissed);
        setProductsMissedDetail(missedDetail)
        console.log("ARRAY DE PRODUCTOS FALTANTES: ", missedDetail)
        console.log("ARRAY QUE DEVUELVE LA FUNCION", getTheRealOrderToWash(orderData.detail, missedDetail))
      }
      console.log(missed)
    }

    useEffect(() => {
        if (orderData && orderData.detail && Array.isArray(orderData.detail) && orderData.detail.length > 0) {
           if(orderHasMissedProducts) { 
            console.log("hay missed produts")
                const firstDetail = productsToWashDetail[0];
                const properties = Object.keys(firstDetail);
                const filteredProperties = properties.filter(property => property !== 'productId' );
                const columnLabelsMap = {
                  cantidadLavado: 'Cantidad para Lavado',
                  producto: 'Articulo',
                };
                const tableColumns = filteredProperties.map(property => ({
                  key: property,
                  label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
                }));
            
                setColumns(tableColumns);
           } else { 
                console.log("noo hay missed produts")
                const firstDetail = orderData.detail[0];
                const properties = Object.keys(firstDetail);
                const filteredProperties = properties.filter(property => property !== 'productId' && property !== "choosenProductCategory" && property !== "price" && property !== "choosenProductTotalPrice" && property !== "replacementPrice");
            
                const columnLabelsMap = {
                  productName: 'Articulo',
                  quantity: 'Cantidad para Lavado',               
                };
            
                const tableColumns = filteredProperties.map(property => ({
                  key: property,
                  label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
                }));
            
                setColumns(tableColumns);
              }
           }
 
      }, [orderData, orderHasMissedProducts]);
 
    const getTheRealOrderToWash = (original, missed) => { 
    console.log(original);
    console.log(missed);
    const findTheQuantity = original.map((originalItem) => { 
        const detectar = missed.filter((missedItem) => missedItem.productId === originalItem.productId);
        if (detectar.length > 0) {
            return { 
                producto: originalItem.productName,
                cantidadLavado: originalItem.quantity - detectar.map((ord) => ord.missedQuantity)[0]
            };
        } else {
            return {
              producto: originalItem.productName,
              cantidadLavado: originalItem.quantity
         }; 
        }
    });
    setProductsToWashDetail(findTheQuantity)
    return findTheQuantity;
};


    
  return (
    <div>
       <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Ver Lavado</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Detalle del Pedido</ModalHeader>
              <ModalBody>
                <div className="flex flex-col text-start justify-start">
                    <p className="text-zinc-600 font-medium text-sm"><b>Pedido cargador por:</b> {orderData.creator}</p>
                    <p className="text-zinc-600 font-medium text-sm"><b>Fecha de creacion:</b> {orderData.day} de {orderData.month} de {orderData.year}</p>
                    <p className="text-zinc-600 font-medium text-sm"><b>Cliente:</b> {orderData.client}</p>
                    {orderData.orderSublets.length === 0 ? <p className="text-zinc-600 underline font-medium text-sm">Este pedido no tiene Articulos Sub Alquilados</p> : null}
                    {orderData.orderSublets.length > 0 ?
                      <div className="mt-2">
                        <p className="text-green-800 underline font-medium text-sm">Este pedido contiene Articulos Sub Alquilados</p>
                          <div className="mt-1">
                           {orderData.orderSublets.map((ord) => ( 
                              <div className="flex items-center gap-2" key={ord.productId}>
                                <p className="text-sm font-medium"><b>Articulo: </b>{ord.productName}</p>
                                <p className="text-sm font-medium"><b>Cantidad: </b>{ord.quantity}</p>
                              </div>
                           ))}
                          </div>  
                      </div>
                    : null}
                     {orderHasMissedProducts? <p className="text-red-600 underline font-medium text-sm mt-2" onClick={() => setViewMissedProducts(true)}>Este pedido contiene Articulos sin Devolver</p> : null}
                     {productsMissedDetail.length > 0 ? ( 
                      <div className="flex flex-col items-start justify-start">
                          {productsMissedDetail.map((prod) => (
                            <div className="flex items-center gap-4 justify-center">
                                 <p className="text-sm text-zinc-600 font-medium"> <b>Producto:</b> {prod.productName}</p>
                                 <p className="text-sm  text-zinc-600 font-medium"><b>Cantidad Faltante:</b> {prod.missedQuantity}</p>
                            </div>
                          ))}
                      </div>
                     ) : null}
                </div>
                   <div className="mt-4 ml-2">
                       <h5 className="font-medium text-sm text-zinc-600">Detalle para Lavar</h5>
                   </div>
                   <Table aria-label="Example table with dynamic content" className="w-[600px] shadow-xl flex items-center justify-center border rounded-lg">
                              <TableHeader columns={columns} className="">
                                {(column) => (
                                  <TableColumn key={column.key} className="text-xs gap-6">
                                    {column.label}
                                  </TableColumn>
                                )}
                              </TableHeader>
                              <TableBody items={orderHasMissedProducts === true ? productsToWashDetail : orderData.detail}>
                              {(item) => (
                                <TableRow key={orderHasMissedProducts === true ? item.producto : item.productName}>
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
              <ModalFooter className="flex items-center justify-center mt-2">
                <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onPress={onClose}> Confirmar Lavado </Button>
                <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onPress={onClose}> Confirmar Lavado </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
    </div>
  )
}

export default CleaningDetail
