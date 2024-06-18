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
import impresora from "../../images/impresora.png"
import ChangeState from '../Orders/ChangeState';
import PostPayment from "../Orders/PostPayment"

const DoubleConditionTable = ({tableData, typeOfOrders, everyReparts, everyRemoves, everyDeliveries, ordersToRepartToday, futuresReparts, again}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const navigate = useNavigate()
    const [columns, setColumns] = useState([]);
    const [withOutOrders, setWithOutOrders] = useState(false);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [inputValue, setInputValue] = useState("")
    const [loadData, setLoadData] = useState(true)

        const selectWichDataShow = () => {
          console.log("selectWichOrderDataShow") 
          if(tableData.length > 0) { 
            setData(tableData)
           } else if (typeOfOrders === "entregas" && everyDeliveries.length > 0 && tableData.length === 0) { 
             setData(everyDeliveries)
           } else if (typeOfOrders === "entregas" && futuresReparts.length > 0 && everyDeliveries.length === 0) { 
             setData(futuresReparts)
           } else { 
            setWithOutOrders(true)
           }
        }


        useEffect(() => { 
          selectWichDataShow()
          console.log("ejecutando la misma pero en el useEffect")
        }, [tableData, ordersToRepartToday, futuresReparts ])

        const changeTypeOfData = (item) => { 
          setData(item)
          return data
        }

        const getDataAndCreateTable = () => { 
                selectWichDataShow()
                if(data.length !== 0) { 
                  setWithOutOrders(false)
                const propiedades = Object.keys(data[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== '__v' 
                    && propiedad !== 'orderDetail'&&  propiedad !== 'clientId'  && propiedad !== 'orderCreator'   && propiedad !== 'subletsDetail' && propiedad !== 'month' && propiedad !== 'year'
                    && propiedad !== 'day' && propiedad !== 'paid' && propiedad !== "missingArticlesData"  && propiedad !== 'downPaymentData'  && propiedad !== 'shippingCost');
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
            
                    modifiedColumnObjects.push({
                    key: 'Detalle',
                    label: 'Detalle',
                    cellRenderer: (cell) => { 
                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const detail = filaActual.original.orderDetail;
                        const creator = filaActual.original.orderCreator;
                        const client = filaActual.original.client;
                        const day = filaActual.original.day;
                        const month = filaActual.original.month;
                        const year = filaActual.original.year;
                        const total = filaActual.original.total;
                        const orderSublets = filaActual.original.subletsDetail;
                        const downPaymentData = filaActual.original.downPaymentData;
                        const paid = filaActual.original.paid;
                        const missingArticlesData = filaActual.original.missingArticlesData;
                        const item = { id, orderSublets, detail, creator, day,year, total, client, downPaymentData, paid, missingArticlesData};
                        return (
                        <OrderDetail orderData={item}/>
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
                            const item = {id, client, status,order,month,  date, dateOfDelivery,returnDate, orderDetail};
                            return (
                            <EditModal type="orders" statusOrder={status} orderData={item} updateList={again} />
                            );
                        },
                    })          

                    modifiedColumnObjects.push({
                      key: 'Estado',
                      label: 'Estado',
                      cellRenderer: (cell) => { 
    
                          const filaActual = cell.row;
                          const id = filaActual.original._id;
                          const status = filaActual.original.orderStatus;
                          const item = {id, status};
                          return (
                            <ChangeState status={status} orderData={item} updateList={getDataAndCreateTable}/>
                          );
                      },
                    })   

                    modifiedColumnObjects.push({
                      key: 'Pago',
                      label: 'Pago',
                      cellRenderer: (cell) => { 
                        const filaActual = cell.row;
                        const id = filaActual.original._id;
                        const detail = filaActual.original.orderDetail;
                        const paid = filaActual.original.paid;
                        const creator = filaActual.original.orderCreator;
                        const client = filaActual.original.client;
                        const clientId = filaActual.original.clientId;
                        const day = filaActual.original.day;
                        const month = filaActual.original.month;
                        const year = filaActual.original.year;
                        const total = filaActual.original.total;
                        const downPaymentData = filaActual.original.downPaymentData
                        const item = {  id, detail,  paid,  creator,day, month,year, total,client, clientId, downPaymentData};
                        return (
                           <PostPayment orderData={item} updateList={getDataAndCreateTable}/>
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
                        const orderStatus = filaActual.original.orderStatus;
                        const item = {id, downPaymentData, orderStatus};
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

        const createNewPdf = async () => { 
          console.log(data)
          const dataFormatedToList = data.map((d) => ( 
             {
              NumeroDeOrden: d.orderNumber,
              Cliente: d.client,
              DireccionDeEnvio: d.placeOfDelivery,
              Detalle: d.orderDetail.map((ord) => ({ 
                 Articulo: ord.productName,
                 Cantidad: ord.quantity

             }))
             }
          ))
          console.log(dataFormatedToList)
          try {
              const response = await axios.post("http://localhost:4000/orders/createPdf", {dataFormatedToList}, {
                  responseType: 'blob',
              });
              const blob = new Blob([response.data], { type: 'application/pdf' });      
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = 'archivo.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } catch (error) {
              console.log(error);
          }
        };


  return (
    <div className='flex flex-col items-center justify-center 2xl:mt-12'>
       {loadData ? (
         <Loading />
           ) : (
             columns.length > 0 && data.length > 0 ? (
               <>
                   <div className='flex flex-col items-center justify-start lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] rounded-t-lg rounded-b-none ' >
              <div className='h-12 items-center justify-between w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none'>
                    <div className='flex w-full justify-between items-center ml-4'>
                      {typeOfOrders === "entregas" ? 

                        <div className='flex items-center gap-6 justify-start text-start'>
                              <p className={`text-sm font-bold text-zinc-600 cursor-pointer ${data === tableData ? 'underline' : ''}`} onClick={() => changeTypeOfData(tableData)}>Entrega del dia en Local</p> 
                              <p className={`text-sm font-bold text-zinc-600 cursor-pointer ${data === ordersToRepartToday ? 'underline' : ''}`} onClick={() => changeTypeOfData(ordersToRepartToday)}> Pedidos para Repartir en el Dia
                              </p>
                              <p className={`text-sm font-bold text-zinc-600 cursor-pointer ${data === everyDeliveries ? 'underline' : ''}`} onClick={() => changeTypeOfData(everyDeliveries)}>Pedidos Entregados</p> 
                              <p className={`text-sm font-bold text-zinc-600 cursor-pointer ${data === futuresReparts ? 'underline' : ''}`} onClick={() => changeTypeOfData(futuresReparts)}>Futuros Repartos</p> 
                        </div>                       
                    
                       : null}

                       {data === ordersToRepartToday || data === futuresReparts? 
                       <div className='flex items-center justify-end'>
                          <img className='h-7 w-7 cursor-pointer' title="Imprimir reparto del Dia" onClick={() => createNewPdf()} src={impresora}/>
                       </div>
                   
                        : null}

                     {typeOfOrders === "DevolucionesLocal" ? <p className='text-sm font-bold text-zinc-600'>Devoluciones del dia en Local</p> : null}

                  
                     {typeOfOrders === "Retiros" ?
                        <div className='flex items-center gap-6 justify-start text-start'>
                            <p className={`text-sm font-bold text-zinc-600 cursor-pointer ${data === tableData ? 'underline' : ''}`} onClick={() => changeTypeOfData(tableData)}>Retiros del Dia</p> 
                            <p className={`text-sm font-bold text-zinc-600 cursor-pointer ${data === everyRemoves ? 'underline' : ''}`} onClick={() => changeTypeOfData(everyRemoves)}>Todos los Retiros</p> 
                        </div>
                      : null}
                    </div>
                    <div className='flex justify-start mr-4'></div>
                  </div>
                  <div className='w-full flex items-center gap-2 justify-start mt-4 mb-2'>
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
                  className="w-full mt-2lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
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
                <div className='flex flex-col'>
                   
                {data === everyDeliveries ? (
                  <div className='flex flex-col items-center justify-center'>
                    <p className='text-black font-medium text-md'>No hay pedidos entregados</p>
                    <p className='underline text-sm mt-4 cursor-pointer' onClick={() => navigate("/pedidos")}>Volver</p>
                  </div>
                ) : data === tableData ? (
                  <p className='text-black font-medium text-md'>No Hay pedidos para entrega de Local con fecha de Hoy</p>
                ) : data === futuresReparts ? (
                  <p className='text-black font-medium text-md'>No Hay pedidos para repartir en los próximos días</p>
                ) : data === ordersToRepartToday ? (
                  <p className='text-black font-medium text-md'>No Hay pedidos para repartir hoy</p>
                ) : null}
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

export default DoubleConditionTable
