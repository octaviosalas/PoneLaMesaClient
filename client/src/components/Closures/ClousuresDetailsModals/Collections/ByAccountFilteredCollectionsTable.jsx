import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { formatePrice } from '../../../../functions/gralFunctions';

const ByAccountFilteredCollectionsTable = ({byAccountCollectionsData}) => {

    const [columns, setColumns] = useState([]);
    const [showTable, setShowTable] = useState(false);


    console.log(byAccountCollectionsData)

    useEffect(() => {
        console.log("fuera del if")
        if (byAccountCollectionsData.length > 0) {
            console.log("dentro del if")
          const firstDetail = byAccountCollectionsData[0];
          const properties = Object.keys(firstDetail);
          console.log(properties)
          console.log(firstDetail)
          const filteredProperties = properties.filter(property => property !== '_id');
      
          const columnLabelsMap = {
            account: 'Cuenta',
            quantityCollections: 'Cantidad de Cobros',
            totalAmount: 'Monto Recibido',
          };
      
          const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));
      
          setColumns(tableColumns);
         
            setShowTable(true)
          
        }
      }, [byAccountCollectionsData]);

  return (
    <div>
         {showTable ?
          <Table aria-label="Example table with dynamic content" className="w-[600px] 2xl:w-[750px] flex items-center justify-center mt-2 max-h-[400px] overflow-y-auto border rounded-xl">
                <TableHeader columns={columns}>
                        {(column) => (
                          <TableColumn key={column.key} className="text-xs gap-6">
                             {column.label}
                           </TableColumn>
                          )}
                    </TableHeader>
                  <TableBody items={byAccountCollectionsData}>
                          {(item) => (
                 <TableRow key={item.totalAmount}>
                         {columns.map(column => (
                     <TableCell key={column.key} className='text-left'>
                        {column.cellRenderer ? (
                        column.cellRenderer({ row: { original: item } })
                         ) : (
                         column.key === "totalAmount" || column.key === "value" ? (
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
  )
}

export default ByAccountFilteredCollectionsTable
