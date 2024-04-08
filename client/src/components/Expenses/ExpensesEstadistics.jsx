import React, {useState, useEffect} from "react";
import {everyMonthsOfTheYear, everyYears, getYear, getEveryExpenses, formatePrice} from "../../functions/gralFunctions"
import Loading from "../Loading/Loading";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Table, TableHeader, TableColumn,TableBody, TableRow, TableCell, Input} from "@nextui-org/react";


const ExpensesEstadistics = () => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [size, setSize] = useState("4xl")
  const [monthSelected, setMonthSelected] = useState("Todos")
  const [yearSelected, setYearSelected] = useState(getYear())
  const [expensesGralData, setExpensesGralData] = useState([])
  const [withOutExpenses, setWithOutExpenses] = useState(false)
  const [totalAmountExpenses, setTotalAmountExpenses] = useState(0)
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([]);

  const getDataAndCreateCollectionEstadisticsTable = async () => { 
    try {
        const expensesData = await getEveryExpenses(); 
        const filterExpensesByMonth = expensesData.filter((exp) => exp.month === monthSelected && exp.year === yearSelected)
        console.log("GASTOS MES ESTADISTICAS", filterExpensesByMonth)  
        const agroupExpensesByType = filterExpensesByMonth.reduce((acc, el) => { 
          const expenseType = el.typeOfExpense
            if(acc[expenseType]) { 
            acc[expenseType].push(el)
           } else { 
            acc[expenseType] = [el]
           }
           return acc
        }, {})
        console.log("AGRUPADOS", agroupExpensesByType)
        const transformDataInArray = Object.entries(agroupExpensesByType).map(([typeOfExpense, data]) => { 
          return { 
            type: typeOfExpense,
            quantity: typeOfExpense.length,
            totalAmount: data.reduce((acc, el) => acc + el.amount, 0),            
          }
        })
        console.log("FINAL", transformDataInArray)
        if(transformDataInArray.length > 0) { 
          setExpensesGralData(transformDataInArray)
          setWithOutExpenses(false)
          setTotalAmountExpenses(filterExpensesByMonth.reduce((acc, el) => acc + el.amount, 0))
        } else { 
          setWithOutExpenses(true)
        }

    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => { 
    getDataAndCreateCollectionEstadisticsTable()
    console.log("ii")
  }, [monthSelected, yearSelected])

  useEffect(() => {
    setLoading(true)
    if (expensesGralData.length > 0) {
    console.log(expensesGralData);
    const firstData = expensesGralData[0];
    console.log(expensesGralData[0]);
    const properties = Object.keys(firstData);
    const filteredProperties = properties.filter(property => property !== 'idClient' && property !== 'orders');

    const columnLabelsMap = {
        type: 'Tipo de Gasto',
        quantity: 'Cantidad de Gastos',
        totalAmount: 'Total Gastado',
    };

    const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
    }));

    
        setColumns(tableColumns);
        console.log(columns)
        setLoading(false)
        }
}, [expensesGralData]);

  const goBack = () => { 
    onClose()
    setMonthSelected("Todos")
    setWithOutExpenses(true)
    setYearSelected(getYear())
  }

  return (
    <>
      <p className="text-sm font-medium text-zinc-600 cursor-pointer" onClick={onOpen}>Estadisticas de Gastos</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Estadisticas de Gastos
                <div>
                    <p className="text-sm font-medium text-zinc-600">Mes Seleccionado: {monthSelected.charAt(0).toUpperCase() + monthSelected.slice(1).toLowerCase()}</p>
                    <p className="text-sm font-medium text-zinc-600">Año Seleccionado: {yearSelected}</p>
                </div>
                </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">

                    <div className='flex gap-4 items-center justify-center mt-4 mb-2'>
                        <Select variant={"faded"} label="Selecciona un Mes" className="w-72" value={monthSelected}>          
                                {everyMonths.map((month) => (
                                <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                                    {month.label}
                                </SelectItem>
                                ))}
                            </Select>
                            <Select variant={"faded"} label="Selecciona un Año" className="w-72" value={yearSelected}>          
                                {availableYears.map((year) => (
                                <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                    {year.label}
                                </SelectItem>
                                ))}
                        </Select>
                    </div>

                    <div>
                    {withOutExpenses ? 
                        <div className="flex items-center justify-center mt-4">
                          <p className="text-red-600 font-medium text-sm">Ningun cliente realizado pedidos este Mes</p>
                        </div>    
                      :
                        <div className="flex flex-col items-center justify-center">
                          {loading ? <Loading/> :
                          <> 
                    
                            <Table aria-label="Example table with dynamic content" className="w-[780px] shadow-xl flex items-center justify-center mt-2 max-h-[300px] overlfow-y-auto">
                                <TableHeader columns={columns} className="">
                                  {(column) => (
                                    <TableColumn key={column.key} className="text-xs gap-6">
                                      {column.label}
                                    </TableColumn>
                                  )}
                                </TableHeader>
                                <TableBody items={expensesGralData}>
                                {(item) => (
                                  <TableRow key={item.type}>
                                    {columns.map(column => (
                                    <TableCell key={column.key} className="text-start items-start">
                                    {column.cellRenderer ? (
                                        column.cellRenderer({ row: { original: item } })
                                      ) : (
                                        (column.key === "totalAmount") ? (
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
                            <div className="flex items-center justify-center mt-4 mb-2">
                                <p className="text-sm text-zinc-600 font-medium">Monto total Gastado: {formatePrice(totalAmountExpenses)}</p>
                            </div>  
                          </>
                          }
                        
                          </div>
                        } 
                    </div>

              </ModalBody>
                  <ModalFooter className="flex items-center justify-center">
                    <Button className="bg-green-800 text-white font-medium w-96 text-md" onPress={onClose}>Cerrar</Button>         
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ExpensesEstadistics