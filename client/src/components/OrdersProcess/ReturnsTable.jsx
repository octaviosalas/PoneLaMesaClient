import React from 'react'
import { useEffect, useState, useRef } from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { formatePrice } from '../../functions/gralFunctions';
import Loading from '../Loading/Loading';
import OrderDetail from '../Orders/OrderDeatil';
import CreateNewReturn from '../Returns/CreateNewReturn';

const ReturnsTable = ({todaysReturns, pendingReturns, everyReturns}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [withOutCollections, setWithOutCollections] = useState(false);
    const [loadData, setLoadData] = useState(true)
    const [inputValue, setInputValue] = useState("")
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [withOutOrders, setWithOutOrders] = React.useState("toggle");

    const changeDataValues = (item) => { 
        setData(item)
    }

    useEffect(() => { 
        changeDataValues(everyReturns)
     }, [todaysReturns, pendingReturns, everyReturns])


     useEffect(() => { 
        console.log("Devoluciones del dia:", todaysReturns)
        console.log("Pendientes de devolucion:", pendingReturns)
        console.log("Todas las devoluciones:", everyReturns)
     }, [todaysReturns, pendingReturns, everyReturns])

        const getDataAndCreateTable = () => { 
            if(data.length !== 0) { 
            const propiedades = Object.keys(everyReturns[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== 'orderCreator'  && propiedad !== 'clientId' 
            &&  propiedad !== 'typeOfClient' && propiedad !== 'placeOfDelivery' && propiedad !== 'dateOfDelivery' && propiedad !== 'subletsDetail'  && propiedad !== 'orderDetail'  && propiedad !== 'date'
            && propiedad !== 'month' && propiedad !== 'year' && propiedad !== 'day' && propiedad !== 'missingArticlesData');
            const columnObjects = propiedades.map(propiedad => ({
                key: propiedad,
                label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                allowsSorting: true
            }));

                const modifiedColumnObjects = columnObjects.map(column => {
                    if (column.key === 'orderStatus') {
                        return { ...column, label: 'Estado' };
                    } else if (column.key === 'orderNumber') {
                        return { ...column, label: 'Orden' };
                    } else if (column.key === 'client') {
                        return { ...column, label: 'Cliente' };                
                    }else if (column.key === 'returnDate') {
                        return { ...column, label: 'Fecha de Devolucion' };                
                    } else if (column.key === 'returnPlace') {
                        return { ...column, label: 'Lugar de Devolucion' };                
                    } else if (column.key === 'total') {
                        return { ...column, label: 'Monto' };                
                    } else if (column.key === 'paid') {
                        return { ...column, label: 'Abonada' };                
                    } else {
                        return column;
                    }
                });

            /*  modifiedColumnObjects.push({
                key: 'Derivar',
                label: 'Derivar',
                cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const productsDetail = filaActual.original.productsDetail;
                    const amount = filaActual.original.amount;
                    const provider = filaActual.original.provider;
                    const used = filaActual.original.used;

                    const item = {
                    id: id,
                    productsDetail: productsDetail,
                    amount: amount,                     
                    provider: provider,
                    used: used
                    };
                    return (
                    <UseSubletToOrder subletData={item}/>
                    );
                },
                }) */
        
                modifiedColumnObjects.push({
                key: 'Detalle',
                label: 'Detalle',
                cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const detail = filaActual.original.orderDetail;
                    const subletsDetail = filaActual.original.subletsDetail;
                    const creator = filaActual.original.orderCreator;
                    const client = filaActual.original.client;
                    const day = filaActual.original.day;
                    const month = filaActual.original.month;
                    const year = filaActual.original.year;
                    const total = filaActual.original.total;
                    const item = {
                    id: id,
                    detail: detail,
                    orderSublets: subletsDetail,
                    creator: creator,
                    day: day,
                    month: month,
                    year: year,
                    total: total,
                    client: client
                    };
                    return (
                    <OrderDetail orderData={item}/>
                    );
                },
                }) 

               /* modifiedColumnObjects.push({
                    key: 'Editar',
                    label: 'Editar',
                    cellRenderer: (cell) => { 

                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const provider = filaActual.original.provider;
                        const month = filaActual.original.month;
                        const day = filaActual.original.day;
                        const date = filaActual.original.date;
                        const productsDetail = filaActual.original.productsDetail;
                        const item = {
                        id: id,
                        provider: provider,
                        month: month,
                        day: day,
                        date: date,
                        productsDetail: productsDetail                  
                        };
                        return (
                        <EditModal type="sublets" subletData={item} updateSubletList={update}/>
                        );
                    },
                })          
                            
                modifiedColumnObjects.push({
                key: 'Eliminar',
                label: 'Eliminar',
                cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const subletProductsDetail = filaActual.original.productsDetail
                    const item = {
                    id: id,
                    subletProductsDetail: subletProductsDetail
                    };
                    return (
                    <DeleteOrder type="sublets" subletData={item} updateSubletsList={update}/> 
                    );
                },
                }) */

                setColumns(modifiedColumnObjects);
                if (tableRef.current) {
                tableRef.current.updateColumns(modifiedColumnObjects);
                }            
            } else { 
                setWithOutOrders(true)
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
        } else { 
            setWithOutOrders(true)        
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
                     <div className='h-12 w-full flex justify-between items-center  bg-green-200 gap-10 rounded-t-lg rounded-b-none'>
                       <div className='flex justify-start w-full items-center ml-4 gap-6'>                   
                           <p className='text-sm font-bold cursor-pointer text-zinc-600'  onClick={() => changeDataValues(everyReturns)}>Todas las Devoluciones</p>
                           <p className='text-sm font-bold cursor-pointer text-zinc-600' onClick={() => changeDataValues(pendingReturns)}>Devoluciones Pendientes</p>
                           <p className='text-sm font-bold cursor-pointer text-zinc-600'  onClick={() => changeDataValues(todaysReturns)}>Devoluciones del Dia</p>
                       </div>
                       <div className='flex items-center'>
                         <CreateNewReturn/>
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
                                 column.key === "total" ? (
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
                   withOutOrders ? 
                    <div className='flex flex-col items-center justify-center'>
                       <p className='text-black font-medium text-md'>No hay Devoluciones</p> 
                       <p className='cursor-pointer text-zinc-600 text-sm mt-2 underline' onClick={() => changeDataValues(everyReturns)}>Volver</p>
                    </div>
                    :
                    null
                  }               
                 </div>
           )
         )}
           </div>
     )
   }

export default ReturnsTable
