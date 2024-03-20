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
import VaucherModal from './VaucherModal';


const CollectionsTable = ({collections}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [withOutCollections, setWithOutCollections] = useState(false);
    const [loadData, setLoadData] = useState(true)
    const [inputValue, setInputValue] = useState("")
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");



    useEffect(() => { 
        setData(collections)
     }, [collections])

        const getDataAndCreateTable = () => { 
            if(data.length !== 0) { 
            const propiedades = Object.keys(collections[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v'  
                && propiedad !== 'orderDetail' &&  propiedad !== 'clientId' && propiedad !== 'loadedBy' && propiedad !== 'voucher'  && propiedad !== 'orderId' && propiedad !== 'orderCreator' && propiedad !== 'year'
                && propiedad !== 'day' && propiedad !== 'paid');
            const columnObjects = propiedades.map(propiedad => ({
                key: propiedad,
                label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                allowsSorting: true
            }));

                const modifiedColumnObjects = columnObjects.map(column => {
                    if (column.key === 'date') {
                        return { ...column, label: 'Fecha' };
                    } else if (column.key === 'account') {
                        return { ...column, label: 'Cuenta' };
                    } else if (column.key === 'orderNumber') {
                        return { ...column, label: 'Orden' };
                    }  else if (column.key === 'orderStatus') {
                        return { ...column, label: 'Estado' };
                    } else if (column.key === 'placeOfDelivery') {
                        return { ...column, label: 'Entrega' };
                    } else if (column.key === 'month') {
                        return { ...column, label: 'Mes' };
                    }  else if (column.key === 'Entrega') {
                        return { ...column, label: 'Fecha de Entrega' };
                    } else if (column.key === 'returnDate') {
                        return { ...column, label: 'Fecha Devolucion' };
                    } else if (column.key === 'returnPlace') {
                        return { ...column, label: 'Devolucion' };
                    }else if (column.key === 'amount') {
                        return { ...column, label: 'Total' };
                    }else if (column.key === 'client') {
                        return { ...column, label: 'Cliente' };
                    }else {
                        return column;
                    }
                });
        
                modifiedColumnObjects.push({
                key: 'Detalle',
                label: 'Detalle',
                cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const account = filaActual.original.account;
                    const loadedBy = filaActual.original.loadedBy
                    const amount = filaActual.original.amount
                    const day = filaActual.original.day
                    const month = filaActual.original.month
                    const year = filaActual.original.year
                   
                    const item = {
                    id: id,
                    account: account,
                    loadedBy: loadedBy,
                    amount: amount,
                    day: day,
                    month: month,
                    year: year                   
                    };
                    return (
                       <OrderDetail collectioDetail={item}/>
                    );
                },
                }) 

                modifiedColumnObjects.push({
                    key: 'Comprobante',
                    label: 'Comprobante',
                    cellRenderer: (cell) => { 
                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const voucher = filaActual.original.voucher;   
                        const item = {
                        id: id,
                        voucher: voucher,                     
                        };
                        return (
                        <VaucherModal detail={item} showingOn="table"/>
                        );
                    },
                    }) 

                modifiedColumnObjects.push({
                    key: 'Editar',
                    label: 'Editar',
                    cellRenderer: (cell) => { 

                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const client = filaActual.original.client;
                        const order = filaActual.original.orderNumber;
                        const status = filaActual.original.orderStatus;
                        const month = filaActual.original.month;
                        const date = filaActual.original.date;
                        const dateOfDelivery = filaActual.original.dateOfDelivery;
                        const returnDate = filaActual.original.returnDate;
                        const orderDetail = filaActual.original.orderDetail;
                        const item = {
                        id: id,
                        client: client,
                        status: status,
                        order: order,
                        month: month,
                        date: date,
                        dateOfDelivery: dateOfDelivery,
                        returnDate: returnDate,
                        orderDetail: orderDetail                  
                        };
                        return (
                        <EditModal type="orders" statusOrder={status} orderData={item} updateList={getDataAndCreateTable}/>
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
                    <DeleteOrder type="orders" orderData={item} updateList={getDataAndCreateTable}/>
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
            getDataAndCreateTable()
            console.log("ejecuto data mas a 0")
            } else { 
                setWithOutCollections(true)
            }
        }, [data])

     useEffect(() => { 
        console.log(data)
        console.log(columns)
     }, [data, columns])

     return (
        <div>
          {loadData ? (
            <Loading />
              ) : (
               data.length > 0 ? (
                  <>
                   <div className='flex flex-col  w-full rounded-t-lg rounded-b-none'>
                     <div className='h-12 w-full flex  bg-green-200 gap-10 rounded-t-lg rounded-b-none'>
                       <div className='flex w-full items-center ml-4'>                   
                           <p className='text-sm font-bold text-zinc-600'>Cobros Realizados</p>
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

export default CollectionsTable
