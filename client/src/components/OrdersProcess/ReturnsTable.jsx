import React from 'react'
import { useEffect, useState, useRef } from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { formatePrice } from '../../functions/gralFunctions';
import Loading from '../Loading/Loading';
import OrderDetail from '../Orders/OrderDeatil';
import CreateNewReturn from '../Returns/CreateNewReturn';
import ReturnToWashing from '../Returns/ReturnToWashing';
import { useNavigate } from 'react-router-dom';

const ReturnsTable = ({todaysReturns, pendingReturns, everyReturns, returnsToFetch, updateList}) => {

    const tableRef = useRef(null);
    const navigate = useNavigate()
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [withOutCollections, setWithOutCollections] = useState(false);
    const [loadData, setLoadData] = useState(true)
    const [inputValue, setInputValue] = useState("")
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [withOutOrders, setWithOutOrders] = useState(false);

        const changeDataValues = (item) => { 
          wichTableShow(item)
        }

        const wichTableShow = (item) => { 
          if(item.length > 0) { 
            setWithOutOrders(false)
            setData(item)
          } else { 
            setWithOutOrders(true)
            setData(item)
          }
          
          console.log("item", item)
        }

        useEffect(() => {
          wichTableShow(everyReturns)
          console.log("ejecuto useeffect y  paso everyReturns")
        }, [todaysReturns, pendingReturns, everyReturns])

        
        useEffect(() => {

          console.log(data)
        }, [data])


        const getDataAndCreateTable = () => { 
            
            if(!withOutOrders) { 
                const propiedades = Object.keys(data[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== 'orderCreator'  && propiedad !== 'clientId' 
                &&  propiedad !== 'typeOfClient' && propiedad !== 'placeOfDelivery' && propiedad !== 'dateOfDelivery' && propiedad !== 'subletsDetail'  && propiedad !== 'orderDetail'  && propiedad !== 'date'
                && propiedad !== 'month' && propiedad !== 'year' && propiedad !== 'day' && propiedad !== 'clientZone' && propiedad !== 'paid' && propiedad !== 'missingArticlesData'  && propiedad !== 'downPaymentData' && propiedad !== 'shippingCost' && propiedad !== 'parcialPayment');
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

               if(data === everyReturns) { 
                  modifiedColumnObjects.push({
                    key: 'Pasar A Lavado',
                    label: 'Derivar',
                    cellRenderer: (cell) => { 
                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const orderNumber = filaActual.original.orderNumber;
                        const month = filaActual.original.month;
                        const orderDetail = filaActual.original.orderDetail;
                        const subletsDetail = filaActual.original.subletsDetail;
                        const missingArticlesData = filaActual.original.missingArticlesData;
                        const item = {
                        id: id,
                        orderNumber: orderNumber,
                        month: month,
                        orderDetail: orderDetail,
                        missingArticlesData: missingArticlesData,
                        subletsDetail: subletsDetail
                        };
                        return (
                         <ReturnToWashing orderData={item} updateList={updateList}/>
                        );
                    },
                    }) 
                 }
        
                modifiedColumnObjects.push({
                key: 'Detalle',
                label: 'Detalle',
                cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const detail = filaActual.original.orderDetail;
                    const orderSublets = filaActual.original.subletsDetail;
                    const missingArticlesData = filaActual.original.missingArticlesData;
                    const creator = filaActual.original.orderCreator;
                    const client = filaActual.original.client;
                    const clientId = filaActual.original.clientId;
                    const day = filaActual.original.day;
                    const month = filaActual.original.month;
                    const year = filaActual.original.year;
                    const total = filaActual.original.total;
                    const downPaymentData = filaActual.original.downPaymentData;
                    const paid = filaActual.original.paid;
                    const parcialPayment = filaActual.original.parcialPayment;
                    const discount = filaActual.original.discount;
                    const item = { id,  detail, orderSublets, creator, day,  month, year, total, client, clientId, downPaymentData, 
                      missingArticlesData, parcialPayment, paid, discount};
                    return (
                    <OrderDetail orderData={item}/>
                    );
                },
                }) 

                setColumns(modifiedColumnObjects);
                if (tableRef.current) {
                tableRef.current.updateColumns(modifiedColumnObjects);
                }            
            } else { 
              setWithOutOrders(true)
            }
        }

        const filteredData = data.filter((item) => {
          return Object.values(item).some((value) => {
             if (value === null) return false;
             return value.toString().toLowerCase().includes(inputValue.toLowerCase());
          });
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
      <div className='flex flex-col items-center justify-center 2xl:mt-12'>
      {loadData ? (
              <Loading />
              ) : (
               data.length > 0 && withOutOrders === false ? (
                  <>
                  <div className='flex flex-col items-center justify-start lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] rounded-t-lg rounded-b-none ' >
                     <div className='h-12 w-full flex justify-between items-center  bg-green-200 gap-10 rounded-t-lg rounded-b-none lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px]'>
                       <div className='flex justify-start w-full items-center ml-4 gap-6'>                   
                           <p className={`text-sm font-bold cursor-pointer text-zinc-600 ${data === everyReturns ? 'underline' : ''}`}  onClick={() => changeDataValues(everyReturns)}>Todas las Devoluciones</p>
                           <p className={`text-sm font-bold cursor-pointer text-zinc-600 ${data === pendingReturns ? 'underline' : ''}`} onClick={() => changeDataValues(pendingReturns)}>Devoluciones Pendientes</p>
                           <p className={`text-sm font-bold cursor-pointer text-zinc-600 ${data === todaysReturns ? 'underline' : ''}`}  onClick={() => changeDataValues(todaysReturns)}>Devoluciones del Dia en Local</p>
                           <p className={`text-sm font-bold cursor-pointer text-zinc-600 ${data === returnsToFetch ? 'underline' : ''}`}  onClick={() => changeDataValues(returnsToFetch)}>Devoluciones del Dia a domicilio</p>
                       </div>
                       <div className='flex items-center'>
                         <CreateNewReturn updateList={updateList}/>
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
                     isHeaderSticky={true}
                     columnSpacing={10}
                     aria-label="Selection behavior table example with dynamic content"
                     selectionBehavior={selectionBehavior}
                     className="w-full mt-2 lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
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
                       <CreateNewReturn updateList={updateList}/>
                       <p className='text-black mt-3 font-medium text-md'>No hay devoluciones</p> 
                       <p className='cursor-pointer text-zinc-600 text-sm mt-3 underline' onClick={() => changeDataValues(everyReturns)}>Volver a la pagina principal</p>
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
