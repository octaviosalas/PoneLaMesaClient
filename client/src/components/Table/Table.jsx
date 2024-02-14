import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { useRef } from "react";
import { getProductsClients, getProductsBonusClients } from '../../functions/gralFunctions';

const TableComponent = ({clientsList, bonusClientsList}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [tableData, setTableData] = useState(clientsList)
    const [inputValue, setInputValue] = useState("")
    const [filteredData, setFilteredData] = useState(clientsList)

    useEffect(() => {
          if(clientsList.length !== 0) { 
            console.log(clientsList)
            const propiedades = Object.keys(clientsList[0]).filter(propiedad =>  propiedad !== '_id');
            const columnObjects = propiedades.map(propiedad => ({
                key: propiedad,
                label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                allowsSorting: true
          }));

            columnObjects.push({
                  key: 'Eliminar',
                  label: 'Eliminar',
                  cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const item = {
                    id: id
                    };
                    return (
                       <p>Eliminar</p>
                      );
                },
                  }) 
      
                columnObjects.push({
                    key: 'Editar',
                    label: 'Editar',
                    cellRenderer: (cell) => { 

                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        
                        const item = {
                        id: id,
                        };
                        return (
                          <p>Editar</p>
                        );
                    },
                })              
                setColumns(columnObjects);
                console.log(columnObjects)
                if (tableRef.current) {
                    tableRef.current.updateColumns(columnObjects);
                }            
              } else { 
                console.log("VACIO")
              }
 
    }, [clientsList, bonusClientsList]);

    const handleChange = (e) => { 
      const searchTerm = e.toLowerCase(); 
      const filteringFilteredData = filteredData.filter((it) => it.articulo.toLowerCase().includes(searchTerm));
      if(e.length !== 0) { 
        setFilteredData(filteringFilteredData)
      } else { 
        setFilteredData(clientsList)
      }   
      
    }


      return (
        <div className='flex flex-col items-center justify-center'>
         {columns.length !== 0 ? 
         <>
          <div className='flex flex-col items-center justify-start w-full rounded-t-lg rounded-b-none ' >
              <div className='h-12 items-center justify-start w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none'  >
                  <p className='font-medium  text-sm cursor-pointer ml-4'
                     onClick={() => setFilteredData(clientsList)}
                     style={{ color: filteredData === clientsList  ? "#060606" : "#C0BEBE" }}
                     >
                     Productos Clientes
                  </p>
                  <p className='font-medium text-sm cursor-pointer' style={{ color: filteredData === bonusClientsList  ? "#060606" : "#C0BEBE" }} onClick={() => setFilteredData(bonusClientsList)}>
                     Productos Clientes Bonificados
                  </p>
              </div>
              <div className='w-full flex jusitfy-start mt-4'>
                <input className="w-[50%] border border-gray-200  focus:border-gray-300 focus:ring-0 h-10 rounded-xl" placeholder="Buscador" onChange={(e) => handleChange(e.target.value)}/>
              </div>
          </div>
           <Table 
          columnAutoWidth={true} 
          columnSpacing={10}  
          aria-label="Selection behavior table example with dynamic content"   
          selectionBehavior={selectionBehavior} 
          className="w-full mt-6 lg:w-[800px] xl:w-[1200px] 2xl:w-[1300px] h-auto text-center shadow-left-right overflow-y-auto max-h-[600px]"
          >
          <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                        key={column.key}
                        className="text-center"             
                        >
                        {column.label}
                        </TableColumn>
                    )}
           </TableHeader>
           <TableBody items={filteredData} className='flex flex-col justify-start'>
                    {(item) => (
               <TableRow key={item._id}>
                        {columns.map((column) => (
                  <TableCell key={column.key}>
                      {column.cellRenderer ? column.cellRenderer({ row: { original: item } }) : item[column.key]}
                  </TableCell>
                  ))}
             </TableRow>
                )}
          </TableBody>
       </Table> 
         </>
          
       : null}
        </div>
      )
}

export default TableComponent
