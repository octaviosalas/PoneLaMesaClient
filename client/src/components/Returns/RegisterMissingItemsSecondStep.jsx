import React, { useEffect, useState } from 'react'
import { formatePrice } from '../../functions/gralFunctions'
import { Button } from '@nextui-org/react'
import Loading from '../Loading/Loading'
import RegisterMissingItemsThirdStep from './RegisterMissingItemsThirdStep'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

const RegisterMissingItemsSecondStep = ({dataUpdated, orderData, comeBack, closeModalNow, updateList}) => {

    const [articlesWithMissedQuantity, setArticlesWithMissedQuantity] = useState([])
    const [client, setClient] = useState("")
    const [clientId, setClientId] = useState("")
    const [totalToPay, setTotalToPay] = useState("")
    const [load, setLoad] = useState(true)
    const [lastStep, setLastStep] = useState(false)
    const [columns, setColumns] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [errorTable, setErrorTable] = useState(false)
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");


    const getValues = async () => { 
        console.log(dataUpdated)
        console.log(orderData)
        const articlesWithMissing = dataUpdated.filter(obj => 'missing' in obj);
        console.log(articlesWithMissing)
        const getClient = orderData.map((ord) => ord.client)[0];
        const getClientId = orderData.map((ord) => ord.clientId)[0];
        const getTotalToPay = articlesWithMissing.reduce((acc, el) => acc + el.replacementPrice * el.missing, 0);
        setArticlesWithMissedQuantity(articlesWithMissing)
        createTable(articlesWithMissing)
        setClient(getClient)
        setTotalToPay(getTotalToPay)
        setClientId(getClientId)
        console.log(getTotalToPay)
        console.log(articlesWithMissing)
        if(getTotalToPay > 0) { 
           setLoad(false)
        }
       }
       
       useEffect(() => { 
           getValues()
       }, [])


    

       const createTable = (items) => { 
            const data = items
            const properties = Object.keys(data[0]);
            console.log("Propiedad", properties)
            if(data.length > 0 ) { 
             console.log(data)
             const firstDetail = data[0];
             const properties = Object.keys(firstDetail);
             const filteredProperties = properties.filter(property => property !== 'choosenProductCategory' && property !== 'choosenProductTotalPrice'  
             && property !== 'productId'  && property !== 'price'  && property !== 'quantity'  && property !== 'replacementPrice');
           
             const columnLabelsMap = {
               productName: 'Articulo Faltante',
               missing: 'Cantidad Faltante'
             };
           
             const tableColumns = filteredProperties.map(property => ({
               key: property,
               label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
             }));
        
             setColumns(tableColumns);
             setShowTable(true)  
            } else { 
             console.log("First table length 0!")
             setErrorTable(true)
            }          
         
       }

    return (
        <>
      {lastStep === false  ?
           <div className='flex flex-col items-center text-center justify-center w-full'>
                {load ? (
                    <Loading/>
                ) : (
                    <div>
                    <div className='w-full flex flex-col items-start justify-start '>
                        <h5 className='text-sm font-medium text-green-800'>Articulos Faltantes</h5>
                       {showTable ? 
                        <div className='mt-2 w-full '>
                          <Table                          
                                columnAutoWidth={true} 
                                columnSpacing={10}  
                                aria-label="Selection behavior table example with dynamic content"   
                                selectionBehavior={selectionBehavior} 
                                className=" flex items-center justify-center shadow-2xl overflow-y-auto w-full rounded-xl">
                                    <TableHeader columns={columns}>
                            {(column) => (
                            <TableColumn key={column.key} className="text-xs gap-6">
                                {column.label}
                            </TableColumn>
                                )}
                            </TableHeader>
                                  <TableBody items={articlesWithMissedQuantity}>
                                            {(item) => (
                                        <TableRow key={item.productName}>
                                            {columns.map(column => (
                                            <TableCell key={column.key}  className='text-left' >
                                                {column.cellRenderer ? (
                                                column.cellRenderer({ row: { original: item } })
                                                ) : (
                                                (column.key === "costoLavadoArticulo") ? (
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
                        </div> : null}
                    </div>
                    <div className='mt-6 flex flex-col items-start justify-start'>
                        <h5 className='text-sm font-medium text-zinc-600'>Total a pagar por <b className='text-green-800'>{client}</b> para Reposicion: <b className='text-green-800'>{formatePrice(totalToPay)}</b></h5>
                    </div> 
                    <div className='mt-6 mb-4 flex items-center justify-center gap-4'>
                        <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={()=> setLastStep(true)}>Confirmar Faltantes</Button>
                        <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={()=> comeBack(false)}>Cancelar</Button>
                    </div> 
                    </div>
               )}
            </div> :
            <div>
                <RegisterMissingItemsThirdStep 
                orderData={orderData} 
                missingArticlesDetail={articlesWithMissedQuantity} 
                valueToPay={totalToPay} 
                client={client} 
                clientId={clientId} 
                comeBack={comeBack} 
                closeModalNow={closeModalNow}
                updateList={updateList}/>
            </div>
            }
        </>
      
       )
}

export default RegisterMissingItemsSecondStep
