import React from "react";
import  {useState, useEffect} from "react";
import axios from "axios";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice, getMonth, getYear, getEveryOrders, everyMonthsOfTheYear, everyYears, months } from '../../functions/gralFunctions';
import {Select, SelectItem} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import Loading from "../Loading/Loading";

const EstadisticsProviders = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [monthSelected, setMonthSelected] = useState("")
  const [yearSelected, setYearSelected] = useState(0)
  const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [missedData, setMissedData] = useState(false)
  const [withOutData, setWithOutData] = useState(false)
  const [size, setSize] = useState("4xl")
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false)
  const [expensesData, setExpensesData] = useState([])


        const getProvidersData = async () => { 
          if(yearSelected !== 0 && monthSelected.length > 0) { 
              setMissedData(false);
              setWithOutData(false)
              try {
                  const getExpenses = await axios.get("http://localhost:4000/expenses");
                  const response = getExpenses.data;
                  if(monthSelected === "Todos") { 
                    const filterExpensesByMonthAndByYear = response.filter((resp) => resp.year === yearSelected);
                    const agorupExpensesByProviderName = filterExpensesByMonthAndByYear.reduce((acc, el) => { 
                      const providerName = el.providerName;
                      if(acc[providerName]) { 
                          acc[providerName].push(el);
                      } else { 
                          acc[providerName] = [el];
                      }
                      return acc;
                  }, {});
                  const transformData = Object.entries(agorupExpensesByProviderName).map(([providerName, data]) => { 
                    return { 
                      providerName: providerName,
                      quantityExpenses: data.length,
                      totalAmountInverted: data.map((d) => d.expenseDetail).flat().reduce((acc, el) => acc + el.value, 0) 
                    }
                  });
                  console.log(transformData);
                  if(transformData.length > 0) { 
                      setExpensesData(transformData);
                  } else { 
                      setWithOutData(true)
                  }
                  } else { 
                    const filterExpensesByMonthAndByYear = response.filter((resp) => resp.month === monthSelected && resp.year === yearSelected);
                    const agorupExpensesByProviderName = filterExpensesByMonthAndByYear.reduce((acc, el) => { 
                        const providerName = el.providerName;
                        if(acc[providerName]) { 
                            acc[providerName].push(el);
                        } else { 
                            acc[providerName] = [el];
                        }
                        return acc;
                    }, {});
                    const transformData = Object.entries(agorupExpensesByProviderName).map(([providerName, data]) => { 
                      return { 
                        providerName: providerName,
                        quantityExpenses: data.length,
                        totalAmountInverted: data.map((d) => d.expenseDetail).flat().reduce((acc, el) => acc + el.value, 0) 
                      }
                    });
                    console.log(transformData);
                    if(transformData.length > 0) { 
                        setExpensesData(transformData);
                    } else { 
                        setWithOutData(true)
                    }
                  }
                
              } catch (error) {
                  console.log(error);
              }       
          }
        }

        useEffect(() => {
          getProvidersData()
       }, [monthSelected, yearSelected]); 

        useEffect(() => { 
            console.log("sisi")
            if(expensesData.length > 0) { 
            setLoading(true)
            console.log(expensesData);
                    const firstData = expensesData[0];
                    console.log(expensesData[0]);
                    const properties = Object.keys(firstData);
                    const filteredProperties = properties.filter(property => property !== 'employeeId');
                
                    const columnLabelsMap = {
                    providerName: 'Proveedor',
                    quantityExpenses: 'Cantidad de Compras',
                    totalAmountInverted: 'Total Invertido'
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
        } , [expensesData])

  return (
    <>
      <p className="text-sm font-medium text-zinc-600 cursor-pointer" onClick={onOpen}>Estadisticas Proveedores</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Estadisticas Proveedores</ModalHeader>
              <ModalBody>
                  <div className="flex items-center gap-6 w-full">
                    <Select variant={"faded"} label="Selecciona un Mes" className="w-full" value={monthSelected}>          
                         {everyMonths.map((month) => (
                        <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                          {month.label}
                        </SelectItem>
                        ))}
                         <SelectItem key="Todos" value="Todos" textValue="Todos" onClick={() => setMonthSelected("Todos")}>
                            Todos
                          </SelectItem>
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

                 {expensesData.length > 0 && columns.length > 0 && withOutData === false ? ( 
                    <Table aria-label="Example table with dynamic content" className="w-[780px] shadow-xl flex items-center justify-center mt-2">
                         <TableHeader columns={columns} className="">
                           {(column) => (
                             <TableColumn key={column.key} className="text-xs gap-6">
                                 {column.label}
                             </TableColumn>
                                    )}
                         </TableHeader>
                            <TableBody items={expensesData}>
                                {(item) => (
                                <TableRow key={item.providerName}>
                                  {columns.map(column => (
                                <TableCell key={column.key} className="text-start items-start">
                                    {column.cellRenderer ? (
                                          column.cellRenderer({ row: { original: item } })
                                        ) : (
                                          (column.key === "totalAmountInverted") ? (
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
                 ) :  withOutData === true ? ( 
                       <div className="flex items-center justify-center mt-6">
                         <p className="font-medium text-zinc-600 text-sm">No hay datos para el Mes y Año elegido</p>
                       </div>
                 ) :  null }
                  
                 </div>


              </ModalBody>
              <ModalFooter className="flex flex-col items-center justify-center">
                <Button className="bg-green-800 text-white font-medium text-sm w-96" onClick={() => getProvidersData()}>Confirmar</Button>   
                {missedData ?  <p className="text-sm font-medium text-zinc-600 m-4 mb-2">Debes elegir un mes y un año</p> : null}    
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );

  }

export default EstadisticsProviders