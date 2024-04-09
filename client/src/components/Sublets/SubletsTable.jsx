import React from 'react'
import { useEffect, useState, useRef } from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import DeleteOrder from '../Modals/DeleteOrder';
import EditModal from '../Modals/EditModal';
import OrderDetail from '../Orders/OrderDeatil';
import { formatePrice } from '../../functions/gralFunctions';
import Loading from '../Loading/Loading';
import UseSubletToOrder from './UseSubletToOrder';
import SubletDetail from './SubletDetail';


const SubletsTable = ({sublets, update}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [withOutCollections, setWithOutCollections] = useState(false);
    const [loadData, setLoadData] = useState(true)
    const [inputValue, setInputValue] = useState("")
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");



    useEffect(() => { 
        setData(sublets)
     }, [sublets])

        const getDataAndCreateTable = () => { 
            if(data.length !== 0) { 
            const propiedades = Object.keys(sublets[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== 'used'  && propiedad !== 'providerId' &&  propiedad !== 'day' && propiedad !== 'month' && propiedad !== 'year'  && propiedad !== 'productsDetail' );
            const columnObjects = propiedades.map(propiedad => ({
                key: propiedad,
                label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                allowsSorting: true
            }));

                const modifiedColumnObjects = columnObjects.map(column => {
                    if (column.key === 'date') {
                        return { ...column, label: 'Fecha' };
                    } else if (column.key === 'provider') {
                        return { ...column, label: 'Proveedor' };
                    } else if (column.key === 'amount') {
                        return { ...column, label: 'Total' };                
                    }else {
                        return column;
                    }
                });

                modifiedColumnObjects.push({
                  key: 'Derivar',
                  label: 'Derivar',
                  cellRenderer: (cell) => { 
                      const filaActual = cell.row;
                      const id = filaActual.original._id;
                      const productsDetail = filaActual.original.productsDetail;
                      const amount = filaActual.original.amount;
                      const provider = filaActual.original.provider;
                      const used = filaActual.original.used;
                      const item = { id, productsDetail, amount, provider, used, };
                      return (
                       <UseSubletToOrder subletData={item} update={update}/>
                      );
                  },
                  }) 
        
                modifiedColumnObjects.push({
                key: 'Detalle',
                label: 'Detalle',
                cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const provider = filaActual.original.provider;
                    const amount = filaActual.original.amount;
                    const client = filaActual.original.client;
                    const day = filaActual.original.day;
                    const month = filaActual.original.month;
                    const year = filaActual.original.year;
                    const used = filaActual.original.used;
                    const productsDetail = filaActual.original.productsDetail;
                    const item = {id, provider, amount, day, month, year, used,  client, productsDetail};
                    return (
                    <SubletDetail subletDetailData={item}/>
                    );
                },
                }) 

                modifiedColumnObjects.push({
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
                        const amount = filaActual.original.amount;
                        const item = {id,  provider, month, day, date, productsDetail, amount};
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
                    const item = {id, subletProductsDetail};
                    return (
                    <DeleteOrder type="sublets" subletData={item} updateSubletsList={update}/> 
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
                console.log("ejecuto data mas a 0")
                } else { 
                    setWithOutCollections(true)
                }
            }, [data])

     return (
      <div className='flex flex-col items-center justify-center mt-16 2xl:mt-12'>
          {loadData ? (
            <Loading />
              ) : (
               data.length > 0 ? (
                  <>
                  <div className='flex flex-col items-center justify-center'>
                     <div className='h-12 lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] flex  bg-green-200 gap-10 rounded-t-lg rounded-b-none'>
                       <div className='flex justify-between w-full items-center ml-4'>                   
                           <p className='text-sm font-bold text-zinc-600'>Sub Alquileres Realizados</p>
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
                    <p className='text-black font-medium text-md '>No hay SubAlquileres</p> 
                    :
                    null
                  }               
                 </div>
           )
         )}
           </div>
     )
   }

export default SubletsTable
