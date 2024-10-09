import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { formatePrice } from '../../../../functions/gralFunctions';

const AllCollectionsFilteredTable = ({everyCollections}) => {

    const [columns, setColumns] = useState([]);
    const [showTable, setShowTable] = useState(false);


    console.log(everyCollections)

    useEffect(() => {
        if (everyCollections.length > 0) {
          const firstDetail = everyCollections[0];
          const properties = Object.keys(firstDetail);
          console.log(properties)
          console.log(firstDetail)
          const filteredProperties = properties.filter(property => property !== '_id' && property !== 'orderDetail' && property !== 'paymentReferenceId' && property !== "productsReplacementDetail" && property !== 'day' && property !== 'month' && property !== 'year' && property !== 'voucher' 
          && property !== 'orderId' && property !== 'loadedBy' && property !== '__v');
      
          const columnLabelsMap = {
            account: 'Cuenta',
            amount: 'Monto',
            collectionType: 'Razon',
            client: 'Cliente',
            date: 'Fecha',
          };
      
          const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));
      
          setColumns(tableColumns);
         
            setShowTable(true)
          
        }
      }, [everyCollections]);

  return (
    <div>
         {showTable ?
          <Table aria-label="Example table with dynamic content" className="w-[600px] 2xl:w-[750px] flex items-center justify-center mt-2 max-h-[250px] overflow-y-auto border rounded-xl">
                   <TableHeader columns={columns}>
                        {(column) => (
                          <TableColumn key={column.key} className="text-xs gap-6">
                             {column.label}
                           </TableColumn>
                          )}
                    </TableHeader>
                  <TableBody items={everyCollections}>
                          {(item) => (
                 <TableRow key={item._id}>
                         {columns.map(column => (
                     <TableCell key={column.key} className='text-left'>
                        {column.cellRenderer ? (
                        column.cellRenderer({ row: { original: item } })
                         ) : (
                         column.key === "amount" || column.key === "value" ? (
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
            </Table> : <p className='font-medium text-zinc-600 text-sm'>No hay cobros en las fechas elegidas</p>}
    </div>
  )
}

export default AllCollectionsFilteredTable
