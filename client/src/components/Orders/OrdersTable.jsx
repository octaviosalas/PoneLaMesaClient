import React from 'react'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import Loading from "../Loading/Loading"
import DeleteOrder from '../Modals/DeleteOrder';
import EditOrder from '../Modals/EditOrder';
import OrderDetail from './OrderDeatil';
import CreateNewOrder from './CreateNewOrder';
import FiltersOrdersTable from './FiltersOrdersTable';
import { formatePrice } from '../../functions/gralFunctions';
import PostPayment from './PostPayment';

const OrdersTable = () => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [inputValue, setInputValue] = useState("")
    const [filterIsOn, setFilterIsOn] = useState(false)
    const [tableData, setTableData] = useState([])


    const applyFiltersByMonth =  (monthSelected) => {
            const filteringByMonth = filteredData.filter((orders) => orders.month === monthSelected);
            console.log(filteringByMonth);
            setData(filteringByMonth);
      };

    const applyFiltersByTypeOfClient =  (typeSelected) => {
      const filteringByTypeOfClient = filteredData.filter((orders) => orders.typeOfClient === typeSelected);
      console.log(filteringByTypeOfClient);
      setData(filteringByTypeOfClient);
    };

    const applyFiltersByOrderState =  (state) => {
      const filteringByTypeOfClient = filteredData.filter((orders) => orders.orderStatus === state);
      console.log(filteringByTypeOfClient);
      setData(filteringByTypeOfClient);
    };

    const isFilterApplied = (value) => { 
        setFilterIsOn(value)
    }

    const undoFilter = () => { 
      setFilterIsOn(false)
      getDataAndCreateTable()
    }

    const getDataAndCreateTable = () => { 
        axios.get("http://localhost:4000/orders")
        .then((res) => { 
          const allOrders = res.data
          console.log(allOrders)
          setData(allOrders)
          if(allOrders.length !== 0) { 
              const propiedades = Object.keys(res.data[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== '__v' 
              && propiedad !== 'orderDetail'  && propiedad !== 'orderCreator' && propiedad !== 'month' && propiedad !== 'year'
              && propiedad !== 'day' && propiedad !== 'paid');
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
                    const item = {
                    id: id,
                    detail: detail,
                    creator: creator,
                    day: day,
                    month: month,
                    year: year,
                    total: total,
                    client: client
                    };
                    return (
                       <OrderDetail  orderData={item}/>
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
                        const month = filaActual.original.month
                        const item = {
                        id: id,
                        client: client,
                        order: order,
                        month: month
                        };
                        return (
                          <EditOrder type="orders" orderData={item} updateList={getDataAndCreateTable}/>
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

                  modifiedColumnObjects.push({
                    key: 'Pago',
                    label: 'Pago',
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
                      const item = {
                      id: id,
                      detail: detail,
                      creator: creator,
                      day: day,
                      month: month,
                      year: year,
                      total: total,
                      client: client
                      };
                      return (
                         <PostPayment orderData={item}/>
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
    }, [])

    const filteredData = data.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(inputValue.toLowerCase())
        );
      });


  return (
    <div>
         <div className='flex flex-col items-center justify-center'>
         {columns.length !== 0 && data.length !== 0? 
         <>
          <div className='flex flex-col items-center justify-start w-full rounded-t-lg rounded-b-none ' >
              <div className='h-12 items-center justify-between w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none'>
                  <div className='flex justify-end'>
                        <FiltersOrdersTable 
                        getAllDataAgain={getDataAndCreateTable} 
                        applyMonthFilter={applyFiltersByMonth}
                        applyClientFilter={applyFiltersByTypeOfClient}
                        applyOrderStatusFilter={applyFiltersByOrderState}
                        isFilterApplied={isFilterApplied}/> 
                  </div>
                  <div className='flex justify-start mr-4'>
                      <CreateNewOrder updateList={getDataAndCreateTable}/>
                  </div>
                           
              </div>
              <div className='w-full flex items-center gap-2 jusitfy-start mt-4'>
                <input 
                    className="w-[50%] border border-gray-200  focus:border-gray-300 focus:ring-0 h-10 rounded-xl"
                    placeholder="Buscador" 
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue} />
                    {filterIsOn ? 
                    <p className='text-xs text-zinc-500 font-medium cursor-pointer' onClick={() => undoFilter()}>
                        Deshacer Filtro
                    </p>
                     : null}
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
         </> 
       : 
       <div className='flex flex-col items-center justify-center'>
          <p className='font-medium text-zinc-500 text-md'>No hay ordenes que cumplan con los filtros aplicados</p>
          <p className='mt-4 text-xs underline font-bold cursor-pointer' onClick={() => getDataAndCreateTable()}>Deshacer Filtros</p>
       </div> 
       }
        </div>
    </div>
  )
}

export default OrdersTable

