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
import CreateSublet from '../ArticlesTable/CreateSublet';
import FindSublet from '../Sublets/FindSublet';
import CleaningDetail from '../Modals/CleaningDetail';
import CreateDownPayment from '../Orders/CreateDownPayment';



const ProcessTables = ({orderStatus}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const navigate = useNavigate()
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [inputValue, setInputValue] = useState("")
    const [loadData, setLoadData] = useState(true)
    const [actualDay, setActualDay] = useState(getDay())
    const [actualMonth, setActualMonth] = useState(getMonth())
    const [actualYear, setActualYear] = useState(getYear())
    const [actualDate, setActualDate] = useState(getDate())
    const [viewJustToday, setViewJustToday] = useState(false)

    const comeBackBecauseTheAreNoResults = () => { 
      const formattedOrderStatus = orderStatus.split(' ').join('');
      navigate(`/${formattedOrderStatus}`);
      setViewJustToday(false);
  }

       const getDataAndCreateTable = () => { 
        axios.get("http://localhost:4000/orders")
        .then((res) => { 
             const allOrders = res.data
             const filterOrdersByStatus = allOrders.filter((ord) => ord.orderStatus === orderStatus)
             const filterOrdersByToday = allOrders.filter((ord) => ord.orderStatus === orderStatus && ord.dateOfDelivery === actualDate)
             {viewJustToday ? setData(filterOrdersByToday) :  setData(filterOrdersByStatus)}
             if(filterOrdersByStatus.length !== 0) { 
               const propiedades = Object.keys(filterOrdersByStatus[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== '__v' 
               && propiedad !== 'orderDetail'  && propiedad !== 'subletsDetail' && propiedad !== 'missingArticlesData' &&  propiedad !== 'clientId' && propiedad !== 'orderCreator' && propiedad !== 'month' && propiedad !== 'year' && propiedad !== 'day' && propiedad !== 'paid'   && propiedad !== 'downPaymentData');
               const columnObjects = propiedades.map(propiedad => ({
                  key: propiedad,
                  label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                  allowsSorting: true
              }));

                  const modifiedColumnObjects = columnObjects.map(column => {
                    if (column.key === 'date') {
                        return { ...column, label: 'Fecha' };
                    } else if (column.key === 'dateOfDelivery') {
                        return { ...column, label: 'Fecha  Entrega' };
                    } else if (column.key === 'orderNumber') {
                        return { ...column, label: 'Orden' };
                    }  else if (column.key === 'orderStatus') {
                        return { ...column, label: 'Estado' };
                    } else if (column.key === 'placeOfDelivery') {
                        return { ...column, label: 'Entrega' };
                    }  else if (column.key === 'Entrega') {
                        return { ...column, label: 'Fecha de Entrega' };
                    } else if (column.key === 'returnDate') {
                        return { ...column, label: 'Fecha Devolucion' };
                    } else if (column.key === 'returnPlace') {
                        return { ...column, label: 'Devolucion' };
                    }else if (column.key === 'typeOfClient') {
                        return { ...column, label: 'Tipo de Cliente' };
                    }else if (column.key === 'client') {
                        return { ...column, label: 'Cliente' };
                    }else {
                        return column;
                    }
                  });

                 {orderStatus ===  "A Confirmar" ?
                  modifiedColumnObjects.push({
                    key: 'Anexar SuAlquiler',
                    label: 'Anexar SuAlquiler',
                    cellRenderer: (cell) => { 
                      const filaActual = cell.row; 
                      const id = filaActual.original._id;    
                      const total = filaActual.original.total; 
                      const orderDetail = filaActual.original.orderDetail;
                      const item = {  id, orderDetail, total }             
                      return ( 
                         <FindSublet orderData={item} updateListOfToBeConfirmedOrders={getDataAndCreateTable}/>
                        );
                     },
                    }) : null}

                    {orderStatus ===  "Armado" ?
                      modifiedColumnObjects.push({
                      key: 'Seña',
                      label: 'Seña',
                      cellRenderer: (cell) => { 
                        const filaActual = cell.row; 
                        const id = filaActual.original._id;    
                        const total = filaActual.original.total; 
                        const month = filaActual.original.month; 
                        const year = filaActual.original.year; 
                        const orderNumber = filaActual.original.orderNumber; 
                        const client = filaActual.original.client; 
                        const clientId = filaActual.original.clientId; 
                        const detail = filaActual.original.orderDetail;
                        const downPaymentData = filaActual.original.downPaymentData;  
                        const item = {id, total, month, year, orderNumber, client, detail, clientId, downPaymentData}             
                        return ( 
                           <CreateDownPayment orderData={item} updateList={getDataAndCreateTable}/>
                          );
                       },
                      }) : null}
           
                 {orderStatus !== "Lavado" ? 
                  modifiedColumnObjects.push({
                  key: 'Detalle',
                  label: 'Detalle',
                  cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const detail = filaActual.original.orderDetail;
                    const orderSublets = filaActual.original.subletsDetail;
                    const creator = filaActual.original.orderCreator;
                    const client = filaActual.original.client;
                    const day = filaActual.original.day;
                    const month = filaActual.original.month;
                    const year = filaActual.original.year;
                    const total = filaActual.original.total;
                    const downPaymentData = filaActual.original.downPaymentData; 
                    const paid = filaActual.original.paid;
                    const missingArticlesData = filaActual.original.missingArticlesData;
                    const item = { id, detail,orderSublets, creator, day, month, year,total, client, downPaymentData, paid, missingArticlesData};
                    return (
                       <OrderDetail orderData={item}/>
                      );
                 },
                  }) 

                  : 
                  
                  modifiedColumnObjects.push({
                    key: 'Detalle',
                    label: 'Detalle',
                    cellRenderer: (cell) => { 
                      const filaActual = cell.row;
                      const id = filaActual.original._id;
                      const detail = filaActual.original.orderDetail;
                      const orderSublets = filaActual.original.subletsDetail;
                      const creator = filaActual.original.orderCreator;
                      const client = filaActual.original.client;
                      const day = filaActual.original.day;
                      const month = filaActual.original.month;
                      const year = filaActual.original.year;
                      const total = filaActual.original.total;
                      const downPaymentData = filaActual.original.downPaymentData; 
                      const paid = filaActual.original.paid;
                      const missingArticlesData = filaActual.original.missingArticlesData;

                      const item = { id, detail, orderSublets,missingArticlesData, creator, day, month, year,total, client, downPaymentData, paid};
                      return (
                         <CleaningDetail orderData={item}/>
                        );
                  },
                    }) 
                  }

                 

                  modifiedColumnObjects.push({
                    key: 'Editar',
                    label: 'Editar',
                    cellRenderer: (cell) => { 

                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const client = filaActual.original.client;
                        const order = filaActual.original.orderNumber;
                        const month = filaActual.original.month;
                        const date = filaActual.original.date;
                        const dateOfDelivery = filaActual.original.dateOfDelivery;
                        const returnDate = filaActual.original.returnDate;
                        const orderDetail = filaActual.original.orderDetail;
                        const item = {id, client, order, month, date, dateOfDelivery, returnDate,orderDetail};
                        return (
                          <EditModal type="orders" statusOrder={orderStatus} orderData={item} updateList={getDataAndCreateTable}/>
                        );
                    },
                  })          
                               
                  modifiedColumnObjects.push({
                  key: 'Eliminar',
                  label: 'Eliminar',
                  cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const downPaymentData = filaActual.original.downPaymentData;
                    const item = {downPaymentData, id};
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
              }else { 
                console.log("No hay ordenes")
              }
            })
            .catch((err) => { 
              console.log(err)
            })
       }

       useEffect(() => { 
        getDataAndCreateTable()
       }, [viewJustToday])
 
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

   return (
    <div className='flex flex-col items-center justify-center 2xl:mt-12'>
       {loadData ? (
         <Loading />
           ) : (
             columns.length > 0 && data.length > 0 ? (
               <>
                  <div className='flex flex-col items-center justify-start lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] rounded-t-lg rounded-b-none ' >
                  <div className='h-12 lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] flex  bg-green-200 gap-10 rounded-t-lg rounded-b-none'>
                    <div className='flex w-full '>
                     {orderStatus === "A Confirmar" &&
                            <div className='flex items-center w-full justify-between'> 
                              <p className='font-bold cursor-pointer ml-4'>Pedidos A confirmar</p>
                              <CreateSublet/>
                            </div>
                       }
                      {orderStatus === "Reparto" &&
                            <div className='flex items-center w-full justify-between '> 
                              <p className='font-bold cursor-pointer ml-4'>Pedidos en Reparto</p>
                              <p className='font-bold cursor-pointer ml-4'>Pedidos pare Retirar</p>
                              <p className='font-bold cursor-pointer text-md' onClick={() => setViewJustToday(true)}>Ver Reparto del dia</p>
                            </div>
                       }
                      {orderStatus === "Lavado" &&
                            <div className='flex items-center w-full justify-between '> 
                              <p className='font-bold ml-4'>Pedidos en Lavado</p>                      
                            </div>
                       }
                       {/*    <p className={`text-sm font-bold text-zinc-600 cursor-pointer ${data === tableData ? 'underline' : ''}`} onClick={() => changeTypeOfData(tableData)}>Retiros del Dia</p>  */}
                      {orderStatus === "Armado" &&
                            <div className='flex items-center w-full justify-start gap-8 '> 
                              <p className={`font-bold cursor-pointer text-sm ml-4 ${viewJustToday === false ? "underline" : ""}`} onClick={() => setViewJustToday(false)}>Pedidos en Armado</p>
                              <p className={`font-bold cursor-pointer text-sm ml-4 ${viewJustToday === true ? "underline" : ""}`} onClick={() => setViewJustToday(true)}>Para entregar Hoy</p>
                            </div>
                       }
                        {orderStatus === "Retiro en Local" &&
                            <div className='flex items-center w-full justify-between '> 
                              <p className='font-bold cursor-pointer text-md ml-4' onClick={() => setViewJustToday(false)}>Pedidos para Retiro en Local</p>
                              <p className='font-bold cursor-pointer text-md' onClick={() => setViewJustToday(true)}>Ver Retiros del dia</p>
                            </div>
                       }
                      {orderStatus === "Devuelto" && 
                      <p className='font-bold ml-4'>Pedidos Devueltos</p>
                      }
                    </div>
                    <div className='flex justify-start mr-4'></div>
                  </div>
                  <div className='w-full flex items-center gap-2 justify-start mt-4'>
                    <input
                      className="w-[35%] border ml-2 border-gray-200 focus:border-gray-300 focus:ring-0 h-10 rounded-xl focus:outline-none  focus:ring-blue-500" 
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
                viewJustToday ? 
                 <p className='text-black font-medium text-md '>La fecha de hoy no posee pedidos en {orderStatus}</p> 
                 :
                 <p className='text-black font-medium text-md '>No hay pedidos en {orderStatus}</p>
                 }

                 {
                    viewJustToday ?
                    <p className='text-sm text-zinc-600 underline cursor-pointer mt-4' onClick={() => setViewJustToday(false)}>Volver</p>
                    :
                    <Link to="/articulos"><p className='text-sm text-zinc-600 underline cursor-pointer mt-4'>Volver</p></Link>
                 }
              </div>
        )
      )}
        </div>
  )
}

export default ProcessTables