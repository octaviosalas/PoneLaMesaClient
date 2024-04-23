import React from 'react'
import { useState, useRef, useEffect } from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import axios from "axios";
import Loading from "../Loading/Loading"
import MarkWashedArticlesAsFinished from './MarkWashedArticlesAsFinished';

const CleaningDetailList = ({washData, updateNumbers}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [inputValue, setInputValue] = useState("")
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");

    useEffect(() => { 
        setData(washData)
        console.log("LOS WASH DATA", washData)
     }, [washData])
     

     const getDataAndCreateTable = () => { 
        if(data.length !== 0) { 
        const propiedades = Object.keys(washData[0]).filter(propiedad =>  propiedad !== 'productId' &&  propiedad !== '__v'  &&   propiedad !== 'productPrice'  && propiedad !== '_id');
        const columnObjects = propiedades.map(propiedad => ({
            key: propiedad,
            label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
            allowsSorting: true
        }));

        const modifiedColumnObjects = columnObjects.map(column => {
            if (column.key === 'productId') {
                return { ...column, label: 'ID' };
            } else if (column.key === 'productName') {
                return { ...column, label: 'Articulo' };
            } else if (column.key === 'quantity') {
                return { ...column, label: 'Cantidad para Lavar' };
            } else {
                return column;
            }
        });
    
            modifiedColumnObjects.push({
            key: 'Registrar Lavado',
            label: 'Registrar Lavado',
            cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const productId = filaActual.original.productId;
                const productName = filaActual.original.productName;
                const quantity = filaActual.original.quantity;
                const productPrice = filaActual.original.productPrice;
                const item = { productId, productName, quantity, productPrice};
                return (
                   <MarkWashedArticlesAsFinished washedData={item} updateNumbers={updateNumbers}/>
                );
            },
            }) 


            setColumns(modifiedColumnObjects);
            console.log(modifiedColumnObjects)
            if (tableRef.current) {
            tableRef.current.updateColumns(modifiedColumnObjects);
            }            
        } 
    }

    useEffect(() => { 
        if(data.length > 0) { 
        getDataAndCreateTable()
        console.log("ejecuto data mas a 0")
        } 
  }, [data])


  const filteredData = data.filter((item) => {
    return Object.values(item).some((value) => {
       if (value === null) return false;
       return value.toString().toLowerCase().includes(inputValue.toLowerCase());
    });
   });

  return (
           <div className='flex flex-col items-center justify-center 2xl:mt-12'>
                <div className='flex flex-col items-start justify-start lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] rounded-t-lg rounded-b-none ' >
                      <div className='h-12 items-center justify-start w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none'>             
                              <p className='font-bold text-sm text-zinc-600 underline ml-2'>Cantidades de Articulos en Lavado</p>
                      </div>     
                      <input
                          className="w-[35%] mt-2 border ml-2 border-gray-200 focus:border-gray-300 focus:ring-0 h-10 rounded-xl focus:outline-none  focus:ring-blue-500" 
                          placeholder="Buscador"
                          onChange={(e) => setInputValue(e.target.value)}
                          value={inputValue}
                        />     
                </div>
                 
                      
                   
              {data.length >0 && columns.length > 0 ? 
                   <Table
                     columnAutoWidth={true}
                     columnSpacing={10}
                     aria-label="Selection behavior table example with dynamic content"
                     selectionBehavior={selectionBehavior}
                     className="w-full mt-2  lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
                   >
                     <TableHeader columns={columns}>
                       {(column) => (
                         <TableColumn key={column.key} className="text-left">
                           {column.label}
                         </TableColumn>
                       )}
                     </TableHeader>
   
                     <TableBody items={filteredData}>
                       {(item) => (
                         <TableRow key={item.productId}>
                           {columns.map((column) => (
                             <TableCell key={column.key} className='text-left'>
                               {column.cellRenderer ? (
                                 column.cellRenderer({ row: { original: item } })
                               ) : (
                                 column.key === "amount" ? (
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
          </Table> : <p>Cargando...</p>}
    </div>
  )
}

export default CleaningDetailList
