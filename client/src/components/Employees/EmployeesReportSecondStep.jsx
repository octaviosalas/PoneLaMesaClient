import React, { useState, useEffect } from 'react'
import { Button } from '@nextui-org/react'
import { formatePrice } from '../../functions/gralFunctions'
import { Card } from '@tremor/react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import ViwShiftActivitiesModal from '../Clientes/ViwShiftActivitiesModal';

const EmployeesReportSecondStep = ({filteredData, closeModal, monthSelected, yearSelected, hourAmount}) => {

    const [totalPaid, setTotalPaid] = useState(filteredData.map((data) => data.totalAmountPaidShift).reduce((acc, el) => acc + el, 0))
    const [everyHours, setEveryHours] = useState(filteredData.map((data) => data.hours).reduce((acc, el) => acc + el, 0))
    const [columns, setColumns] = useState([]);
    const [showTable, setShowTable] = React.useState(false);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [tableData, setTableData] = useState([])

   
    useEffect(() => {
      console.log(filteredData)
    }, [filteredData])

    useEffect(() => {
      if (filteredData.length > 0) {
        const transformData = filteredData.map((filt) => { 
          return { 
            day: filt.day,
            workedAhours: filt.hours,
            activities: filt.activities,
            id: filt._id
          }
        })
        setTableData(transformData)
        const firstDetail = transformData[0];
        const properties = Object.keys(firstDetail);
        const filteredProperties = properties.filter(property => property !== 'activities' && property !== "id");
      
        const columnLabelsMap = {
          day: 'Dia',
          workedAhours: 'Horas Realizadas',
          activities: 'Actividades',
        };
      
        const tableColumns = filteredProperties.map(property => ({
          key: property,
          label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
        }));

        tableColumns.push({
          key: 'Actividades',
          label: 'Actividades',
          cellRenderer: (cell) => { 
            const filaActual = cell.row;
            const activities = filaActual.original.activities;
            const item = {activities};
            return (
               <ViwShiftActivitiesModal activities={item}/>
              );
        },
       }) 
      
        setColumns(tableColumns);
        console.log(tableColumns);
        setShowTable(true)
      } else { 
        setError(true)
      }
    }, [filteredData]);


  return (
    <div>

                  <Card className="mx-auto h-auto w-[650px] mt-3" decoration="top"  decorationColor="green-800" > 
                      <div className='flex justify-between items-center mt-4'>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Año</p>
                              <p className='font-medium text-xl text-black'>{yearSelected}</p>
                          </div>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Mes</p>
                              <p className='font-medium text-xl text-black'>{monthSelected}</p>
                          </div>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>horas Trabajadas</p>
                              <p className='font-medium text-xl text-black'>{everyHours}</p>
                          </div>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Turnos Realizados</p>
                              <p className='font-medium text-xl text-black'>{filteredData.length}</p>
                          </div>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Monto a Pagar</p>
                              <p className='font-medium text-xl text-black'>{formatePrice(totalPaid)}</p>
                          </div>
                          
                      </div>
                 </Card>
     

       <div className='flex flex-col mt-2'>

         <h5 className='mt-2 ml-4 font-medium text-black text-sm'>Detalle de los turnos: </h5>

         {showTable ?
         <Table                          
            columnAutoWidth={true} 
            columnSpacing={10}  
            aria-label="Selection behavior table example with dynamic content"   
            selectionBehavior={selectionBehavior} 
            className="w-[780px] 2xl-w-[550px] flex items-center justify-center mt-2 shadow-2xl overflow-y-auto xl:max-h-[150px] 2xl:max-h-[250px] border rounded-xl">
                <TableHeader columns={columns}>
                 {(column) => (
                 <TableColumn key={column.key} className="text-xs gap-6">
                   {column.label}
                </TableColumn>
                    )}
                </TableHeader>
                 <TableBody items={tableData}>
                              {(item) => (
                 <TableRow key={item.id}>
                    {columns.map(column => (
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
         </Table> : <p>Aguardando datos...</p>}


         <div className='w-full flex items-center justify-center mt-4 mb-2'>
          <Button className="text-white font-medium text-sm bg-green-800 w-72" onPress={closeModal}>Cerrar</Button>
         </div>
       </div>
    </div>
  )
}

export default EmployeesReportSecondStep
