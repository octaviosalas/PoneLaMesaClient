import React from 'react'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import Loading from "../Loading/Loading"
import DeleteOrder from '../Modals/DeleteOrder';
import EditOrder from '../Modals/EditOrder';
import OrderDetail from '../Modals/OrderDeatil';
import CreateNewOrder from '../Modals/CreateNewOrder';
import FiltersOrdersTable from '../Modals/FiltersOrdersTable';

const OrdersTable = () => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [inputValue, setInputValue] = useState("")
    const [tableData, setTableData] = useState([])


    const applyFiltersByMonth =  (monthSelected) => {
        getDataAndCreateTable();
        setTimeout(() => { 
            const filteringByMonth = filteredData.filter((orders) => orders.month === monthSelected);
            console.log(filteringByMonth);
            setData(filteringByMonth);
        }, 1500)
      };

    const getDataAndCreateTable = () => { 
        axios.get("http://localhost:4000/orders")
        .then((res) => { 
          const allOrders = res.data
          console.log(allOrders)
          setData(allOrders)
          if(allOrders.length !== 0) { 
              const propiedades = Object.keys(res.data[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== '__v' 
              && propiedad !== 'orderDetail'  && propiedad !== 'orderCreator' && propiedad !== 'month' && propiedad !== 'year' && propiedad !== 'day');
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
                      return { ...column, label: 'Lugar Entrega' };
                  }  else if (column.key === 'Entrega') {
                      return { ...column, label: 'Fecha de Entrega' };
                  } else if (column.key === 'returnDate') {
                      return { ...column, label: 'Fecha Devolucion' };
                  } else if (column.key === 'returnPlace') {
                      return { ...column, label: 'Lugar Devolucion' };
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
                        
                        const item = {
                        id: id,
                        };
                        return (
                          <EditOrder/>
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
                       <DeleteOrder/>
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
                        <FiltersOrdersTable apply={applyFiltersByMonth}/> 
                  </div>
                  <div className='flex justify-start mr-4'>
                      <CreateNewOrder updateList={getDataAndCreateTable}/>
                  </div>
                           
              </div>
              <div className='w-full flex jusitfy-start mt-4'>
                <input 
                    className="w-[50%] border border-gray-200  focus:border-gray-300 focus:ring-0 h-10 rounded-xl"
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
          className="w-full mt-6 lg:w-[800px] xl:w-[1200px] 2xl:w-[1300px] h-auto text-center shadow-left-right overflow-y-auto max-h-[600px]"
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
                  <TableCell key={column.key} className='text-left'>
                      {column.cellRenderer ? column.cellRenderer({ row: { original: item } }) : item[column.key]}
                  </TableCell>
                  ))}
             </TableRow>
                )}
          </TableBody>
       </Table> 
         </>
          
       : <Loading/>}
        </div>
    </div>
  )
}

export default OrdersTable
