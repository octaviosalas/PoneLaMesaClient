import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { useRef } from "react";
import DeleteOrder from '../Modals/DeleteOrder';
import EditModal from '../Modals/EditModal';
import Loading from '../Loading/Loading';
import EmployeesReport from './EmployeesReport';
import CreateNewEmployee from './CreateNewEmployee';
import EstadisticsEmployees from './EstadisticsEmployees';
import ViewLicenseModal from './ViewLicenseModal';
import ViewDniModal from './ViewDniModal';


const EmployeesTableData = ({employeesData, updateList}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [loadData, setLoadData] = useState(true)
    const [withOutCollections, setWithOutCollections] = useState(false);
    const [inputValue, setInputValue] = useState("")

    useEffect(() => { 
        setData(employeesData)
    }, [employeesData])

    const getEmployeesAndCreateTable = () => { 
        if(data.length !== 0) { 
        const propiedades = Object.keys(employeesData[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v' && propiedad !== 'hourAmount' && propiedad !== 'licenseImage'  && propiedad !== 'dniImage');
        const columnObjects = propiedades.map(propiedad => ({
            key: propiedad,
            label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
            allowsSorting: true
        }));

            const modifiedColumnObjects = columnObjects.map(column => {
                if (column.key === 'name') {
                    return { ...column, label: 'Nombre' };
                } else if (column.key === 'dni') {
                    return { ...column, label: 'DNI' };
                } else {
                    return column;
                }
            });
    
            modifiedColumnObjects.push({
                key: 'Reporte',
                label: 'Reporte',
                cellRenderer: (cell) => { 

                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const name = filaActual.original.name;
                    const dni = filaActual.original.dni;  
                    const hourAmount = filaActual.original.hourAmount;             
                    const item = { id, name, dni, hourAmount};
                    return (
                     <EmployeesReport employeeData={item}/>
                    );
                },
            })   

            modifiedColumnObjects.push({
              key: 'Ver Licencia',
              label: 'Ver Licencia',
              cellRenderer: (cell) => { 

                  const filaActual = cell.row;
                  const id = filaActual.original._id;
                  const name = filaActual.original.name;
                  const license = filaActual.original.licenseImage;
                  const item = { id, license, name};
                  return (
                      <ViewLicenseModal item={item} updateList={updateList}/>
                  );
              },
          })   

          modifiedColumnObjects.push({
            key: 'Ver DNI',
            label: 'Ver DNI',
            cellRenderer: (cell) => { 

                const filaActual = cell.row;
                const id = filaActual.original._id;
                const name = filaActual.original.name;
                const dni = filaActual.original.dniImage;
                const item = { id, dni, name};
                return (
                    <ViewDniModal item={item} updateList={updateList}/>
                );
            },
        })   

           

            modifiedColumnObjects.push({
                key: 'Editar',
                label: 'Editar',
                cellRenderer: (cell) => { 

                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const dni = filaActual.original.dni;
                    const hourAmount = filaActual.original.hourAmount;
                    const name = filaActual.original.name;
                    const item = {id, dni, name, hourAmount};
                    return (
                    <EditModal type="employee" employeeData={item} updateEmployee={updateList}/>
                    );
                },
            })       
                        
            modifiedColumnObjects.push({
            key: 'Eliminar',
            label: 'Eliminar',
            cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const id = filaActual.original._id;
                const name = filaActual.original.name;
                const item = {id, name};
                return (
                <DeleteOrder type="employee" employeeData={item} updateEmployee={updateList}/>
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
            getEmployeesAndCreateTable()
          console.log("ejecuto data mas a 0")
          } else { 
              setWithOutCollections(true)
          }
      }, [data])

      return (
        <div className='flex flex-col items-center justify-center 2xl:mt-12'>
          {loadData ? (
              <Loading />
                ) : (
                 data.length > 0 ? (
                    <>
                    <div className='flex flex-col items-center justify-start lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] rounded-t-lg rounded-b-none ' >
                      <div className='h-12 items-center justify-between w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none'>
                         <div className='flex justify-between  w-full items-center ml-4'>       
                            <div className='flex justify-start'>
                               <p className='text-sm font-bold text-zinc-600'>Empleados</p>
                            </div>       
                            <div  className='flex justify-end mr-2 gap-4'>
                               <EstadisticsEmployees/>
                               <CreateNewEmployee type="table" updateList={updateList}/>
                            </div>      
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
                       isHeaderSticky={true}
                       aria-label="Selection behavior table example with dynamic content"
                       selectionBehavior={selectionBehavior}
                       className="w-full mt-2  lg:w-[800px] xl:w-[1200px] 2xl:w-[1500px] 3xl:w-[1650px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
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
                                   column.key === "Total" ? (
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
                      <p className='text-black font-medium text-md '>No hay Cobros</p> 
                      :
                      null
                    }               
                   </div>
             )
           )}
             </div>
       )
}

export default EmployeesTableData
