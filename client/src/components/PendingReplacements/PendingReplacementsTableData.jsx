import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { useRef } from "react";
import { formatePrice } from '../../functions/gralFunctions';
import DeleteOrder from '../Modals/DeleteOrder';
import EditModal from '../Modals/EditModal';
import Loading from '../Loading/Loading';
import PurchaseDetail from '../Purchases/PurchaseDetail';
import PendingReplacementDetail from './PendingReplacementDetail';

const PendingReplacementsTableData = ({replacementes, updateList}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [tableData, setTableData] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [waitingData, setWaitingData] = useState(false)
    const [loadData, setLoadData] = useState(false)
    const [withOutPendingReplacements, setWithOutPendingReplacements] = useState(false)

    useEffect(() => { 
        setData(replacementes)
      }, [replacementes])

      const createTableData = () => { 

        if(data.length !== 0) { 
          const propiedades = Object.keys(replacementes[0]).filter(propiedad => propiedad !== 'replacementeDetail' && propiedad !== 'debtId'  && propiedad !== "orderCompletedData" && propiedad !== "clientId");
          const columnObjects = propiedades.map(propiedad => ({
              key: propiedad,
              label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
              allowsSorting: true
        }));

        const modifiedColumnObjects = columnObjects.map(column => {
            if (column.key === 'amountToPay') {
                return { ...column, label: 'Monto a Pagar' };
            } else if (column.key === 'clientName') {
                return { ...column, label: 'Cliente' };
            } else {
                return column;
            }
            });

        
        modifiedColumnObjects.push({
        key: 'Detalle',
        label: 'Detalle',
        cellRenderer: (cell) => { 
          const filaActual = cell.row;
          const debtId = filaActual.original.debtId;
          const detail = filaActual.original.replacementeDetail;
          const name = filaActual.original.clientName;
          const id = filaActual.original.clientId;
          const telephone = filaActual.original.telephone;
          const clientData = {name, id, telephone}
          const orderCompletedData = filaActual.original.orderCompletedData;
          const amountToPay = filaActual.original.amountToPay;
          const item = {debtId, detail, orderCompletedData, amountToPay, clientData};
          return (
            <PendingReplacementDetail data={item} updateList={updateList}/>
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
          setWaitingData(true)
        }    
}

            useEffect(() => { 
                setTimeout(() => { 
                    setLoadData(false)
                }, 2000)
            }, [columns, data])

            useEffect(() => { 
                if(data.length > 0) { 
                    createTableData()
                } else { 
                    setWithOutPendingReplacements(true)
                }
            }, [data])

            const filteredData = data.filter((item) => {
            return Object.values(item).some((value) => {
                if (value === null) return false;
                return value.toString().toLowerCase().includes(inputValue.toLowerCase());
            });
            });



  return (
    <div className='flex flex-col items-center justify-center mt-16 2xl:mt-12'>
    {columns.length !== 0 && data.length !== 0 ? (
           <>
             <div className='flex flex-col items-center justify-start lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] rounded-t-lg rounded-b-none'>
               <div className='h-12 items-center justify-between w-full flex bg-green-200 gap-10 rounded-t-lg rounded-b-none'>
                   <p className='font-medium text-zinc-600 text-sm ml-2'>Reposiciones Pendientes de Cobro</p>    
               </div>
               <div className='flex justify-between items-center w-full'>
                 <div className='w-full flex items-center gap-2 justify-start mt-4'>
                   <input
                     className="w-[55%] border ml-2 border-gray-200 focus:border-gray-300 focus:ring-0 h-10 rounded-xl focus:outline-none  focus:ring-blue-500" 
                     placeholder="Buscador"
                     onChange={(e) => setInputValue(e.target.value)}
                     value={inputValue}/> 
                 </div>
                 <div className='flex items-center justify-end mr-2 w-full'>
                   <p className='text-zinc-600 text-sm font-medium'>Total Pendiente: {formatePrice(filteredData.reduce((acc, el) => acc + el.amountToPay, 0))}</p>
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
                   <TableRow key={item.amountToPay}>
                     {columns.map((column) => (
                       <TableCell key={column.key}  className='text-left' >
                         {column.cellRenderer ? (
                           column.cellRenderer({ row: { original: item } })
                         ) : (
                           (column.key === "amountToPay") ? (
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
         ) : data.length === 0 ? (
             <div>
                <p className='font-medium text-zinc-600'>No hay compras para los Filtros aplicados.</p>
             
             </div>
         ) : (
           <Loading/>
         )}
   </div>
  )
}

export default PendingReplacementsTableData
