import React, { useEffect, useState } from 'react'
import {getMonthlyOrder, getEveryExpenses, formatePrice, getMonthlySublets, getMonthlyFixedExpenses, getEveryPurchases} from "../../../functions/gralFunctions"
import { Card, List, ListItem, Title } from '@tremor/react';
import ModalGraphicPurchase from './ModalGraphicPurchase';
import ModalGraphicAllExpenses from './ModalGraphicAllExpenses';

const ExpensesGraphic = ({monthSelected, yearSelected}) => {

    const [allExpenses, setAllExpenses] = useState([])
    const [allPurchases, setAllPurchases] = useState([])
    const [withOutPurchases, setWithOutPurchases] = useState(false)
    const [totalAmountPurchases, setTotalAmountPurchases] = useState(0)
    const [withOutExpenses, setWithOutExpenses] = useState(false)
    const [totalAmountExpenses, setTotalAmountExpenses] = useState(0)
    const [withOutSublets, setWithOutSublets] = useState(false)
    const [totalAmountSublets, setTotalAmountSublets] = useState(0)
    const [allSublets, setAllSublets] = useState([])
    const [allFixedExpenses, setAllFixedExpenses] = useState([])
   const  [withOutFixedExpenses, setWithOutFixedExpenses] = useState(false)
   const  [totalAmountFixedExpenses, setTotalAmountFixedExpenses] = useState(false)
 
    const getData = async () => { 
        const yearFormated = Number(yearSelected)
        try {
            const expensesData = await getEveryExpenses(); 
            const filterExpensesByMonth = expensesData.filter((exp) => exp.month === monthSelected && exp.year === yearFormated)
            setAllExpenses(filterExpensesByMonth)
            console.log("Todos los gastos del Mes", filterExpensesByMonth)  
            if(filterExpensesByMonth.length === 0) { 
                setWithOutExpenses(true)
              } else { 
                const getTotalAmountExpenses = filterExpensesByMonth.reduce((acc, el) => acc + el.amount, 0)
                console.log("Monto total en Gastos", getTotalAmountExpenses)
                setTotalAmountExpenses(getTotalAmountExpenses)
              }    
              
              const subletsData = await getMonthlySublets(monthSelected); 
              console.log("subs", subletsData)
              const fitlerData = subletsData.filter((sub) => sub.year === yearFormated)
              console.log("subs filtrados", fitlerData)
              setAllSublets(fitlerData)
              if(fitlerData.length === 0) { 
                setWithOutSublets(true)
              } else { 
                const getTotalAmountSublets = fitlerData.reduce((acc, el) => acc + el.amount, 0)
                console.log("Monto total gstado en Subalquileres", getTotalAmountSublets)
                setTotalAmountSublets(getTotalAmountSublets)
              } 

              const fixedExpenses = await getMonthlyFixedExpenses(monthSelected, yearFormated); 
              console.log("GASTOS FIJOS TOTALES MES Y AÑO", fixedExpenses)
              setAllFixedExpenses(fixedExpenses)
              if(fixedExpenses.length === 0) { 
               setWithOutFixedExpenses(true)
              } else { 
                const getTotalAmountExpensesFixed = fixedExpenses.reduce((acc, el) => acc + el.amount, 0)
                console.log("Monto total gstado en gastos fijos", getTotalAmountExpensesFixed)
                setTotalAmountFixedExpenses(getTotalAmountExpensesFixed)
              }

              const purchasesData = await getEveryPurchases();
              const filterDataByMonth = purchasesData.filter((purch) => purch.month === monthSelected && purch.year === yearFormated)
              setAllPurchases(filterDataByMonth)     
              console.log("COMPRAS MES", filterDataByMonth) 
              if(filterDataByMonth.length === 0) { 
                setWithOutPurchases(true)
              } else { 
                const getTotalAmountPurchases = filterDataByMonth.reduce((acc, el) => acc + el.total, 0)
                console.log("Monto total en compras", getTotalAmountPurchases)
                setTotalAmountPurchases(getTotalAmountPurchases)
              }   


        } catch (error) {
           console.log(error)   
        }
    }

    useEffect(() => { 
        getData()
    }, [])

  return (
    <>
       <div className='flex items-center gap-10'>
       <Card className=" w-[700px] h-[250px] max-h-[250px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
             <div className='w-full flex justify-end'>
              <ModalGraphicAllExpenses data={allExpenses}/>
            </div>
            <div className='flex items-center justify-between mt-3'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Todos los gastos</h3>
               <p className='text-sm font-medium text-zinc-600'>Total: {formatePrice(totalAmountExpenses)}</p>
            </div>
              <List className="mt-2 text-left">
                  {allExpenses.map((item, index) => (
                      <ListItem key={item._id} className='flex justify-between items-center'>
                        <span>{index + 1}</span>
                        <span>{item.typeOfExpense === "Compra" && item.typeOfExpense === "SubAlquiler" ? item.providerName : item.fixedExpenseType}</span>
                        <span>{item.typeOfExpense}</span>
                        <span>{formatePrice(item.amount)}</span>
                      </ListItem>
                  ))}
                </List>
        </Card>

          
        <Card className="w-[700px] h-[250px] max-h-[250px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='w-full flex justify-end'>
              <ModalGraphicPurchase data={allPurchases}/>
            </div>
            <div className='flex items-center justify-between mt-3'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Compras</h3>
               <p className='text-sm font-medium text-zinc-600'>Total: {formatePrice(totalAmountPurchases)}</p>
            </div>
              <List className="mt-2 text-left">
                  {allPurchases.map((item, index) => (
                      <ListItem key={item._id} className='flex justify-between items-center'>
                        <span>{index + 1}</span>
                        <span>{item.providerName}</span>
                        <span>{formatePrice(item.total)}</span>
                      </ListItem>
                  ))}
                </List>
        </Card>

        <Card className=" w-[700px] h-[250px] max-h-[250px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Sub Alquileres</h3>
               <p className='text-sm font-medium text-zinc-600'>Total: {formatePrice(totalAmountSublets)}</p>
            </div>
             {allSublets.length > 0 ?
              <List className="mt-2 text-left">
                  {allSublets.map((item, index) => (
                      <ListItem key={item._id} className='flex justify-between items-center'>
                        <span>{index + 1}</span>
                        <span>{item.provider}</span>
                        <span>{formatePrice(item.amount)}</span>
                      </ListItem>
                  ))}
                </List> :
                  <div className='flex justify-center items-center text-center mt-12'>
                     <p className='font-medium text-zinc-600 text-sm'>No hay Subalquileres</p>
                  </div>}
        </Card>
    </div>
    <div className='mt-8'>
      <Card className=" w-[700px] max-h-[500px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
              <div className='flex items-center justify-between'>
                <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Gastos Fijos</h3>
                <p className='text-sm font-medium text-zinc-600'>Total: {formatePrice(totalAmountFixedExpenses)}</p>
              </div>
                <List className="mt-2 text-left">
                    {allFixedExpenses.map((item, index) => (
                        <ListItem key={item._id} className='flex justify-between items-center'>
                          <span>{index + 1}</span>
                          <span>{item.fixedExpenseType}</span>
                          <span>{formatePrice(item.amount)}</span>
                        </ListItem>
                    ))}
                  </List>
          </Card>
    </div>
   
    </>
 
  )
}

export default ExpensesGraphic
