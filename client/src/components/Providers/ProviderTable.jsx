import React from 'react'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import DeleteOrder from '../Modals/DeleteOrder';
import EditModal from '../Modals/EditModal';
import OrderDetail from '../Orders/OrderDeatil';
import { formatePrice } from '../../functions/gralFunctions';
import Loading from '../Loading/Loading';
import {Link} from "react-router-dom"
import { getDay, getMonth, getYear, getDate } from '../../functions/gralFunctions';
import { useNavigate } from 'react-router-dom';
import HistoricProviders from './HistoricProviders';
import CreateProvider from './CreateProvider';

const ProviderTable = ({providers, updateProvidersList}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [withOutCollections, setWithOutCollections] = useState(false);
    const [loadData, setLoadData] = useState(true)
    const [inputValue, setInputValue] = useState("")
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");


        useEffect(() => { 
            setData(providers)
        }, [providers])

        const getProvidersAndCreateTable = () => { 
            if(data.length !== 0) { 
            const propiedades = Object.keys(providers[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v'  );
            const columnObjects = propiedades.map(propiedad => ({
                key: propiedad,
                label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                allowsSorting: true
            }));

                const modifiedColumnObjects = columnObjects.map(column => {
                    if (column.key === 'name') {
                        return { ...column, label: 'Nombre' };
                    } else if (column.key === 'telephone') {
                        return { ...column, label: 'Telefono' };
                    } else if (column.key === 'email') {
                        return { ...column, label: 'Cuenta' };
                    } else if (column.key === 'orderNumber') {
                        return { ...column, label: 'Orden' };
                    }  else {
                        return column;
                    }
                });
        
                modifiedColumnObjects.push({
                key: 'Historic',
                label: 'Historic',
                cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const name = filaActual.original.name;
                    const item = {
                    id: id,
                    name: name,
                    };
                    return (
                      <HistoricProviders providerData={item} updateList={updateProvidersList}/>                 
                    );
                },
                }) 

               

                modifiedColumnObjects.push({
                    key: 'Editar',
                    label: 'Editar',
                    cellRenderer: (cell) => { 

                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const name = filaActual.original.name;
                        const telephone = filaActual.original.telephone;
                        const email = filaActual.original.email;                  
                        const item = {
                        id: id,
                        name: name,
                        telephone: telephone,
                        email: email   
                        };
                        return (
                        <EditModal type="provider" providerData={item} updateProvidersList={updateProvidersList}/>
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
                    <DeleteOrder type="providers" providerData={item} updateProviderList={updateProvidersList}/>
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

        const filteredData = data.filter((item) => {
        return Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(inputValue.toLowerCase())
        );
        });

        useEffect(() => { 
                setTimeout(() => { 
                    setLoadData(false)
                }, 2000)
        }, [columns, data])

        useEffect(() => { 
            if(data.length > 0) { 
            getProvidersAndCreateTable()
            console.log("ejecuto data mas a 0")
            } else { 
                setWithOutCollections(true)
            }
        }, [data])



     return (
        <div>
          {loadData ? (
            <Loading />
              ) : (
               data.length > 0 ? (
                  <>
                   <div className='flex flex-col  w-full rounded-t-lg rounded-b-none'>
                     <div className='h-12 w-full flex  bg-green-200 gap-10 rounded-t-lg rounded-b-none'>
                       <div className='flex justify-between  w-full items-center ml-4'>                   
                           <p className='text-sm font-bold text-zinc-600'>Proveedores</p>
                             <CreateProvider updateList={updateProvidersList}/>
                       </div>
                       <div className='flex justify-start mr-4'></div>
                     </div>
                     <div className='w-full flex items-center gap-2 justify-start mt-4'>
                       <input
                         className="w-[50%] border border-gray-200 focus:border-gray-300 focus:ring-0 h-10 rounded-xl"
                         placeholder="Buscador"
                         onChange={(e) => setInputValue(e.target.value)}
                         value={inputValue}
                       />
                     </div>
                   </div>
   
                   <Table
                     columnAutoWidth={true}
                     columnSpacing={10}
                     aria-label="Selection behavior table example with dynamic content"
                     selectionBehavior={selectionBehavior}
                     className="w-full mt-2 lg:w-[800px] xl:w-[1200px] 2xl:w-[1300px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
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
                         <TableRow key={item._id}>
                           {columns.map((column) => (
                             <TableCell key={column.key} className='text-left'>
                               {column.cellRenderer ? (
                                 column.cellRenderer({ row: { original: item } })
                               ) : (
                                 column.key === "Total" ? (
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
               ) : (
                 <div className='flex flex-col items-center justify-center '>
                   {
                   withOutCollections ? 
                    <p className='text-black font-medium text-md '>No hay Cobros</p> 
                    :
                    null
                  }               
                 </div>
           )
         )}
           </div>
     )
}

export default ProviderTable
