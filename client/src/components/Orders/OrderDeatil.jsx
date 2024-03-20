import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import { useState, useEffect } from "react";

const OrderDetail = ({orderData, collectionDetail}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);


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

  
  return (
    <>
      {orderData ? <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Detalle</p> : <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Detalle del Cobro</p>}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Detalle del Pedido</ModalHeader>
             {orderData ?
              <ModalBody>
                <div className="flex flex-col text-start justify-start">
                    <p className="text-zinc-600 font-medium text-sm"><b>Pedido cargador por:</b> {orderData.creator}</p>
                    <p className="text-zinc-600 font-medium text-sm"><b>Fecha de creacion:</b> {orderData.day} de {orderData.month} de {orderData.year}</p>
                    <p className="text-zinc-600 font-medium text-sm"><b>Cliente:</b> {orderData.client}</p>
                    {orderData.orderSublets.length === 0 ? <p className="text-zinc-600 underline font-medium text-sm">Este pedido no tiene Articulos SubAlquilados</p> : null}
                    {orderData.orderSublets.length > 0 ?
                      <div className="mt-2">
                        <p className="text-green-800 underline font-medium text-sm">Este pedido contiene Articulos SubAlquilados</p>
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
              </ModalBody> :
              <div className="flex flex-col items-start justify-start text-start w-[500px] ml-4">
                  <p className="text-sm font-medium text-zinc-600">*El cobro fue cargado por {collectionDetail.loadedBy} el dia {collectionDetail.day} de {collectionDetail.month} del {collectionDetail.year}</p>
                  <p className="text-sm font-medium text-zinc-600">*El monto cobrado fue de {formatePrice(collectionDetail.amount)}</p>
                  {collectionDetail.account === "Efectivo" ? 
                     <p className="text-sm font-medium text-zinc-600">*El pago del cliente se realizo en {collectionDetail.account}</p> : 
                     <p className="text-sm font-medium text-zinc-600">*El pago del cliente se realizo a: {collectionDetail.account}</p>
                   }
              </div>      
               }
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

export default OrderDetail

