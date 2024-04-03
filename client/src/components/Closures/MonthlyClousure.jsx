import React, {useState, useEffect} from 'react'
import {everyMonthsOfTheYear, everyYears, getMonth, getEveryPurchases, getEveryExpenses, getMonthlyOrder, getMonthlySublets, formatePrice } from '../../functions/gralFunctions';
import { useParams } from 'react-router-dom';
import NavBarComponent from '../Navbar/Navbar';
import Loading from '../Loading/Loading';
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";

const MonthlyClousure = () => {
 
    const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
    const [loadingData, setLoadingData] = useState(true); // Step 1: Initialize loadingData state
    const [allPurchases, setAllPurchases] = useState([])
    const [totalAmountPurchases, setTotalAmountPurchases] = useState(0)
    const [allExpenses, setAllExpenses] = useState([])
    const [totalAmountExpenses, setTotalAmountExpenses] = useState(0)
    const [allOrders, setAllOrders] = useState([])
    const [ordersPaid, setOrdersPaid] = useState([])
    const [ordersWithOutPaid, setOrdersWithOutPaid] = useState([])
    const [totalAmountOrders, setTotalAmountOrders] = useState(0)
    const [totalAmountOrdersPaid, setTotalAmountOrdersPaid] = useState(0)
    const [totalAmountOrdersWithOutPaid, setTotalAmountOrdersWithOutPaid] = useState(0)
    const [ordersQuantity, setOrdersQuantity] = useState(0)
    const [allSublets, setAllSublets] = useState([])
    const [totalAmountSublets, setTotalAmountSublets] = useState(0)
    const [withOutPurchases, setWithOutPurchases] = useState(false)
    const [withOutExpenses, setWithOutExpenses] = useState(false)
    const [withOutOrders, setWithOutOrders] = useState(false)
    const [withOutSublets, setWithOutSublets] = useState(false)
    const [actualMonth, setActualMonth] = useState(getMonth())
    const { year, month } = useParams();


    useEffect(() => {
      const yearFormated = Number(year)
        const fetchData = async () => {
          try {

            //compras
            const purchasesData = await getEveryPurchases();
            const filterDataByMonth = purchasesData.filter((purch) => purch.month === month && purch.year === yearFormated)
            setAllPurchases(filterDataByMonth)     
            console.log("COMPRAS MES", filterDataByMonth) 
            if(filterDataByMonth.length === 0) { 
              setWithOutPurchases(true)
            } else { 
              const getTotalAmountPurchases = filterDataByMonth.reduce((acc, el) => acc + el.total, 0)
              console.log("Monto total en compras", getTotalAmountPurchases)
              setTotalAmountPurchases(getTotalAmountPurchases)
            }   

            //gastos
            const expensesData = await getEveryExpenses(); 
            const filterExpensesByMonth = expensesData.filter((exp) => exp.month === month && exp.year === yearFormated)
            setAllExpenses(filterExpensesByMonth)
            console.log("GASTOS MES", filterExpensesByMonth)  
            if(filterExpensesByMonth.length === 0) { 
              setWithOutExpenses(true)
            } else { 
              const getTotalAmountExpenses = filterExpensesByMonth.reduce((acc, el) => acc + el.amount, 0)
              console.log("Monto total en Gastos", getTotalAmountExpenses)
              setTotalAmountExpenses(getTotalAmountExpenses)
            }       

            //ordenes
            const ordersData = await getMonthlyOrder(month); 
            console.log("ORDENES MES", ordersData)
            setAllOrders(ordersData)
            const getOrdersWithPaid = ordersData.filter((ord) => ord.paid === true)
            const getOrdersWithOutPaid = ordersData.filter((ord) => ord.paid === false)
            if(ordersData.length === 0) { 
              setWithOutOrders(true)
            }  else { 
              setOrdersQuantity(ordersData.length)
              const getTotalAmountOrders = ordersData.reduce((acc, el) => acc + el.total, 0)
              const getTotalAmountOrdersWithPaid = getOrdersWithPaid.reduce((acc, el) => acc + el.total, 0)
              const getTotalAmountOrdersWithOutPaid = getOrdersWithOutPaid.reduce((acc, el) => acc + el.total, 0)            
              setTotalAmountOrders(getTotalAmountOrders)
              setOrdersPaid(getOrdersWithPaid)
              setOrdersWithOutPaid(getOrdersWithOutPaid)
              setTotalAmountOrdersPaid(getTotalAmountOrdersWithPaid)
              setTotalAmountOrdersWithOutPaid(getTotalAmountOrdersWithOutPaid)
            }    

            //subalquileres
            const subletsData = await getMonthlySublets(month); 
            console.log("SUB ALQUILERES MES", subletsData)
            setAllSublets(subletsData)
            if(subletsData.length === 0) { 
              setWithOutSublets(true)
            } else { 
              const getTotalAmountSublets = subletsData.reduce((acc, el) => acc + el.amount, 0)
              console.log("Monto total facturado en Subalquileres", getTotalAmountSublets)
              setTotalAmountSublets(getTotalAmountSublets)
            }    

          } catch (error) {
            console.error("Error fetching orders:", error);
          } finally {
            setLoadingData(false); // Step 3: Set loadingData to false at the end of fetchData
          }
        };
        fetchData();
      }, []); 


      useEffect(() => { 
        console.log(loadingData)
      }, [loadingData])


    return (
    <div>
      <NavBarComponent/>


      {loadingData ? <Loading/>: 
        <div className='flex flex-col items-center justify-center mt-24'>
             <div>
              <h3 className='font-medium text-green-800 text-lg'>Reporte: {month}</h3>
             </div>

             <div className='mt-8 flex justify-start items-start w-full'>
                <h3 className='font-bold text-zinc-600 text-md underline'>Pedidos</h3>
             </div>

             <div className='flex items-center justify-center gap-6'>
                <div className='flex flex-col w-96 max-h-[600px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                    <h5 className='font-bold text-black text-md'> - Todos los Pedidos - </h5> 
                    <h6 className='font-medium text-white text-sm bg-green-800'>Monto total: {formatePrice(totalAmountOrders)}</h6> 
                    <div className='mt-6 ml-4'>
                      {allOrders.map((ord) =>  ( 
                        <div className='flex flex-col items-start justify-start mt-4' key={ord._id}> 
                          <div className='flex items-center'>
                            <p className='text-md'><b>{ord.orderNumber} - {ord.client}</b></p> 
                          </div>  
                          <div>
                            <p><b className='text-sm'>Total: </b>{formatePrice(ord.total)} </p>  
                          </div>                  
                        </div>
                      ))}
                    </div>
                </div>

                <div className='flex flex-col w-96 max-h-[600px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                    <h5 className='font-bold text-black text-md'> - Pedidos Cobrados - </h5> 
                    <h6 className='font-medium text-white text-sm bg-green-800'>Monto total: {formatePrice(totalAmountOrdersPaid)}</h6> 
                    <div className='mt-6 ml-4'>
                      {ordersPaid.map((ord) =>  ( 
                        <div className='flex flex-col items-start justify-start mt-4' key={ord._id}> 
                          <div className='flex items-center'>
                            <p className='text-md'><b>{ord.orderNumber} - {ord.client}</b></p> 
                          </div>  
                          <div>
                            <p><b className='text-sm'>Total: </b>{formatePrice(ord.total)} </p>  
                          </div>                  
                        </div>
                      ))}
                    </div>
                </div>

                <div className='flex flex-col w-96 max-h-[600px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                    <h5 className='font-bold text-black text-md'> - Pedidos Pendientes de Cobro - </h5> 
                    <h6 className='font-medium text-white text-sm bg-green-800'>Monto total: {formatePrice(totalAmountOrdersWithOutPaid)}</h6> 
                    <div className='mt-6 ml-4'>
                      {ordersWithOutPaid.map((ord) =>  ( 
                        <div className='flex flex-col items-start justify-start mt-4' key={ord._id}> 
                          <div className='flex items-center'>
                            <p className='text-md'><b>{ord.orderNumber} - {ord.client}</b></p> 
                          </div>  
                          <div>
                            <p><b className='text-sm'>Total: </b>{formatePrice(ord.total)} </p>  
                          </div>                  
                        </div>
                      ))}
                    </div>
                </div>

             </div>

             <div className='mt-8 flex justify-start items-start w-full'>
                <h3 className='font-bold text-zinc-600 text-md underline'>Gastos</h3>
             </div>
             <div className='flex items-center justify-center gap-6'>

             <div className='flex flex-col w-96 max-h-[600px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                    <h5 className='font-bold text-black text-md'> - Todos los Gastos - </h5> 
                    <h6 className='font-medium text-white text-sm bg-red-500'>Monto total Gastado: {formatePrice(totalAmountExpenses)}</h6> 
                    <div className='mt-6 ml-4'>
                      {allExpenses.map((exp, index) =>  ( 
                        <div className='flex flex-col items-start justify-start mt-4' key={exp._id}> 
                          <div className='flex items-center'>
                            <p className='text-md'><b>{index + 1} - {exp.providerName}</b></p> 
                          </div>  
                           
                          <div className='flex flex-col items-start'>
                            <p><b className='text-sm'>Total: </b>{formatePrice(exp.amount)} </p>  
                            <p className='underline text-xs'>Ver detalle</p>
                          </div>                   
                        </div>
                      ))}
                    </div>
                </div>

              <div className='flex flex-col w-96 max-h-[600px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                        <h5 className='font-bold text-black text-md'> - Compras - </h5> 
                        <h6 className='font-medium text-white text-sm bg-red-500'>Monto total Gastado: {formatePrice(totalAmountPurchases)}</h6> 
                        <div className='mt-6 ml-4'>
                          {allPurchases.map((ord, index) =>  ( 
                            <div className='flex flex-col items-start justify-start mt-4' key={ord._id}> 
                              <div className='flex items-center'>
                                <p className='text-md'><b>{index + 1} - {ord.providerName}</b></p> 
                              </div>  
                              <div className='flex flex-col items-start'>
                                <p><b className='text-sm'>Total: </b>{formatePrice(ord.total)} </p>  
                                <p className='underline text-xs'>Ver detalle</p>
                            </div>                     
                            </div>
                          ))}
                        </div>
                  </div>
              
              <div className='flex flex-col w-96 max-h-[600px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                        <h5 className='font-bold text-black text-md'> - Sub Alquileres - </h5> 
                        <h6 className="font-medium text-white text-sm bg-red-500">Monto total Gastado: {formatePrice(totalAmountSublets)}</h6> 
                        <div className='mt-6 ml-4'>
                          {allSublets.map((ord, index) =>  ( 
                            <div className='flex flex-col items-start justify-start mt-4' key={ord._id}> 
                              <div className='flex items-center'>
                                <p className='text-md'><b>{index + 1} - {ord.provider}</b></p> 
                              </div>  
                              <div className='flex flex-col items-start'>
                                <p><b className='text-sm'>Total: </b>{formatePrice(ord.amount)} </p>  
                                <p className='underline text-xs'>Ver detalle</p>
                            </div>                  
                            </div>
                          ))}
                        </div>
                    </div>       
              </div>                                      
        </div>
      }
           
    </div>
  )
}

export default MonthlyClousure

/* 
1) Hotel dazzler 1
Total $52.490*/