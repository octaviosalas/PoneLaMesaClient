import React, {useState, useEffect} from "react";
import axios from "axios";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice, getMonth, getYear, getEveryOrders, everyMonthsOfTheYear, everyYears, months } from '../../functions/gralFunctions';
import {Select, SelectItem} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import Loading from "../Loading/Loading";

const EstadisticsEmployees = () => { 

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [monthSelected, setMonthSelected] = useState("")
  const [yearSelected, setYearSelected] = useState(0)
  const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [missedData, setMissedData] = useState(false)
  const [employeesDataResolved, setEmployeesDataResolved] = useState([])
  const [withOutData, setWithOutData] = useState(false)
  const [size, setSize] = useState("4xl")
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false)


  const getShiftsData = async () => { 
    if(monthSelected.length === 0  || yearSelected.length === 0) {
      setMissedData(true)
    } else { 
      try {
        const getShiftsByMonth = await axios.get(`http://localhost:4000/employees/getShifsByMonth/${monthSelected}`)
        const data = getShiftsByMonth.data
        const filterDataByYear = data.filter((d) => d.year === yearSelected)
        console.log(filterDataByYear)
        const agroupSiftsByEmployeeId = filterDataByYear.reduce((acc, el) => { 
          const employeeId = el.employeeId
          if(acc[employeeId]) { 
            acc[employeeId].push(el)
          } else { 
            acc[employeeId] = [el]
          }
          return acc
        }, {})
        const transformResultInArrayData = Object.entries(agroupSiftsByEmployeeId).map(([employeeId, employeeData]) => ({ 
          employeeId: employeeId,
          employeeName: employeeData.map((em) => em.employeeName)[0],
          quantityShifts: employeeData.length,
          totalHours: employeeData.reduce((acc, el) => acc + el.hours, 0),
          totalAmountToPaid: employeeData.reduce((acc, el) => acc + el.totalAmountPaidShift, 0)
        }))
        console.log(agroupSiftsByEmployeeId, transformResultInArrayData)
        if(transformResultInArrayData.length > 0) { 
          setEmployeesDataResolved(transformResultInArrayData)
          setWithOutData(false)
        } else { 
          setWithOutData(true)
          setEmployeesDataResolved([])
        }
        console.log(agroupSiftsByEmployeeId)
        console.log(transformResultInArrayData)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleOpen = () => { 
     onClose()    
  }

  const handleClose = () => { 
    setEmployeesDataResolved([])
    setYearSelected(0)
    setMonthSelected("")
    onClose()
    setLoading(false)
  }

  useEffect(() => { 
    console.log("sisi")
     if(employeesDataResolved.length > 0) { 
      setLoading(true)
       console.log(employeesDataResolved);
             const firstData = employeesDataResolved[0];
             console.log(employeesDataResolved[0]);
             const properties = Object.keys(firstData);
             const filteredProperties = properties.filter(property => property !== 'employeeId');
         
             const columnLabelsMap = {
               employeeName: 'Empleado',
               quantityShifts: 'Turnos Realizados',
               totalHours: 'Total de Horas',
               totalAmountToPaid: 'Liquidacion'
             };
         
             const tableColumns = filteredProperties.map(property => ({
               key: property,
               label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
             }));
                            
             setColumns(tableColumns);
             console.log(columns, "columnas")
             if(columns.length > 0) { 
              setTimeout(() => { 
                  setLoading(false)
              }, 1500)
             }
     }
  } , [employeesDataResolved])


  return (
    <>
      <p className="text-sm font-medium text-black cursor-pointer" onClick={onOpen}>Estadisticas Empleados</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Liquidacion Mensual Empleados</ModalHeader>
              <ModalBody> 
                <div className="flex flex-col items-center justify-center">
                   <div className="flex items-center gap-6 w-full">
                      <Select variant={"faded"} label="Selecciona un Mes" className="w-full" value={monthSelected}>          
                            {everyMonths.map((month) => (
                                <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                                  {month.label}
                                </SelectItem>
                              ))}
                          </Select>
                          <Select variant={"faded"} label="Selecciona un Año" className="w-full" value={yearSelected}>          
                            {availableYears.map((year) => (
                                <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                  {year.label}
                              </SelectItem>
                            ))}
                        </Select>
                   </div>
                 
                   <div>

                      {withOutData ? <p className="mt-4 font-medium text-sm text-zinc-600">No hay turnos asentados en este mes</p> : null}

                      {employeesDataResolved.length > 0 && columns.length > 0  ? ( 
                            <div className="mt-4 mb-4 flex items-center justify-center">
                                <Table aria-label="Example table with dynamic content" className="w-[780px] shadow-xl flex items-center justify-center mt-2 max-h-[300px] overlfow-y-auto">
                                  <TableHeader columns={columns} className="">
                                    {(column) => (
                                      <TableColumn key={column.key} className="text-xs gap-6">
                                        {column.label}
                                      </TableColumn>
                                    )}
                                  </TableHeader>
                                  <TableBody items={employeesDataResolved}>
                                  {(item) => (
                                    <TableRow key={item.employeeId}>
                                      {columns.map(column => (
                                      <TableCell key={column.key} className="text-start items-start">
                                      {column.cellRenderer ? (
                                          column.cellRenderer({ row: { original: item } })
                                        ) : (
                                          (column.key === "totalAmountToPaid") ? (
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
                          </div>
                      ) : monthSelected.length === 0 && yearSelected === 0 ? ( 
                        <p className="mt-4 font-medium text-sm text-zinc-600">Debes elegir un mes y año</p>
                      ) : loading === true && monthSelected.length !== 0 && yearSelected !== 0 ?
                         <Loading/> : null                        
                      }

                   </div>
                </div>
                  
              </ModalBody>
              <ModalFooter className="flex items-center gap-4 justify-center">
                <Button className="bg-green-800 font-medium text-sm text-white w-72" onPress={handleClose}>
                  Cerrar
                </Button>
                <Button className="bg-green-800 font-medium text-sm text-white w-72" onClick={() =>  getShiftsData()}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EstadisticsEmployees
