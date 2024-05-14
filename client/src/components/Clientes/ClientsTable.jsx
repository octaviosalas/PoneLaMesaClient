import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { useRef } from "react";
import { getProductsClients, getProductsBonusClients } from '../../functions/gralFunctions';
import { formatePrice } from '../../functions/gralFunctions';
import DeleteOrder from '../Modals/DeleteOrder';
import EditModal from '../Modals/EditModal';
import Loading from '../Loading/Loading';
import CreateNewClient from "./CreateNewClient";
import HistoricClient from './HistoricClient';
import EstadisticsClientsModal from './EstadisticsClientsModal';
import EstadisticsClients from './EstadisticsClients';
import AccountState from './AccountState';


const ClientsTable = () => {

            const tableRef = useRef(null);
            const [data, setData] = useState([]);
            const [columns, setColumns] = useState([]);
            const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
            const [tableData, setTableData] = useState([])
            const [inputValue, setInputValue] = useState("")
            const [tableChoosen, setTableChoosen] = useState([])

           const getClientsDataAndCreateTable = () => { 
              axios.get("http://localhost:4000/clients") 
             .then((res) => { 
              const purchasesData = res.data
              setData(purchasesData)
              if(purchasesData.length !== 0) { 
                const propiedades = Object.keys(purchasesData[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== "clientDebt");
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
                }  else if (column.key === 'email') {
                 return { ...column, label: 'Email' };
                }   else if (column.key === 'home') {
                    return { ...column, label: 'Direccion' };
                }   else if (column.key === 'typeOfClient') {
                  return { ...column, label: 'Cliente' };
                }  else if (column.key === 'dni') {
                    return { ...column, label: 'Dni' };
                }else {
                        return column;
                    }
                });
    
              modifiedColumnObjects.push({
                  key: 'Editar',
                  label: 'Editar',
                  cellRenderer: (cell) => {     
                      const filaActual = cell.row;
                      const id = filaActual.original._id;   
                      const name = filaActual.original.name;      
                      const telephone = filaActual.original.telephone;
                      const dni = filaActual.original.dni;
                      const home = filaActual.original.home;
                      const typeOfClient = filaActual.original.typeOfClient;
                      const item = {
                      id,
                      telephone,
                      dni,
                      typeOfClient,
                      name,
                      home
                      };
                      return (
                        <EditModal type="client" updateClientsChanges={getClientsDataAndCreateTable} clientData={item}/>
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
                     <DeleteOrder type="client" clientData={item} updateClientList={getClientsDataAndCreateTable}/>
                    );
              },
              }) 
    
              modifiedColumnObjects.push({
              key: 'Detalle',
              label: 'Detalle',
              cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const id = filaActual.original._id;
                const name = filaActual.original.name;
                const telephone = filaActual.original.telephone;
                const email = filaActual.original.email;
                const typeOfClient = filaActual.original.year;
                const detail = filaActual.original.purchaseDetail;
                const creator = filaActual.original.creatorPurchase;
                const total = filaActual.original.total;
                const item = {
                id: id,
                detail,
                name,
                telephone,
                typeOfClient,
                   
                };
                return (
                   <HistoricClient clientData={item} updateClientData={getClientsDataAndCreateTable}/>
                  );
            },
              }) 

              modifiedColumnObjects.push({
                key: 'Estado de Cuenta',
                label: 'Estado de Cuenta',
                cellRenderer: (cell) => { 
                  const filaActual = cell.row;
                  const id = filaActual.original._id;
                  const name = filaActual.original.name;            
                  const item = { id, name};
                  return (
                     <AccountState clientData={item} updateClientData={getClientsDataAndCreateTable}/>
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

             })
             .catch((err) => { 
              console.log(err)
             })
            }
   
            useEffect(() => {
                getClientsDataAndCreateTable()
            }, []);

            const filteredData = data.filter((item) => {
              return Object.values(item).some((value) => {
                 if (value === null) return false;
                 return value.toString().toLowerCase().includes(inputValue.toLowerCase());
              });
             });


  return (
    <div className='flex flex-col items-center justify-center  mt-16 2xl:mt-12'>
         {columns.length !== 0 && data.length !== 0 ? 
         <>
          <div className='flex flex-col items-center justify-start w-full rounded-t-lg rounded-b-none lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] ' >
             <div className='flex justify-start items-start text-start w-full ml-2'>
                <p className='text-zinc-500 font-medium text-md'>Clientes</p>
             </div>
              <div className='h-12 items-center justify-between w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none mt-2'>    
                  <div className='flex justify-end items-end gap-4 mr-2 w-full'>
                    <EstadisticsClientsModal/>
                    <CreateNewClient updateList={getClientsDataAndCreateTable}/>      
                  </div>                        
              </div>
              <div className='w-full flex jusitfy-start text-center mt-4 '>
               <input 
                    className="w-[35%] border border-gray-200 focus:border-gray-300 focus:ring-0 h-10 rounded-xl focus:outline-none  focus:ring-blue-500" 
                    placeholder="Buscador" 
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue} />    
              </div>
          </div>
          <Table 
            columnAutoWidth={true} 
            columnSpacing={10}  
            aria-label="Selection behavior table example with dynamic content"   
            selectionBehavior={selectionBehavior} 
            className="w-full mt-2 lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px]  max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
            >
          <TableHeader columns={columns} >
                    {(column) => (
                      <TableColumn key={column.key} className="text-left"> {column.label}  </TableColumn>
                    )}
           </TableHeader>
           <TableBody items={filteredData}>
                    {(item) => (
               <TableRow key={item._id}>
                        {columns.map((column) => (
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
       </Table> 
       <EstadisticsClients/>
         </>
          
       : <Loading/>}
        </div>
  )
}

export default ClientsTable
