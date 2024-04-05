import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatePrice, getMonth, getYear, getEveryOrders, everyMonthsOfTheYear, everyYears } from '../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import Loading from "../Loading/Loading";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";

const EstadisticsArticles = () => { 
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [columns, setColumns] = useState([]);
  const [monthSelected, setMonthSelected] = useState("Todos")
  const [yearSelected, setYearSelected] = useState(getYear())
  const [allOrders, setAllOrders] = useState([]);
  const [actualYear, setActualYear] = useState(getYear())
  const [ordersDetails, setOrdersDetails] = useState([])
  const [articlesRanking, setArticlesRanking] = useState([])
  const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
  const [withOutOrders, setWithOutOrders] = useState(false)
  const [availableYears, setAvailableYears] = useState(everyYears)
  const [size, setSize] = useState("2xl")
  const [loading, setLoading] = useState(true)

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getEveryOrders();
        if(monthSelected === "Todos" && yearSelected === "Todos") { 
          if(ordersData.length !== 0) { 
            setAllOrders(ordersData);
            setWithOutOrders(false)
          } else { 
            setWithOutOrders(true)
          }
        
        }else if (yearSelected !== "Todos" && monthSelected !== "Todos") { 
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

      const getJustOrderDetails = () => {
          if (allOrders.length > 0) {
              const concatenatedArray = [].concat(...allOrders.map((ord) => ord.orderDetail));
              console.log(concatenatedArray);
              setOrdersDetails(concatenatedArray)
          }
      };

      const getBestFiveProductsEstadistics = () => { 
          if(ordersDetails.length > 0) { 
            const getTimesRented =  ordersDetails.reduce((acc, el) => { 
              const nameProduct = el.productName
              if(acc[nameProduct]) { 
                  acc[nameProduct].push(el)
              } else { 
                  acc[nameProduct] = [el]
              }
              return acc
            }, {})
            console.log(getTimesRented)

            const transformToArray = Object.entries(getTimesRented).map(([productName, rentals]) => ({ 
              productName: productName,
              quantityRentals: rentals.length,
              quantityProductsRented: rentals.reduce((acc, el) => acc + parseInt(el.quantity, 10), 0),
              amountFactured: rentals.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0)
              }))
              console.log("sin ordenar", transformToArray)
              const orderData = transformToArray.sort((a, b) => b.amountFactured - a.amountFactured).slice(0, 5)
              
            
            setArticlesRanking(orderData)   
            console.log("ordenados", orderData)
            return orderData
          }
      }

       useEffect(() => {
        getJustOrderDetails();
       }, [allOrders]);

       useEffect(() => {
        console.log(getBestFiveProductsEstadistics())
        }, [ordersDetails]);

        useEffect(() => {
          if (articlesRanking.length > 0) {
             console.log(articlesRanking);
             const firstData = articlesRanking[0];
             console.log(articlesRanking[0]);
             const properties = Object.keys(firstData);
             const filteredProperties = properties.filter(property => property !== 'idClient' && property !== 'orders');
         
             const columnLabelsMap = {
               amountFactured: 'Monto Facturado',
               productName: 'Articulo',
               quantityProductsRented: 'Unidades Alquiladas',
               quantityRentals: 'Alquileres',
             };
         
             const tableColumns = filteredProperties.map(property => ({
               key: property,
               label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
             }));
         
            
         
             setColumns(tableColumns);
             
                  setLoading(false)
            
          }
         }, [articlesRanking]);

  return (
    <>
      <p className="text-sm font-medium text-black cursor-pointer" onClick={onOpen}>Estadisticas Articulos</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Top 5 Articulos
                <p className='underline font-medium text-sm text-zinc-600'>Ordenados por facturacion generada:</p>
                </ModalHeader>
              <ModalBody>                        
                  <div className='flex items-center gap-4'>
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
              <div className="flex flex-col items-center justify-center">
                 <p className="text-sm font-medium text-red-600">No hay ordenes para el mes de {monthSelected}</p>
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
                        <TableBody items={articlesRanking}>
                        {(item) => (
                          <TableRow key={item.productName}>
                            {columns.map(column => (
                            <TableCell key={column.key} className="text-start items-start">
                            {column.cellRenderer ? (
                                column.cellRenderer({ row: { original: item } })
                              ) : (
                                (column.key === "amountFactured") ? (
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
      
              </ModalBody>

           <ModalFooter className="flex items-center justify-center">
              <Button className="w-96 text-md font-medium text-white bg-green-800" onPress={onClose}> Cerrar </Button>
            </ModalFooter>

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EstadisticsArticles
