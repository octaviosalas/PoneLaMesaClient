import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { useRef } from "react";
import { getProductsClients, getProductsBonusClients } from '../../functions/gralFunctions';
import { formatePrice } from '../../functions/gralFunctions';
import DeleteOrder from '../Modals/DeleteOrder';
import EditOrder from '../Modals/EditOrder';

const ArticlesTable = ({clientsList, bonusClientsList}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [tableData, setTableData] = useState(clientsList)
    const [inputValue, setInputValue] = useState("")
    const [filteredData, setFilteredData] = useState(clientsList)
    const [tableChoosen, setTableChoosen] = useState(clientsList)


    useEffect(() => {
                if(clientsList.length !== 0) { 
                  console.log(clientsList)
                  const propiedades = Object.keys(clientsList[0]).filter(propiedad =>  propiedad !== '_id');
                  const columnObjects = propiedades.map(propiedad => ({
                      key: propiedad,
                      label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                      allowsSorting: true
                }));

                const modifiedColumnObjects = columnObjects.map(column => {
                  if (column.key === 'precioUnitarioAlquiler') {
                      return { ...column, label: 'Precio Alquiler' };
                  } else if (column.key === 'precioUnitarioReposicion') {
                      return { ...column, label: 'Precio Reposición' };
                  }  else if (column.key === 'precioUnitarioAlquilerBonificados') {
                    return { ...column, label: 'Precio Bonificados' };
                } else {
                      return column;
                  }
                });

               
                modifiedColumnObjects.push({
                    key: 'Editar',
                    label: 'Editar',
                    cellRenderer: (cell) => { 

                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        
                        const item = {
                        id: id,
                        };
                        return (
                          <EditOrder type="product"/>
                        );
                    },
                })      
                
                modifiedColumnObjects.push({
                  key: 'Eliminar',
                  label: 'Eliminar',
                  cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const item = {
                    id: id
                    };
                    return (
                       <DeleteOrder type="product"/>
                      );
                },
               }) 

               modifiedColumnObjects.push({
                key: 'Historico',
                label: 'Historico',
                cellRenderer: (cell) => { 
                  const filaActual = cell.row;
                  const id = filaActual.original._id;
                  const item = {
                  id: id
                  };
                  return (
                     <p className='text-xs font-medium text-green-700'>Historico</p>
                    );
              },
             }) 
    
      

                setColumns(modifiedColumnObjects);
                console.log(modifiedColumnObjects)
                if (tableRef.current) {
                    tableRef.current.updateColumns(modifiedColumnObjects);
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

    const changeTable = (x) => { 
      setFilteredData(x)
      setTableChoosen(x)
    }


      return (
        <div className='flex flex-col items-center justify-center'>
         {columns.length !== 0 ? 
         <>
          <div className='flex flex-col items-center justify-start w-full rounded-t-lg rounded-b-none ' >
              <div className='h-12 items-center justify-between w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none'>
                <div className='flex gap-5 items-center '>
                     <p className='font-medium text-black    text-md cursor-pointer ml-4' >
                      Articulos Clientes
                    </p>
                </div>
                <div>
                  <p className='text-sm mr-4 font-medium text-zinc-500'>Crear Articulo</p>
                </div>
                
              </div>
              <div className='w-full flex jusitfy-start text-center mt-4 '>
                <input className="w-[50%] border border-gray-200  focus:border-gray-300 focus:ring-0 h-10 rounded-xl" placeholder="Buscador" onChange={(e) => handleChange(e.target.value)}/>           
              </div>
          </div>
           <Table 
          columnAutoWidth={true} 
          columnSpacing={10}  
          aria-label="Selection behavior table example with dynamic content"   
          selectionBehavior={selectionBehavior} 
          className="w-full mt-2 lg:w-[800px] xl:w-[1200px] 2xl:w-[1300px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-left-right overflow-y-auto"
          >
          <TableHeader columns={columns} >
                    {(column) => (
                        <TableColumn
                        key={column.key}
                        className="text-left"             
                        >
                        {column.label}
                        </TableColumn>
                    )}
           </TableHeader>
           <TableBody items={filteredData}>
                    {(item) => (
               <TableRow key={item._id}>
                        {columns.map((column) => (
                   <TableCell key={column.key} className="text-start items-start">
                   {column.cellRenderer ? (
                       column.cellRenderer({ row: { original: item } })
                     ) : (
                       (column.key === "precioUnitarioAlquiler" || 
                        column.key === "precioUnitarioReposicioon" ||   column.key === "precioUnitarioAlquilerBonificados" ) ? (
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
         </>
          
       : null}
        </div>
      )
}

export default ArticlesTable