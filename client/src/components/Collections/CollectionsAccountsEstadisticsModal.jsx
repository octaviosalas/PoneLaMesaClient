import React, {useState, useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Table, TableHeader, TableColumn,TableBody, TableRow, TableCell, Input} from "@nextui-org/react";
import {everyMonthsOfTheYear, everyYears, getYear, getMonthlyCollections, formatePrice} from "../../functions/gralFunctions"
import Loading from "../Loading/Loading";

const CollectionsAccountsEstadisticsModal = () => {

  const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [size, setSize] = useState("4xl")
  const [monthSelected, setMonthSelected] = useState("Todos")
  const [yearSelected, setYearSelected] = useState(getYear())
  const [collectionsAgroupByAccounts, setCollectionsAgroupByAccounts] = useState([])
  const [collectionsAgroupByType, setCollectionsAgroupByType] = useState([])
  const [withOutCollections, setWithOutCollections] = useState(false)
  const [totalAmountCollections, setTotalAmountCollections] = useState(0)
  const [columns, setColumns] = useState([]);
  const [byAccountColumns, setByAccountColumns] = useState([]);
  const [collectionsData, setCollectionsData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [showByAccount, setShowByAccount] = useState(false)

  const getDataAndCreateAccountCollectionEstadisticsTable = async () => { 
    try {
        const collectionsData = await getMonthlyCollections(monthSelected, yearSelected)
        const getTotalAmount = collectionsData.reduce((acc, el) => acc + el.amount, 0)
        setTotalAmountCollections(formatePrice(getTotalAmount))
        
        const agroupCollectionsByAccount= collectionsData.reduce((acc, el) => { 
        const account = el.account
        if(acc[account]) { 
            acc[account].push(el)
        } else { 
            acc[account] = [el]
        }
        return acc
        }, {})
        const transformTypesAccounts = Object.entries(agroupCollectionsByAccount).map(([account, data]) => { 
        return { 
            account: account,
            totalAmount: data.reduce((acc, el) => acc + el.amount, 0),
            quantityCollections: data.length,
            replacementeCollections: data.filter((d) => d.collectionType === "Reposicion").length,
            ordersCollections: data.filter((d) => d.collectionType === "Alquiler").length,
            downPaymentCollections:  data.filter((d) => d.collectionType === "Seña").length
        }
        })
        console.log("POR CUENTAS", transformTypesAccounts)
        if(transformTypesAccounts.length > 0) { 
            setCollectionsAgroupByAccounts(transformTypesAccounts)
            setWithOutCollections(false)
        } else { 
            setWithOutCollections(true)
        }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
        getDataAndCreateAccountCollectionEstadisticsTable()
        }, [monthSelected, yearSelected])


        useEffect(() => {
            setLoading(true)
            if (collectionsAgroupByAccounts.length > 0) {
            console.log(collectionsAgroupByAccounts);
            const firstData = collectionsAgroupByAccounts[0];
            console.log(collectionsAgroupByAccounts[0]);
            const properties = Object.keys(firstData);
            const filteredProperties = properties.filter(property => property !== 'idClient' && property !== 'orders');
        
            const columnLabelsMap = {
                account: 'Cuenta',
                quantityCollections: 'Cantidad de Cobros',
                totalAmount: 'Total Facturado',
                replacementeCollections: "Reposiciones",
                ordersCollections: "Alquileres",
                downPaymentCollections: "Señas"
            };
        
            const tableColumns = filteredProperties.map(property => ({
                key: property,
                label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
            }));
        
            
                setColumns(tableColumns);
                console.log(columns)
                setLoading(false)
                }
    }, [collectionsAgroupByAccounts]);   


  return (
    <div>
         <div className='flex gap-4 items-center justify-center mt-4 mb-2'>
                        <Select variant={"faded"} label="Selecciona un Mes" className="w-72" value={monthSelected}>          
                                {everyMonths.map((month) => (
                                <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                                    {month.label}
                                </SelectItem>
                                ))}
                                 <SelectItem key="Todos" value="Todos" textValue="Todos" onClick={() => setMonthSelected("Todos")}>
                                  Todos
                                </SelectItem>
                            </Select>
                            <Select variant={"faded"} label="Selecciona un Año" className="w-72" value={yearSelected}>          
                                {availableYears.map((year) => (
                                <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                    {year.label}
                                </SelectItem>
                                ))}
                        </Select>
         </div>

                   <> 
                   {withOutCollections ? 
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
                        <TableBody items={collectionsAgroupByAccounts}>
                        {(item) => (
                          <TableRow key={item.account}>
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
                  
                   </>
                   }
                 
                  </div>
                }                   
                   </>
                   
    </div>
  )
}

export default CollectionsAccountsEstadisticsModal
