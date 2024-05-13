import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, MenuItem} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import { useState, useEffect } from "react";


const SubletDetail = ({subletDetailData}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [columns, setColumns] = useState([]);

  const handleOpen = () => { 
    console.log(subletDetailData)
    onOpen()
  }

  useEffect(() => {
    if (subletDetailData && subletDetailData.productsDetail && Array.isArray(subletDetailData.productsDetail) && subletDetailData.productsDetail.length > 0) {
      const firstDetail = subletDetailData.productsDetail[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== 'productId' &&  property !== 'choosenProductCategory' &&  property !== 'rentalPrice'  &&  property !== 'replacementPrice');
  
      const columnLabelsMap = {
        productName: 'Articulo',
        quantity: 'Cantidad',
        value: 'Precio Sub Alquilado',
      };
  
      const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
      }));
  
      setColumns(tableColumns);
    }
  }, [subletDetailData]);

  return (
    <>
      <p className="text-xs text-green-700 font-medium cursor-pointer" onClick={handleOpen}>Ver Detalle</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="min-w-[800px]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Detalle del Sub Alquiler</ModalHeader>
              <div className="flex flex-col justify-start items-start text-start ml-6">
                 <p className="text-zinc-600 font-medium text-md">Fecha: {subletDetailData.day} de {subletDetailData.month} del {subletDetailData.year}</p>
                 <p className="text-zinc-600 font-medium text-md">Proveedor: {subletDetailData.provider}</p>
                 <p className="text-zinc-600 font-medium text-md">Total: {formatePrice(subletDetailData.amount)}</p>
                 {subletDetailData.used === true ? <p className="text-white mt-2 bg-red-600 font-medium text-sm">Este Sub Alquiler fue Utilizado</p> : <p className="text-white mt-2 bg-green-800 font-medium text-sm">Este Sub Alquiler no fue utilizado</p>}
              </div>
              <ModalBody>
                      <Table aria-label="Example table with dynamic content" className="w-full shadow-xl flex items-center justify-center mt-2">
                              <TableHeader columns={columns} className="">
                                {(column) => (
                                  <TableColumn key={column.key} className="text-xs gap-6">
                                    {column.label}
                                  </TableColumn>
                                )}
                              </TableHeader>
                              <TableBody items={subletDetailData.productsDetail}>
                              {(item) => (
                                <TableRow key={item.productName}>
                                  {columns.map(column => (
                                   <TableCell key={column.key} className="text-start items-start">
                                   {column.cellRenderer ? (
                                       column.cellRenderer({ row: { original: item } })
                                     ) : (
                                       (column.key === "value") ? (
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
              </ModalBody>
              <ModalFooter className="flex justify-center items-center">
                <Button className="bg-green-800 text-white font-medium text-sm w-72" onPress={onClose}>
                  Cerrar
                </Button>            
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default SubletDetail;