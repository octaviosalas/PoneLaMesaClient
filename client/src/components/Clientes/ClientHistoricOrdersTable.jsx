import React, {useState, useEffect} from 'react'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from '../../functions/gralFunctions';

const ClientHistoricOrdersTable = ({ordersProducts}) => {

    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [showTable, setShowTable] = React.useState(false);
    console.log(ordersProducts)


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
          setShowTable(true)
        } else { 
          setError(true)
        }
      }, [ordersProducts]);


  return (
    <div>
       {showTable ?
         <Table                          
            columnAutoWidth={true} 
            columnSpacing={10}  
            aria-label="Selection behavior table example with dynamic content"   
            selectionBehavior={selectionBehavior} 
            className="w-[780px] 2xl-w-[550px] flex items-center justify-center mt-2 shadow-2xl overflow-y-auto xl:max-h-[150px] 2xl:max-h-[250px] border rounded-xl">
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
         </Table> : <p>Aguardando datos...</p>}
    </div>
  )
}

export default ClientHistoricOrdersTable
