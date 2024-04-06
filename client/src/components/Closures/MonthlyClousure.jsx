import React, {useState, useEffect} from 'react'
import {everyMonthsOfTheYear, everyYears, getMonth, getEveryPurchases, getEveryExpenses, getMonthlyOrder, getMonthlySublets, getMonthlyCollections, formatePrice } from '../../functions/gralFunctions';
import { useParams } from 'react-router-dom';
import NavBarComponent from '../Navbar/Navbar';
import Loading from '../Loading/Loading';
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";
import axios from 'axios';

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
    const [collectionsAgroupByType, setCollectionsAgroupByType] = useState([])
    const [collectionsAgroupByAccounts, setCollectionsAgroupByAccounts] = useState([])
    const [totalAmountCollections, setTotalAmountCollections] = useState(0)
    const [employeesReport, setEmployeesReport] = useState([])
    const [withOutCollections, setWithOutCollections] = useState(false)
    const [withOutEmployeesData, setWithOutEmployeesData] = useState(false)
    const [withOutPurchases, setWithOutPurchases] = useState(false)
    const [withOutExpenses, setWithOutExpenses] = useState(false)
    const [withOutOrders, setWithOutOrders] = useState(false)
    const [withOutSublets, setWithOutSublets] = useState(false)
    const [actualMonth, setActualMonth] = useState(getMonth())
    const { year, month } = useParams();

    //total facturado
    // total gastado en compras
    // total gastado en sub alquileres
    // total gastado en empleados


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
            
            //empleados
            const getShiftsByMonth = await axios.get(`http://localhost:4000/employees/getShifsByMonth/${month}`)
            const data = getShiftsByMonth.data
            const filterDataByYear = data.filter((d) => d.year === yearFormated)
            console.log(filterDataByYear)
            const agroupSiftsByEmployeeId = filterDataByYear.reduce((acc, el) => { 
              const employeeId = el.employeeId
              if(acc[employeeId]) { 
                acc[employeeId].push(el)
              } else { 
                acc[employeeId] = [el]
              }
              return acc
            }, {})
            const transformResultInArrayData = Object.entries(agroupSiftsByEmployeeId).map(([employeeId, employeeData]) => ({ 
              employeeId: employeeId,
              employeeName: employeeData.map((em) => em.employeeName)[0],
              quantityShifts: employeeData.length,
              totalHours: employeeData.reduce((acc, el) => acc + el.hours, 0),
              totalAmountToPaid: employeeData.reduce((acc, el) => acc + el.totalAmountPaidShift, 0)
            }))
            console.log("EMPLEADOS DATA", transformResultInArrayData)
            if(transformResultInArrayData.length > 0) { 
              setEmployeesReport(transformResultInArrayData)
              setWithOutEmployeesData(false)
            } else { 
              setWithOutEmployeesData(true)
              setWithOutEmployeesData([])
            }

            //Cobros
            const collectionsData = await getMonthlyCollections(month)
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
                <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
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

                <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
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

                <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
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

                <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
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

                  <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
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
                  
                  <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
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

              <div className='flex flex-col items-center jsutify-center'>
                  <div className='mt-8 flex justify-start items-start w-full'>
                      <h3 className='font-bold text-zinc-600 text-md underline'>Cobros</h3>
                  </div>
                  <div className='flex items-center gap-6'>

                      <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                          <h5 className='font-bold text-black text-md'> - Cobros / Tipo de Cobros - </h5> 
                          <h6 className='font-medium text-white text-sm bg-green-800'>Monto total Cobrado: {totalAmountCollections}</h6> 
                          <div className='mt-6 ml-4'>
                            {collectionsAgroupByType.map((cc) =>  ( 
                              <div className='flex flex-col items-start justify-start text-start mt-4' key={cc.collectionType}> 
                                <div className='flex items-center'>
                                  <p className='text-md'><b>Tipo de Cobro:</b> {cc.collectionType}</p> 
                                </div>  
                                <div>
                                  <p><b className='text-sm'>Total Cobrado: </b> {formatePrice(cc.totalAmount)} </p>  
                                  <p><b className='text-sm'>Cantidad de Cobros: </b> {cc.quantityCollections} </p>  
                                </div>                  
                              </div>
                            ))}
                          </div>
                       </div>

                       <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                          <h5 className='font-bold text-white bg-green-800 text-md'> - Cobros Por Cuentas - </h5>                 
                          <div className='mt-6 ml-4'>
                            {collectionsAgroupByAccounts.map((cc) =>  ( 
                              <div className='flex flex-col items-start justify-start text-start mt-4' key={cc.account}> 
                                <div className='flex items-center'>
                                  <p className='text-md underline'><b>Cuenta:</b> {cc.account}</p> 
                                </div>  
                                <div>
                                  <p><b className='text-sm'>Total Cobrado: </b> {formatePrice(cc.totalAmount)} </p>  
                                  <p><b className='text-sm'>Cantidad de Cobros: </b> {cc.quantityCollections} </p>  
                                  <p><b className='text-sm'>Cobros Alquileres: </b> {cc.ordersCollections} </p>  
                                  <p><b className='text-sm'>Cobros Señas: </b> {cc.downPaymentCollections} </p>  
                                  <p><b className='text-sm'>Cobros Reposiciones: </b> {cc.replacementeCollections} </p>  
                                </div>                  
                              </div>
                            ))}
                          </div>
                       </div>
                
                  </div>
              </div>       

              <div className='flex flex-col items-center jsutify-center'>
                  <div className='mt-8 flex justify-start items-start w-full'>
                      <h3 className='font-bold text-zinc-600 text-md underline'>Empleados</h3>
                  </div>
                  <div className='flex items-center gap-6'>
                    <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                            <h5 className='font-bold text-black text-md'> - Liquidacion Empleados</h5> 
                            <h6 className='font-medium text-white text-sm bg-green-800'>
                              Monto total a Pagar: {formatePrice(employeesReport.reduce((acc, el) => acc + el.totalAmountToPaid, 0))}
                              </h6> 
                            <div className='mt-6 ml-4'>
                              {employeesReport.map((em) =>  ( 
                                <div className='flex flex-col items-start justify-start text-start mt-4' key={em.employeeId}> 
                                  <div className='flex items-center'>
                                    <p className='text-md'><b>Empleado: </b> {em.employeeName}</p> 
                                  </div>  
                                  <div>
                                    <p><b className='text-sm'>Turnos Realizados: </b> {em.quantityShifts} </p>  
                                    <p><b className='text-sm'>Total de horas: </b> {em.totalHours} </p>  
                                    <p><b className='text-sm'>Total a Pagar: </b> {formatePrice(em.totalAmountToPaid)} </p> 
                                  </div>                  
                                </div>
                              ))}
                            </div>
                      </div>
                  </div>
              </div>    

                  <div className='flex flex-col items-center justify-center '>
                  <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                    <div className='w-full bg-green-800'>
                       <p className='text-sm font-bold text-white'>Resumen Cierre</p>
                    </div>
                    <div className='flex flex-col items.start text-start justify-start'>
                        <p><b>Total Cobrado en Alquileres:</b> {formatePrice(totalAmountOrders)}</p>
                        <p><b>Monto total Gastado:</b> {formatePrice(totalAmountExpenses + employeesReport.reduce((acc, el) => acc + el.totalAmountToPaid, 0))}</p>
                        <p><b>Monto total Gastado en Compras:</b> {formatePrice(totalAmountPurchases)}</p>
                        <p><b>Monto total Gastado en Sub Alquileres:</b> {formatePrice(totalAmountSublets)}</p>
                        <p><b>Gasto total en Empleados:</b> {formatePrice(employeesReport.reduce((acc, el) => acc + el.totalAmountToPaid, 0))}</p>
                        <p><b>GANANCIA NETA:</b> {formatePrice(totalAmountOrders - (totalAmountExpenses + employeesReport.reduce((acc, el) => acc + el.totalAmountToPaid, 0)))}</p>
                    </div>
                       
                     </div>
                  </div>                        
        </div>
      }
           
    </div>
  )
}

export default MonthlyClousure





    // total gastado en empleados