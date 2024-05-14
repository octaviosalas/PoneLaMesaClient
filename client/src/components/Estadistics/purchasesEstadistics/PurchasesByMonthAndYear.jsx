import React, { useEffect } from 'react'
import axios from 'axios'
import { formatePrice, getMonth, getYear, getEveryPurchases, everyMonthsOfTheYear, everyYears } from '../../../functions/gralFunctions';
import { useState } from 'react';
import { Card, CardBody, CardHeader, Select, SelectItem } from '@nextui-org/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

const PurchasesByMonthAndYear = () => {

    const [monthSelected, setMonthSelected] = useState("Todos")
    const [availableYears, setAvailableYears] = useState(everyYears)
    const [yearSelected, setYearSelected] = useState(getYear())
    const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
    const [withOutPurchases, setWithOutPurchases] = useState(false)
    const [allPurchases, setAllPurchases] = useState([])


    useEffect(() => {
        const fetchData = async () => {
          try {
            const purchasesData = await getEveryPurchases();
            console.log(purchasesData)
            if(monthSelected === "Todos" && yearSelected === "Todos") { 
              if(purchasesData.length !== 0) { 
                setAllPurchases(purchasesData);
                setWithOutPurchases(false)
              } else { 
                setWithOutPurchases(true)
              }
      

            } else if (yearSelected !== "Todos" && monthSelected !== "Todos") { 
              const filterDataByMonthAndYearSelected = purchasesData.filter((purch) => purch.month === monthSelected && purch.year === yearSelected)
              if(filterDataByMonthAndYearSelected.length !== 0) { 
                  setAllPurchases(filterDataByMonthAndYearSelected);
                  setWithOutPurchases(false)
              } else { 
                setWithOutPurchases(true)
              }     

            } else if (yearSelected !== "Todos" && monthSelected === "Todos") { 
              const filterDataByYear = purchasesData.filter((purch) => purch.year === yearSelected)
              if(filterDataByYear.length !== 0) { 
                setAllPurchases(filterDataByYear);
                setWithOutPurchases(false)
              } else { 
                setWithOutPurchases(true)
              }      

            } else if (yearSelected === "Todos" && monthSelected !== "Todos") { 
              const filterDataByMonth = purchasesData.filter((purch) => purch.month === monthSelected)
              if(filterDataByMonth.length !== 0) { 
                setAllPurchases(filterDataByMonth);
                setWithOutPurchases(false)
              } else { 
                setWithOutPurchases(true)
              }      
            }


          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };
        fetchData();
      }, [monthSelected, yearSelected]); 

      useEffect(() => { 
        console.log(allPurchases)
      }, [])


    return (
        <div>
        <Card>
            <CardHeader className='flex items-top justify-between'>
              <div className='flex flex-col justify-start items-start'>
                 <p>Compras realizadas en:</p>
                 <p>Mes: {monthSelected}</p>
                 <p>Año: {yearSelected}</p>
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
            {withOutPurchases ? 
              <CardBody>
                <p className='text-white bg-red-600 w-full text-center'>No hay compras</p>
              </CardBody>
              :
              <CardBody>
                   <p>Has realizado {allPurchases.length} compras</p>
                   <p>Has gastado un monto total de: {formatePrice(allPurchases.reduce((acc, el) => acc + el.total, 0))} </p>
              </CardBody>
            }          
        </Card>
    </div>
    )
}

export default PurchasesByMonthAndYear
