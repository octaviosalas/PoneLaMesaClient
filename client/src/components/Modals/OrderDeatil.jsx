import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

import { useState, useEffect } from "react";

const OrderDetail = ({orderData}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (orderData && orderData.detail && Array.isArray(orderData.detail) && orderData.detail.length > 0) {
      const firstDetail = orderData.detail[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== 'productId');
  
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
      <p onClick={onOpen} className="text-green-700 font-medium text-sm cursor-pointer">Ver Detalle</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Detalle del Pedido</ModalHeader>
              <ModalBody>
                <div className="flex flex-col text-start justify-start">
                    <p className="text-zinc-600 font-medium text-sm">Pedido cargador por: {orderData.creator}</p>
                    <p className="text-zinc-600 font-medium text-sm">Fecha de creacion: {orderData.day} de {orderData.month} de {orderData.year}</p>
                    <p className="text-zinc-600 font-medium text-sm">Cliente: {orderData.client}</p>
                </div>
                   <Table aria-label="Example table with dynamic content" className="w-full flex items-center justify-center mt-2">
                              <TableHeader columns={columns}>
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
                                      {item[column.key]}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                            </TableBody>
                        </Table>    
                        <div className="flex justify-end">
                          <p className="text-sm text-zinc-600 font-bold">Valor total del Pedido: {orderData.total} $</p>
                        </div>        
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

export default OrderDetail