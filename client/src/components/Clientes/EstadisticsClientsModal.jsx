import React,  { useState, useEffect, useRef }  from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from 'axios'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { formatePrice, getMonth, getYear, getEveryOrders, everyMonthsOfTheYear, everyYears } from '../../functions/gralFunctions';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import Loading from "../Loading/Loading";

const EstadisticsClientsModal = () => { 

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [allOrders, setAllOrders] = useState([])
  const [columns, setColumns] = useState([]);
  const [clientsRanking, setClientsRanking] = useState([])
  const [withOutOrders, setWithOutOrders] = useState(false)
  const [monthSelected, setMonthSelected] = useState("Todos")
  const [yearSelected, setYearSelected] = useState(getYear())
  const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [size, setSize] = useState("4xl")
  const [loading, setLoading] = useState(true)

        useEffect(() => {
          const fetchData = async () => {
            try {
              const ordersData = await getEveryOrders();
              console.log(ordersData)
              if(monthSelected === "Todos" && yearSelected === "Todos") { 
                if(ordersData.length !== 0) { 
                  setAllOrders(ordersData);
                  setWithOutOrders(false)
                } else { 
                  setWithOutOrders(true)
                }
        

              } else if (yearSelected !== "Todos" && monthSelected !== "Todos") { 
                const filterDataByMonthAndYearSelected = ordersData.filter((orders) => orders.month === monthSelected && orders.year === yearSelected)
                if(filterDataByMonthAndYearSelected.length !== 0) { 
                    setAllOrders(filterDataByMonthAndYearSelected);
                    setWithOutOrders(false)
                } else { 
                  setWithOutOrders(true)
                }     

              } else if (yearSelected !== "Todos" && monthSelected === "Todos") { 
                const filterDataByYear = ordersData.filter((orders) => orders.year === yearSelected)
                if(filterDataByYear.length !== 0) { 
                  setAllOrders(filterDataByYear);
                  setWithOutOrders(false)
                } else { 
                  setWithOutOrders(true)
                }      

              } else if (yearSelected === "Todos" && monthSelected !== "Todos") { 
                const filterDataByMonth = ordersData.filter((orders) => orders.month === monthSelected)
                if(filterDataByMonth.length !== 0) { 
                  setAllOrders(filterDataByMonth);
                  setWithOutOrders(false)
                } else { 
                  setWithOutOrders(true)
                }      
              }
            } catch (error) {
              console.error("Error fetching orders:", error);
            }
          };
          fetchData();
        }, [monthSelected, yearSelected]); 

        const orderOrdersByClient = () => { 
          if(allOrders.length > 0) { 
            const agroupOrdersByClient = allOrders.reduce((acc, el) => { 
              const idClient = el.clientId
              if(acc[idClient]) { 
                  acc[idClient].push(el)
              } else { 
                  acc[idClient] = [el]
              }
              return acc
          }, {})
          const getDataOnArray = Object.entries(agroupOrdersByClient).map(([idClient, orders]) => ({ 
              idClient: idClient,
              clientName: orders.map((d) => d.client)[0],
              totalAmountFactured: orders.map((ord) => ord.total).reduce((acc, el) => acc + el, 0),
              orders: orders
          }))
          const orderResultByBetterAmount = getDataOnArray.sort((a, b) => b.totalAmountFactured - a.totalAmountFactured)
          console.log("MIRA ACA", orderResultByBetterAmount)
          setClientsRanking(orderResultByBetterAmount)
          return orderResultByBetterAmount
          }     
        }

        useEffect(() => { 
          if(allOrders.length >= 0) { 
              console.log(orderOrdersByClient())
              orderOrdersByClient()
          }
        }, [allOrders])

     
        useEffect(() => {
          setLoading(true)
          if (clientsRanking.length > 0) {
             console.log(clientsRanking);
             const firstData = clientsRanking[0];
             console.log(clientsRanking[0]);
             const properties = Object.keys(firstData);
             const filteredProperties = properties.filter(property => property !== 'idClient' && property !== 'orders');
         
             const columnLabelsMap = {
               clientName: 'Cliente',
               totalAmountFactured: 'Monto total',
               cantidadDePedidos: 'Cantidad de Pedidos',
             };
         
             const tableColumns = filteredProperties.map(property => ({
               key: property,
               label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
             }));
         
             tableColumns.push({
               key: 'cantidadDePedidos',
               label: 'Cantidad de Pedidos',
               cellRenderer: (cell) => {
                 const filaActual = cell.row;
                 return filaActual.original.orders.length;
               },
             });

             tableColumns.unshift({
               key: 'puesto',
               label: 'Puesto',
               cellRenderer: (cell) => {
                 const filaActual = cell.row;
                 return `${filaActual.index + 1}`;
               },
             });
         
             setColumns(tableColumns);
             if(columns.length > 0) { 
              setTimeout(() => { 
                  setLoading(false)
              }, 1500)
             }
          }
         }, [clientsRanking]);
        

  return (
    <>
      <p className="text-sm font-medium text-black cursor-pointer" onClick={onOpen}>Estadisticas Clientes</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Estadisticas Clientes
                <p className='underline font-medium text-sm text-zinc-600'>Ranking de clientes ordenados de mayor a menor</p>
                </ModalHeader>
              <ModalBody>
              <div>
                  <div className='flex flex-col justify-start items-start'>                            
                  </div>
                  <div className='flex gap-4 items-center justify-center mt-4 mb-2'>
                   <Select variant={"faded"} label="Selecciona un Mes" className="max-w-xs" value={monthSelected}>          
                        {everyMonths.map((month) => (
                          <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                            {month.label}
                          </SelectItem>
                        ))}
                    </Select>
                    <Select variant={"faded"} label="Selecciona un Año" className="max-w-xs" value={yearSelected}>          
                        {availableYears.map((year) => (
                           <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                              {year.label}
                           </SelectItem>
                        ))}
                   </Select>
                  </div>
            
                {withOutOrders ? 
                <div className="flex items-center justify-center mt-4">
                    <p className="text-red-600 font-medium text-sm">Ningun cliente realizado pedidos este Mes</p>
                </div>    
                  :
                  <div className="flex items-center justify-center">
                    {loading ? <Loading/> :
                     <Table aria-label="Example table with dynamic content" className="w-[780px] shadow-xl flex items-center justify-center mt-2">
                        <TableHeader columns={columns} className="">
                          {(column) => (
                            <TableColumn key={column.key} className="text-xs gap-6">
                              {column.label}
                            </TableColumn>
                          )}
                        </TableHeader>
                        <TableBody items={clientsRanking}>
                        {(item) => (
                          <TableRow key={item.clientName}>
                            {columns.map(column => (
                            <TableCell key={column.key} className="text-start items-start">
                            {column.cellRenderer ? (
                                column.cellRenderer({ row: { original: item } })
                              ) : (
                                (column.key === "totalAmountFactured") ? (
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
                   </Table>}
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

export default EstadisticsClientsModal


/* 

import React,  { useState, useEffect, useRef }  from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from 'axios'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { formatePrice, getMonth, getYear, getEveryOrders, everyMonthsOfTheYear, everyYears } from '../../functions/gralFunctions';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";

const EstadisticsClientsModal = () => { 
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [allOrders, setAllOrders] = useState([])
  const [columns, setColumns] = useState([]);
  const [clientsRanking, setClientsRanking] = useState([])
  const [withOutOrders, setWithOutOrders] = useState(false)
  const [monthSelected, setMonthSelected] = useState("Todos")
  const [yearSelected, setYearSelected] = useState(getYear())
  const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [size, setSize] = useState("4xl")

      useEffect(() => {
        const fetchData = async () => {
          try {
            const ordersData = await getEveryOrders();
            console.log(ordersData)
            if(monthSelected === "Todos" && yearSelected === "Todos") { 
              if(ordersData.length !== 0) { 
                setAllOrders(ordersData);
                setWithOutOrders(false)
              } else { 
                setWithOutOrders(true)
              }
      

            } else if (yearSelected !== "Todos" && monthSelected !== "Todos") { 
              const filterDataByMonthAndYearSelected = ordersData.filter((orders) => orders.month === monthSelected && orders.year === yearSelected)
              if(filterDataByMonthAndYearSelected.length !== 0) { 
                  setAllOrders(filterDataByMonthAndYearSelected);
                  setWithOutOrders(false)
              } else { 
                setWithOutOrders(true)
              }     

            } else if (yearSelected !== "Todos" && monthSelected === "Todos") { 
              const filterDataByYear = ordersData.filter((orders) => orders.year === yearSelected)
              if(filterDataByYear.length !== 0) { 
                setAllOrders(filterDataByYear);
                setWithOutOrders(false)
              } else { 
                setWithOutOrders(true)
              }      

            } else if (yearSelected === "Todos" && monthSelected !== "Todos") { 
              const filterDataByMonth = ordersData.filter((orders) => orders.month === monthSelected)
              if(filterDataByMonth.length !== 0) { 
                setAllOrders(filterDataByMonth);
                setWithOutOrders(false)
              } else { 
                setWithOutOrders(true)
              }      
            }
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };
        fetchData();
      }, [monthSelected, yearSelected]); 

        const orderOrdersByClient = () => { 
          if(allOrders.length > 0) { 
            const agroupOrdersByClient = allOrders.reduce((acc, el) => { 
              const idClient = el.clientId
              if(acc[idClient]) { 
                  acc[idClient].push(el)
              } else { 
                  acc[idClient] = [el]
              }
              return acc
          }, {})
          const getDataOnArray = Object.entries(agroupOrdersByClient).map(([idClient, orders]) => ({ 
              idClient: idClient,
              clientName: orders.map((d) => d.client)[0],
              totalAmountFactured: orders.map((ord) => ord.total).reduce((acc, el) => acc + el, 0),
              orders: orders
          }))
          const orderResultByBetterAmount = getDataOnArray.sort((a, b) => b.totalAmountFactured - a.totalAmountFactured)
          console.log("MIRA ACA", orderResultByBetterAmount)
          setClientsRanking(orderResultByBetterAmount)
          return orderResultByBetterAmount
          }     
        }

        useEffect(() => { 
          if(allOrders.length >= 0) { 
              console.log(orderOrdersByClient())
              orderOrdersByClient()
          }
        }, [allOrders])



        
         useEffect(() => {
            if (clientsRanking.length > 0) {
              console.log(clientsRanking)
              const firstData = clientsRanking[0];
              console.log(clientsRanking[0])
              const properties = Object.keys(firstData);
              const filteredProperties = properties.filter(property => property !== 'idClient' &&  property !== 'choosenProductCategory' );
          
              const columnLabelsMap = {
                clientName: 'Cliente',
                totalAmountFactured: 'Monto total',            
              };
          
              const tableColumns = filteredProperties.map(property => ({
                key: property,
                label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
              }));
          
              setColumns(tableColumns);
            }
      }, [clientsRanking]);
        

  return (
    <>
      <p className="text-sm font-medium text-black cursor-pointer" onClick={onOpen}>Estadisticas Clientes</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Estadisticas Clientes</ModalHeader>
              <ModalBody>
              <div>
     
                  <div className='flex flex-col justify-start items-start'>
                    <p className='underline font-medium'>Ranking de clientes ordenados de mayor a menor</p>
                    <p className='font-bold text-zinc-600 text-md mt-2'>Mes: {monthSelected}</p>
                    <p className='font-bold text-zinc-600 text-md'>Año: {yearSelected}</p>
                  </div>
                  <div className='flex gap-4'>
                          <Dropdown>
                                <DropdownTrigger>
                                    <p className='text-black cursor-pointer font-bold text-xl'>...</p>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...everyMonths]}>
                                    {(item) => (
                                    <DropdownItem key={item.key} onClick={() => setMonthSelected(item.label)}>
                                        {item.label}
                                    </DropdownItem>
                                    )}
                                </DropdownMenu>
                          </Dropdown>
                          <Dropdown>
                                <DropdownTrigger>
                                    <p className='text-black cursor-pointer font-bold text-xl'>...</p>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...availableYears]}>
                                    {(item) => (
                                    <DropdownItem key={item.key} onClick={() => setYearSelected(item.label)}>
                                        {item.label}
                                    </DropdownItem>
                                    )}
                                </DropdownMenu>
                          </Dropdown>
                  </div>
            
                {withOutOrders ? 
                
                    <p>Ningun cliente realizado pedidos este Mes</p>
               
                  :
           
                      <div className='flex flex-col items-start justify-start'>
                            {clientsRanking.map((client, index) => (
                              <div key={client.idClient} className='flex items-center gap-2'>
                                  <p><b className='text-black font-bold'>Puesto{index + 1}</b>  --</p>
                                  <p><b className='text-green-600 font-medium'>Nombre: </b> {client.clientName}</p>
                                  <p><b className='text-green-600 font-medium'>Monto total gastado en Pone La Mesa: </b> {formatePrice(client.totalAmountFactured)} </p>
                                  <p><b className='text-green-600 font-medium'>Cantidad de pedidos: </b> {client.orders.length}</p>
                              </div>
                            ))}
                      </div>
                
                }          
          
     </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EstadisticsClientsModal


*/