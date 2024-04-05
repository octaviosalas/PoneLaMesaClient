import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatePrice, getMonth, getYear, getEveryOrders, everyMonthsOfTheYear, everyYears } from '../../../functions/gralFunctions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';



const ArticlesRanking = () => {

    const [monthSelected, setMonthSelected] = useState("Todos")
    const [yearSelected, setYearSelected] = useState(getYear())
    const [allOrders, setAllOrders] = useState([]);
    const [actualYear, setActualYear] = useState(getYear())
    const [ordersDetails, setOrdersDetails] = useState([])
    const [articlesRanking, setArticlesRanking] = useState([])
    const [everyMonths, setVeryMonths] = useState(everyMonthsOfTheYear)
    const [withOutOrders, setWithOutOrders] = useState(false)
    const [availableYears, setAvailableYears] = useState(everyYears)

   
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
             amountFactured: formatePrice(rentals.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0))
            })).sort((a, b) => a.amountFactured - b.amountFactured).slice(0, 5)
          setArticlesRanking(transformToArray)   
          return transformToArray
        }
     }
  
    useEffect(() => {
      getJustOrderDetails();
    }, [allOrders]);

    useEffect(() => {
       console.log( getBestFiveProductsEstadistics())
      }, [ordersDetails]);

  return (
    <div>
         <Card className='shadow-xl shadow-rigth-left w-96'>
                <CardHeader className="pb-0 pt-2 px-4 flex justify-between items-center ">
                  <div className='flex flex-col jusitfy-start items-start'>
                    <p className='font-bold text-sm underline text-zinc-400'>Top 5 Articulos:</p>
                    <p className='font-bold text-sm underline text-zinc-400'>Mes: {monthSelected}</p>
                    <p className='font-bold text-sm underline text-zinc-400'>Año: {yearSelected}</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Dropdown>
                          <DropdownTrigger>
                              <p className='text-black cursor-pointer font-bold text-xl'>...</p>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Dynamic Actions" items={[{ key: '0', label: 'Todos' }, ...everyMonths]}>
                              {(item) => (
                              <DropdownItem key={item.value} onClick={() => setMonthSelected(item.label)}>
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
                            <DropdownItem key={item.value} onClick={() => setYearSelected(item.label)}>
                                {item.label}
                            </DropdownItem>
                            )}
                        </DropdownMenu>
                  </Dropdown>
                  </div>

                   
                </CardHeader>
            {withOutOrders ? 
             <CardBody className='flex flex-col items-center justify-center'>
             <p>No hay ordenes para el mes de {monthSelected}</p>
          </CardBody>
             :
            <CardBody className='flex flex-col items-center justify-center'>
                 {articlesRanking.map((art) => ( 
                    <div key={art.productName} className='flex flex-col shadow-md border'>
                         <p className='text-xs font-medium text-zinc-500'><b className='black'>Articulo:</b> {art.productName}</p>
                         <p className='text-xs font-medium text-zinc-500'><b className='black'>Cantidad de pedidos solicitado:</b> {art.quantityRentals}</p>
                         <p className='text-xs font-medium text-zinc-500'><b className='black'>Cantidad de unidades alquiladas:</b> {art.quantityProductsRented}</p>
                         <p className='text-xs font-medium text-zinc-500'><b className='black'>Monto total facturado por este producto: </b>{art.amountFactured}</p>
                    </div>
                 ))}
            </CardBody> 
            }
         </Card>
    </div>
  )
}

export default ArticlesRanking