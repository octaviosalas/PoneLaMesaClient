import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";

import { useState, useEffect } from "react";


const PurchaseDetail = ({purchaseData}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (purchaseData && purchaseData.detail && Array.isArray(purchaseData.detail) && purchaseData.detail.length > 0) {
      const firstDetail = purchaseData.detail[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== 'productId' &&  property !== "choosenProductTotalPrice");
  
      const columnLabelsMap = {
        productName: 'Articulo',
        quantity: 'Cantidad',
        value: 'Monto Gastado',
      };
  
      const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
      }));
  
      setColumns(tableColumns);
    }
  }, [purchaseData]);

  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Detalle</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Detalle de la Compra</ModalHeader>
              <ModalBody>
                <div className="flex flex-col text-start justify-start">
                    <p className="text-zinc-600 font-medium text-sm">Pedido cargador por: {purchaseData.creator}</p>
                    <p className="text-zinc-600 font-medium text-sm">Fecha de creacion: {purchaseData.day} de {purchaseData.month} de {purchaseData.year}</p>
                </div>
                   <Table aria-label="Example table with dynamic content" className="w-[600px] 2xl:w-[750px] flex items-center justify-center mt-2">
                              <TableHeader columns={columns}>
                                {(column) => (
                                  <TableColumn key={column.key} className="text-xs gap-6">
                                    {column.label}
                                  </TableColumn>
                                )}
                              </TableHeader>
                              <TableBody items={purchaseData.detail}>
                              {(item) => (
                                <TableRow key={item.productName}>
                                  {columns.map(column => (
                                  <TableCell key={column.key} className='text-left'>
                                  {column.cellRenderer ? (
                                    column.cellRenderer({ row: { original: item } })
                                  ) : (
                                    column.key === "total" || column.key === "value" ? (
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
                        <div className="flex justify-end">
                          <p className="text-sm text-zinc-600 font-bold">Monto total de la Compra: {purchaseData.total} $</p>
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

export default PurchaseDetail

