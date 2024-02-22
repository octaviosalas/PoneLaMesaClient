import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { formatePrice, getMonth, getYear, getEveryOrders, everyMonthsOfTheYear, everyYears } from '../../../functions/gralFunctions';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

const TopClientsEstadistics = () => {

    
    const [allOrders, setAllOrders] = useState([])
    const [clientsRanking, setClientsRanking] = useState([])
    const [withOutOrders, setWithOutOrders] = useState(false)
    const [monthSelected, setMonthSelected] = useState("Todos")
    const [yearSelected, setYearSelected] = useState(getYear())
    const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
    const [availableYears, setAvailableYears] = useState(everyYears)


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




  return (
    <div>
        <Card>
            <CardHeader className='flex items-top justify-between'>
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

            </CardHeader>
            {withOutOrders ? 
              <CardBody>
                <p>Ningun cliente realizado pedidos este Mes</p>
              </CardBody>
              :
              <CardBody>
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
              </CardBody>
            }          
        </Card>
    </div>
  )
}

export default TopClientsEstadistics
