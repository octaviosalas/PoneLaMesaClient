import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { useRef } from "react";
import { formatePrice } from '../../functions/gralFunctions';
import EditModal from '../Modals/EditModal';
import DeleteOrder from '../Modals/DeleteOrder';
import CreateExpense from './CreateExpense';
import Loading from '../Loading/Loading';
import CreateNewPurchase from '../Purchases/CreateNewPurchase';
import CreateSublet from '../ArticlesTable/CreateSublet';


const ExpensesTable = ({expensesData, updateList}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [inputValue, setInputValue] = useState("")
    const [loadData, setLoadData] = useState(false)
    const [withOutExpenses, setWithOutExpenses] = useState(false)

    useEffect(() => { 
        setData(expensesData)
        console.log(expensesData)
      }, [expensesData])

      const getExpensesDataAndCreateTable = () => { 
        if(data.length > 0) { 
            console.log("toy")
            const propiedades = Object.keys(expensesData[0]).filter(propiedad =>  propiedad !== '_id' &&  
            propiedad !== '__v'  &&  propiedad !== 'expenseDetail'  &&  propiedad !== 'date'  &&  
            propiedad !== 'year' &&  propiedad !== 'day'  &&  propiedad !== 'providerId'   &&  propiedad !== 'loadedById' &&  propiedad !== 'providerName');
            const columnObjects = propiedades.map(propiedad => ({
                key: propiedad,
                label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                allowsSorting: true
            }));

        const modifiedColumnObjects = columnObjects.map(column => {
          if (column.key === 'loadedByName') {
                return { ...column, label: 'Creador' };
            } else if (column.key === 'month') {
                return { ...column, label: 'Mes' };
            }  else if (column.key === 'amount') {
                return { ...column, label: 'Total' };
            }  else if (column.key === 'typeOfExpense') {
                return { ...column, label: 'Razon' };
            } else {
                return column;
            }
        });

        modifiedColumnObjects.push({
            key: 'Editar',
            label: 'Editar',
            cellRenderer: (cell) => {     
                const filaActual = cell.row;
                const id = filaActual.original._id;   
                const day = filaActual.original.day;      
                const month = filaActual.original.month;
                const year = filaActual.original.year;
                const detail = filaActual.original.purchaseDetail;
                const item = {id, month,year, detail, day };
                return (
                  <EditModal type="purchase" updatePurchaseList={updateList} purchaseData={item}/>
                );
            },
        })      
        
        modifiedColumnObjects.push({
          key: 'Eliminar',
          label: 'Eliminar',
          cellRenderer: (cell) => { 
            const filaActual = cell.row;
            const id = filaActual.original._id;
            const item = {id};
            return (
              <DeleteOrder type="purchase" purchaseData={item} updatePurchasesList={updateList}/>
              );
        },
        }) 

       /* modifiedColumnObjects.push({
        key: 'Detalle',
        label: 'Detalle',
        cellRenderer: (cell) => { 
          const filaActual = cell.row;
          const id = filaActual.original._id;
          const date = filaActual.original.date;
          const day = filaActual.original.day;
          const month = filaActual.original.month;
          const year = filaActual.original.year;
          const detail = filaActual.original.purchaseDetail;
          const creator = filaActual.original.creatorPurchase;
          const total = filaActual.original.total;
          const item = {
          id: id, detail,  date, day, month, year, creator, total};
          return (
            <PurchaseDetail purchaseData={item}/>
            );
      },
        }) */

        setColumns(modifiedColumnObjects);
        console.log(modifiedColumnObjects)
        if (tableRef.current) {
            tableRef.current.updateColumns(modifiedColumnObjects);
        }            
        } else { 
          console.log("VACIO")
          setWaitingData(true)
        }

     
      
      }

      useEffect(() => { 
        setTimeout(() => { 
            setLoadData(false)
        }, 2000)
    }, [columns, data])

    useEffect(() => { 
        console.log("me ejecuto")
      if(data.length > 0) { 
        getExpensesDataAndCreateTable()
        console.log("mnado")
      } else { 
        setWithOutExpenses(true)
        console.log("n omando")

      }
    }, [data])

    const filteredData = data.filter((item) => {
        return Object.values(item).some((value) => {
           if (value === null) return false;
           return value.toString().toLowerCase().includes(inputValue.toLowerCase());
        });
       });



  return (
    <div>  
        <div className='flex flex-col items-center justify-center mt-16 2xl:mt-12'>
         {columns.length !== 0 && data.length !== 0 ? 
                <>
                  <div className='flex flex-col items-center justify-start lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] rounded-t-lg rounded-b-none'>
                    <div className='h-12 items-center justify-between w-full flex bg-green-200 gap-10 rounded-t-lg rounded-b-none'>
                         <div className='flex justify-start'>
                           <p className='text-zinc-600 font-medium text-sm ml-2'>Todos los Gastos</p>
                         </div>
                         <div className='flex justify-end mr-4 gap-4'>
                           <CreateNewPurchase/>
                           <CreateSublet/>
                           <CreateExpense updateList={updateList}/>  
                         </div>          
                    </div>
                    <div className='flex justify-between items-center w-full'>
                      <div className='w-full flex items-center gap-2 justify-start mt-4'>
                        <input
                          className="w-[35%] border ml-2 border-gray-200 focus:border-gray-300 focus:ring-0 h-10 rounded-xl focus:outline-none  focus:ring-blue-500" 
                          placeholder="Buscador"
                          onChange={(e) => setInputValue(e.target.value)}
                          value={inputValue}/>                                            
                       </div>                     
                     </div>
                  </div>
                  <Table 
                    columnAutoWidth={true} 
                    columnSpacing={10}  
                    aria-label="Selection behavior table example with dynamic content"   
                    selectionBehavior={selectionBehavior} 
                    className="w-full mt-2 lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-left-right shadow-2xl shadow-top shadow-left-right overflow-y-auto"
                  >
                    <TableHeader columns={columns}>
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
                                (column.key === "amount") ? (
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
              : null}
        </div>
    </div>
  )
}

export default ExpensesTable
