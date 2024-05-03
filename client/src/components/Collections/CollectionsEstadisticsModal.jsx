import React, {useState, useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Table, TableHeader, TableColumn,TableBody, TableRow, TableCell, Input} from "@nextui-org/react";
import {everyMonthsOfTheYear, everyYears, getYear, getMonthlyCollections, formatePrice} from "../../functions/gralFunctions"
import Loading from "../Loading/Loading";
import CollectionsAccountsEstadisticsModal from "./CollectionsAccountsEstadisticsModal";

const CollectionsEstadisticsModal = () => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
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
  const [loading, setLoading] = useState(false)
  const [showByAccount, setShowByAccount] = useState(false)

        const getDataAndCreateCollectionEstadisticsTable = async () => { 
            try {
                const collectionsData = await getMonthlyCollections(monthSelected, yearSelected)
                const getTotalAmount = collectionsData.reduce((acc, el) => acc + el.amount, 0)
                setTotalAmountCollections(formatePrice(getTotalAmount))
                const agroupCollectionsByType = collectionsData.reduce((acc, el) => { 
                const collectionType = el.collectionType
                if(acc[collectionType]) { 
                    acc[collectionType].push(el)
                } else { 
                    acc[collectionType] = [el]
                }
                return acc
                }, {})
                const transformTypes = Object.entries(agroupCollectionsByType).map(([collectionType, data]) => { 
                return { 
                    collectionType: collectionType,
                    quantityCollections: data.length,
                    totalAmount: data.reduce((acc, el) => acc + el.amount, 0)
                }
                })
                console.log("POR TIPOS", transformTypes)
                if(transformTypes.length > 0) { 
                    setCollectionsData(transformTypes)
                    setWithOutCollections(false)
                } else { 
                    setWithOutCollections(true)
                }

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
                setCollectionsAgroupByAccounts(transformTypesAccounts)
                if(transformTypes.length > 0) { 
                    setCollectionsAgroupByType(transformTypes)
                    console.log(transformTypes)
                    setWithOutCollections(false)
                } else { 
                    setWithOutCollections(true)
                }
            } catch (error) {
                console.log(error)
            }
        }

        useEffect(() => { 
                getDataAndCreateCollectionEstadisticsTable()
        }, [monthSelected, yearSelected])

        useEffect(() => {
                setLoading(true)
                if (collectionsData.length > 0) {
                console.log(collectionsData);
                const firstData = collectionsData[0];
                console.log(collectionsData[0]);
                const properties = Object.keys(firstData);
                const filteredProperties = properties.filter(property => property !== 'idClient' && property !== 'orders');
            
                const columnLabelsMap = {
                    collectionType: 'Tipo de Cobro',
                    quantityCollections: 'Cantidad de Cobros',
                    totalAmount: 'Total Facturado',
                };
            
                const tableColumns = filteredProperties.map(property => ({
                    key: property,
                    label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
                }));
            
                
                    setColumns(tableColumns);
                    console.log(columns)
                    setLoading(false)
                    }
        }, [collectionsData]);

        const comeBack = () => { 
            setShowByAccount(false)
            setMonthSelected("Todos")
            setYearSelected(getYear())
        }

       


  return (
    <>
      <p className="text-sm font-bold text-zinc-600 cursor-pointer" onClick={onOpen}>Estadisticas de Cobros</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Estadisticas de Cobros
                <div>
                    <p className="text-sm font-medium text-zinc-600">Mes Seleccionado: {monthSelected.charAt(0).toUpperCase() + monthSelected.slice(1).toLowerCase()}</p>
                    <p className="text-sm font-medium text-zinc-600">Año Seleccionado: {yearSelected}</p>
                </div>
                </ModalHeader>
                
             {showByAccount !== true ?
              <ModalBody className="flex flex-col items-center justify-center">
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
                    
             <div>
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
                        <TableBody items={collectionsData}>
                        {(item) => (
                          <TableRow key={item.collectionType}>
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
                        <p className="text-sm text-zinc-600 font-medium">Monto total Cobrado: {formatePrice(collectionsData.reduce((acc, el) => acc + el.totalAmount, 0))}</p>
                    </div>  
                   </>
                   }
                 
                  </div>
                }     
                    </div>

                     
              </ModalBody> : <CollectionsAccountsEstadisticsModal/>}

                  <ModalFooter className="flex items-center justify-center">
                    <Button className="bg-green-800 text-white font-medium w-96 text-md" onClick={()=> setShowByAccount(true)}>Ver por Cuentas</Button>   
                    <Button className="bg-green-800 text-white font-medium w-96 text-md" onPress={() => comeBack()}>Ver por Tipos de Cobro</Button>        
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CollectionsEstadisticsModal


/* 
 const createAccountColumns = () => { 
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
                    downPaymentCollections: "Señas",
                };
                console.log(columnLabelsMap)
            
                const tableColumns = filteredProperties.map(property => ({
                    key: property,
                    label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
                }));                 
                setColumns(tableColumns);
                console.log(tableColumns)
                setLoading(false)
                setShowByAccount(true)
            }
        }

        useEffect(() => { 
            console.log(showByAccount)
        }, [showByAccount])
*/