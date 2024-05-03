import React from 'react'
import { useEffect, useState } from 'react'
import { formatePrice } from '../../functions/gralFunctions';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Button} from "@nextui-org/react";


const OrderDetailInCollectionDetail = ({orderDetailData, closeDetail, orderDetail}) => {

    const [columns, setColumns] = useState([]);


    useEffect(() => {
        if (orderDetailData.length > 0) {
          console.log(orderDetailData)
          const firstDetail = orderDetailData[0];
          console.log(orderDetailData[0])
          const properties = Object.keys(firstDetail);
          const filteredProperties = properties.filter(property => property !== 'productId' &&  property !== 'choosenProductCategory' &&  property !== 'choosenProductTotalPrice' &&  property !== 'replacementPrice');
      
          const columnLabelsMap = {
            productName: 'Articulo',
            quantity: 'Cantidad',
            price: 'Precio Alquiler',
            
          };
      
          const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));
      
          setColumns(tableColumns);
        }
      }, [orderDetailData]);
     

  return (
    <div>
         {columns.length > 0 && orderDetailData ?
         <> 
             <div className='flex flex-col justify-start items-start text-start'>
                <p className='text-zinc-700 font-medium text-sm'><b>Detalle de la orden abonada</b></p>
                <p className='text-zinc-700 font-medium text-sm'>Numero de Orden: {orderDetail.orderNumber}</p>
                <p className='text-zinc-700 font-medium text-sm'>Fecha: {orderDetail.day} de {orderDetail.month} del {orderDetail.year}</p>
                <p className='text-zinc-700 font-medium text-sm'>Cliente: {orderDetail.client}</p>
             </div>
             <Table aria-label="Example table with dynamic content" className="w-[650px] shadow-xl flex items-center justify-center mt-2">
                              <TableHeader columns={columns} className="">
                                {(column) => (
                                  <TableColumn key={column.key} className="text-xs gap-6">
                                    {column.label}
                                  </TableColumn>
                                )}
                              </TableHeader>
                              <TableBody items={orderDetailData}>
                              {(item) => (
                                <TableRow key={item.productName}>
                                  {columns.map(column => (
                                   <TableCell key={column.key} className="text-start items-start">
                                   {column.cellRenderer ? (
                                       column.cellRenderer({ row: { original: item } })
                                     ) : (
                                       (column.key === "price") ? (
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
                   <div className='flex items-center justify-center mt-4 mb-2'>
                     <Button className="bg-green-800 text-white font-medium w-72" onClick={() => closeDetail()}>Cerrar Detalle</Button>
                   </div>
            </>
             :
             <div className='flex flex-col justify-center text-center'>
                <p className='font-medium text-md'>No se encontro la orden</p> 
                <Button className='text-white font-medium bg-green-800 w-72 mt-4 mb-2' onClick={() => closeDetail()}>Cerrar</Button>         
             </div>
         }

    
    </div>
  )
}

export default OrderDetailInCollectionDetail
