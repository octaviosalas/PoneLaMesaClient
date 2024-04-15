import React, {useEffect, useState} from "react";
import NavBarComponent from "../Navbar/Navbar";
import {Button, useDisclosure, Input} from "@nextui-org/react";
import { months, everyYears } from "../../functions/gralFunctions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading/Loading";
import { formatePrice } from "../../functions/gralFunctions";
import EveryOrdersDetails from "./ClousuresDetailsModals/EveryOrdersDetails";
import ExpensesDetail from "./ClousuresDetailsModals/ExpensesDetail";
import CollectionsDetail from "./ClousuresDetailsModals/CollectionsDetail";
import EmployeesLiquidation from "./ClousuresDetailsModals/EmployeesLiquidation";


const PersonalizedClousure = () => {

  const [firstDateToShow, setFirstDateToShow] = useState("")
  const [secondDateToShow, setSecondDateToShow] = useState("")
  const [firstDate, setFirstDate] = useState("")
  const [secondDate, setSecondDate] = useState("")
  const [filteredOrdersObtained, setFilteredOrdersObtained] = useState([])
  const [filtredExpensesObtained, setFiltredExpensesObtained] = useState([])
  const [filteredCollectionsObtained, setFilteredCollections] = useState([])
  const [filteredShiftsObtained, setFilteredShiftsObtained] = useState([])
  const [dataAvailable, setDataAvailable] = useState(false)
  const [load, setLoad] = useState(false)
  const [justAllExpenses, setJustAllExpenses] = useState([])
  const [justPurchases, setJustPurchases] = useState([])
  const [justSublets, setJustSublets] = useState([])
  const [justFixedExpenses, setJustFixedExpenses] = useState([])
  const [justAllOrders, setJustAllOrders] = useState([])
  const [justPaidOrder, setJustPaidOrder] = useState([])
  const [justNoPaidOrder, setJustNoPaidOrder] = useState([])
  const [justEmployeesData, setJustEmployeesData] = useState([])
  const [showData, setShowData] = useState(false)
  const [filteredOrdersTotalAmount, setFilteredOrdersTotalAmount] = useState(0)
  const [filteredPaidOrdersTotalAmount, setFilteredPaidOrdersTotalAmount] = useState(0)
  const [filteredNoPaidOrdersTotalAmount, setFilteredNoPaidOrdersTotalAmount] = useState(0)
  const [filteredPurchasesTotalAmount, setFilteredPurchasesTotalAmount] = useState(0)
  const [filteredSubletsTotalAmount, setFilteredSubletsTotalAmount] = useState(0)
  const [filteredFixedTotalAmount, setFilteredFixedTotalAmount] = useState(0)
  const [filteredExpensesTotalAmount, setFilteredExpensesTotalAmount] = useState(0)
  const [collectionsAgroupByType, setCollectionsAgroupByType] = useState([])
  const [collectionsTotalAmount, setCollectionsTotalAmount] = useState(0)
  const [collectionsAgroupByAccount, setCollectionsAgroupByAccount] = useState([])

  const navigate = useNavigate()

  function obtenerNombreMes(mes) {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[mes];
  }

  const handleDateChange = (e) => {
    setFirstDate(e.target.value);
    const fechaObj = new Date(e.target.value);
    const dia = fechaObj.getDate();
    const mes = obtenerNombreMes(fechaObj.getMonth());
    const anio = fechaObj.getFullYear();
    console.log(`mes: ${mes}`);
    console.log(`año: ${anio}`);
    console.log(`dia: ${dia}`);
    setFirstDateToShow(`${dia} de ${mes} del ${anio}`)
  };

  const handleSecondDateChange = (e) => {
      setSecondDate(e.target.value);
      const fechaObj = new Date(e.target.value);
      const dia = fechaObj.getDate();
      const mes = obtenerNombreMes(fechaObj.getMonth());
      const anio = fechaObj.getFullYear();
      console.log(`mes: ${mes}`);
      console.log(`año: ${anio}`);
      console.log(`dia: ${dia}`);
      setSecondDateToShow(`${dia} de ${mes} del ${anio}`)

  };
 
  const getResource = async (url) => {
    setLoad(true)
    try {
       const { data } = await axios.get(url);
       return data;
    } catch (error) {
       console.error(error);
       return null;
    }
   };
   
   const getOrdersData = async () => {
    const firstDateObj = new Date(firstDate);
    const secondDateObj = new Date(secondDate);
   
    const [ordersData, expensesData, collectionsData, shiftsData] = await Promise.all([
       getResource("http://localhost:4000/orders"),
       getResource("http://localhost:4000/expenses"), 
       getResource("http://localhost:4000/collections"), 
       getResource("http://localhost:4000/employees/everyShifts")
    ]);
   
    const filterDataByDate = (data) => data.filter(item => {
       const itemDate = new Date(item.date);
       return itemDate >= firstDateObj && itemDate <= secondDateObj;
    });
   
    const filteredOrders = filterDataByDate(ordersData);
    const filteredOrdersTotalAmount = filteredOrders.reduce((acc, el) => acc + el.total, 0)
    setFilteredOrdersTotalAmount(filteredOrdersTotalAmount)

    const filteredExpenses = filterDataByDate(expensesData);
    const filteredCollections = filterDataByDate(collectionsData);
    const filteredShifts = filterDataByDate(shiftsData);
   
    console.log("Ordenes", filteredOrders);
    console.log("Gastos", filteredExpenses);
    console.log("Cobros", filteredCollections);
    console.log("Turnos", filteredShifts);
   
    setFilteredOrdersObtained(filteredOrders);
    setFiltredExpensesObtained(filteredExpenses);
    setFilteredCollections(filteredCollections);
    setFilteredShiftsObtained(filteredShifts);
    setDataAvailable(true);
    agroupExpensesByType(filteredExpenses)
    agroupOrderByPaidOrNoPaid(filteredOrders)
    agroupCollectionByType(filteredCollections)
    agroupCollectionByAccount(filteredCollections)
    getEmployeesShiftsDataAmount(filteredShifts)
    setLoad(false)
   };

   const agroupExpensesByType = (filtredExpensesObtained) => { 
       const agroupByType = filtredExpensesObtained.reduce((acc, el) => { 
        const typeOfExpense = el.typeOfExpense
        if(acc[typeOfExpense]) { 
          acc[typeOfExpense].push(el)
        } else { 
          acc[typeOfExpense] = [el]
        } 
        return acc
       }, {})
       const transform = Object.entries(agroupByType).map(([collectionType, data]) => { 
         return { 
             collectionType: collectionType,
             data: data
         }
       })

       
       const getPurchases = transform.filter((tr) => tr.collectionType === "Compra").map((d) => d.data).flat()
       const getSublets = transform.filter((tr) => tr.collectionType === "Sub Alquiler").map((d) => d.data).flat()
       const getFixedExpenses = transform.filter((tr) => tr.collectionType === "Gasto Fijo").map((d) => d.data).flat()
       const totalAmountPurchases = getPurchases.reduce((acc, el) => acc + el.amount, 0)
       const totalAmountSublets= getSublets.reduce((acc, el) => acc + el.amount, 0)
       const totalAmountExpended = getFixedExpenses.reduce((acc, el) => acc + el.amount, 0)
       const allExpenses = transform.map((d) => d.data).flat()
       const getTotalAmountExpensesFiltered = allExpenses.reduce((acc, el) => acc + el.amount, 0)
       console.log("Por aca gastos enteros props", allExpenses)

       setJustPurchases(getPurchases)
       setJustSublets(getSublets)
       setJustFixedExpenses(getFixedExpenses)
       setJustAllExpenses(allExpenses)
       setFilteredPurchasesTotalAmount(totalAmountPurchases)
       setFilteredSubletsTotalAmount(totalAmountSublets)
       setFilteredFixedTotalAmount(totalAmountExpended)
       setFilteredExpensesTotalAmount(getTotalAmountExpensesFiltered)
       console.log("Gastos Agrupados", transform)
       return transform
   }

   const agroupOrderByPaidOrNoPaid = (filteredOrdersObtained) => { 
    const agroupByPaidOrNoPaid = filteredOrdersObtained.reduce((acc, el) => { 
      const paid = el.paid
      if(acc[paid]) { 
        acc[paid].push(el)
      } else { 
        acc[paid] = [el]
      } 
      return acc
    }, {})
    const transform = Object.entries(agroupByPaidOrNoPaid).map(([paid, data]) => { 
      return { 
          paid: paid,
          data: data
      }
    })
    
    const paidOrders = transform.filter((tr) => tr.paid === "true").map((n) => n.data).flat()
    console.log("PAID ORDERS", paidOrders)
    const totalAmountPaidOrders = paidOrders.reduce((acc, el) => acc + el.total, 0)
    console.log("AMOUNT PAID ORDERS", totalAmountPaidOrders) // Corregido aquí
    const noPaidOrders = transform.filter((tr) => tr.paid === "false").map((n) => n.data).flat()
    console.log("NO PAID", noPaidOrders)
    const totalAmountnOPaidOrders = noPaidOrders.reduce((acc, el) => acc + el.total, 0)
    console.log("AMOUNT NO PAID", totalAmountnOPaidOrders) // Ahora se imprime después de su inicialización
    setJustPaidOrder(paidOrders)
    setJustNoPaidOrder(noPaidOrders)
    setJustAllOrders(transform)
    setFilteredPaidOrdersTotalAmount(totalAmountPaidOrders)
    setFilteredNoPaidOrdersTotalAmount(totalAmountnOPaidOrders)
    console.log("Ordenes agrupadas por pagas o impagas", transform)
    return transform
   }

    const agroupCollectionByType = (filteredCollectionsObtained) => { 
      const agroupByTypeCollections = filteredCollectionsObtained.reduce((acc, el) => { 
        const collectionType = el.collectionType
        if(acc[collectionType]) { 
          acc[collectionType].push(el)
        } else { 
          acc[collectionType] = [el]
        } 
        return acc
      }, {})
      const transform = Object.entries(agroupByTypeCollections).map(([collectionType, data]) => { 
        return { 
            collectionType: collectionType,
            quantityCollections: data.length,
            totalAmount: data.reduce((acc, el) => acc + el.amount, 0)
        }
      })
      
      console.log("Cobros agrupados por tipo", transform)
      const getTotalAmountCollections = transform.reduce((acc , el) => acc + el.totalAmount, 0)
      setCollectionsAgroupByType(transform)
      setCollectionsTotalAmount(getTotalAmountCollections)
      return transform
    }

    const agroupCollectionByAccount = (filteredCollectionsObtained) => { 
      const accountCollections = filteredCollectionsObtained.reduce((acc, el) => { 
        const account = el.account
        if(acc[account]) { 
          acc[account].push(el)
        } else { 
          acc[account] = [el]
        } 
        return acc
      }, {})
      const transform = Object.entries(accountCollections).map(([account, data]) => { 
        return { 
            account: account,
            quantityCollections: data.length,
            totalAmount: data.reduce((acc, el) => acc + el.amount, 0)
        }
      })
      
      console.log("Cobros agrupados por cuenta", transform)
      setCollectionsAgroupByAccount(transform)
      return transform
    }

    const getEmployeesShiftsDataAmount = (filteredShiftsObtained) => { 
    
              const agroupSiftsByEmployeeId = filteredShiftsObtained.reduce((acc, el) => { 
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
              setJustEmployeesData(transformResultInArrayData)      
    }

    const nowShowClousureData = () => { 
      setShowData(true)
    }

    const comeBackAndChooseOtherDate = () => { 
      setShowData(false)
      setDataAvailable(false)
    }


  return (
    <div className="flex flex-col">
        <NavBarComponent/>
        <div className="w-full flex flex-col items-center mt-36">
             <div> 
                  {dataAvailable && showData ? <p className="text-sm font-medium text-black">Reporte desde: {firstDateToShow} al {secondDateToShow}</p> : null}

                  {showData ? null :
                  <>
                    <Input className="w-96" type="date" onChange={handleDateChange} />
                    <Input className="w-96" type="date" onChange={handleSecondDateChange} />
                  </>}

             </div>
             <div>
             {dataAvailable ? (
                  showData ?
                    <Button className="bg-green-800 font-medium text-white text-sm w-96 mt-4" onClick={() => comeBackAndChooseOtherDate()}>Modificar Fecha</Button>
                    : 
                   <Button className="bg-green-800 font-medium text-white text-sm w-96 mt-4" onClick={() => nowShowClousureData()}>Ver Datos</Button>
                  ) : (
                  <>
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2">
                          <Button className="bg-green-800 text-white font-medium text-sm w-96 mt-4" onClick={() => getOrdersData()}>
                            Siguiente
                          </Button>
                          <Button className="bg-green-800 text-white font-medium text-sm w-96 mt-4">
                            Cerrar
                          </Button>
                        </div>
                        <div className="flex items-center">
                          {load ? <Loading/> : null}
                        </div>
                      </div>
                  </>
              )}  
             </div>
        </div>

          {showData ? 
          <> 
            <div className="flex gap-24 items-center justify-between mt-12"> 
              <div className="flex flex-col">

               <div className="flex flex-col items-center justify-start text-start w-[500px] ">
                  <div className="flex items-start justify-start text-start w-full">
                     <p className="text-zinc-600 font-bold text-md">Pedidos</p>
                  </div>
                  <div className="flex items-center text-start justify-between mt-2 w-full">
                      <div className="flex flex-col">
                        <p className="text-zinc-600 font-medium text-sm mt-1">Todos los pedidos</p>
                        <p className="text-zinc-600 font-medium text-sm mt-1">Pendientes</p>
                        <p className="text-zinc-600 font-medium text-sm mt-1">Cobrados</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm text-zinc-600  mt-1"> {formatePrice(filteredOrdersTotalAmount)}</p>
                        <p className="font-medium text-sm text-zinc-600  mt-1"> {formatePrice(filteredNoPaidOrdersTotalAmount)}</p>
                        <p className="font-medium text-sm text-zinc-600  mt-1"> {formatePrice(filteredPaidOrdersTotalAmount)}</p>
                      </div>
                      <div>
                        <EveryOrdersDetails ordersData={filteredOrdersObtained} first={firstDateToShow} second={secondDateToShow} type={"all"}/>
                        <EveryOrdersDetails ordersData={justNoPaidOrder} first={firstDateToShow} second={secondDateToShow} type={"noPaid"}/>
                        <EveryOrdersDetails ordersData={justPaidOrder} first={firstDateToShow} second={secondDateToShow} type={"paid"}/>
                      </div>
                  </div>               
               </div>

               <div className="flex flex-col items-center justify-start text-start  w-[500px]  mt-6">
                  <div className="flex items-start justify-start text-start w-full">
                     <p className="text-zinc-600 font-bold text-md">Gastos</p>
                  </div>
                  <div className="flex items-center justify-between text-start  mt-2  w-full">
                      <div className="flex flex-col">
                        <p className="text-zinc-600 font-medium text-sm  mt-1">Todos los Gastos</p>
                        <p className="text-zinc-600 font-medium text-sm  mt-1">Compras</p>
                        <p className="text-zinc-600 font-medium text-sm  mt-1">Gastos Fijos</p>
                        <p className="text-zinc-600 font-medium text-sm  mt-1">Sub Alquileres</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm text-zinc-600  mt-1">  {formatePrice(filteredExpensesTotalAmount)}</p>
                        <p className="font-medium text-sm text-zinc-600  mt-1"> {formatePrice(filteredPurchasesTotalAmount)}</p>
                        <p className="font-medium text-sm text-zinc-600  mt-1"> {formatePrice(filteredFixedTotalAmount)}</p>
                        <p className="font-medium text-sm text-zinc-600  mt-1"> {formatePrice(filteredSubletsTotalAmount)}</p>
                      </div>
                      <div>
                       <ExpensesDetail expensesData={justAllExpenses} first={firstDateToShow} second={secondDateToShow} type={"all"}/>
                       <ExpensesDetail expensesData={justPurchases} first={firstDateToShow} second={secondDateToShow}  type={"purchases"}/>
                       <ExpensesDetail expensesData={justFixedExpenses} first={firstDateToShow} second={secondDateToShow}  type={"fixed"}/>
                       <ExpensesDetail expensesData={justFixedExpenses} first={firstDateToShow} second={secondDateToShow}  type={"fixed"}/>
                      </div>
                  </div>               
               </div>

               
               <div className="flex flex-col items-center justify-start text-start  w-[500px]  mt-6">
                  <div className="flex items-start justify-start text-start w-full">
                     <p className="text-zinc-600 font-bold text-md">Cobros</p>
                  </div>
                  <div className="flex items-center justify-between text-start  mt-2  w-full">
                      <div className="flex flex-col">
                        <p className="text-zinc-600 font-medium text-sm">Todos los Cobros</p>                   
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm text-zinc-600"> {formatePrice(collectionsTotalAmount)}</p>     
                      </div>
                      <div>
                             <CollectionsDetail 
                              byAccount={collectionsAgroupByAccount} 
                              byType={collectionsAgroupByType} 
                              allCollections={filteredCollectionsObtained}
                              frist={firstDateToShow}
                              second={secondDateToShow}/>
                      </div>
                  </div>               
               </div>

               <div className="flex flex-col items-center justify-start text-start  w-[500px]  mt-6">
                  <div className="flex items-start justify-start text-start w-full">
                     <p className="text-zinc-600 font-bold text-md">Empleados</p>
                  </div>
                  <div className="flex items-center justify-between text-start  mt-2  w-full">
                      <div className="flex flex-col">
                        <p className="text-zinc-600 font-medium text-sm">Liquidacion Empleados:</p>                   
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm text-zinc-600"> {formatePrice(justEmployeesData.reduce((acc, el) => acc + el.totalAmountToPaid, 0))}</p>     
                      </div>
                      <div>
                        <EmployeesLiquidation empployeesData={justEmployeesData} first={firstDateToShow}second={secondDateToShow}/>
                      </div>
                  </div>               
               </div>

              </div>
               
                <div className="flex flex-col items-cente mt-6">
                         
                        <div className='flex flex-col items-center justify-center '>
                            <div className='flex flex-col w-96 max-h-[300px] overflow-y-auto mt-2 border rounded-lg shadow-lg'>
                                <div className='w-full bg-green-800'>
                                  <p className='text-sm font-bold text-white'>Resumen Cierre</p>
                                </div>
                                <div className='flex flex-col items.start text-start justify-start mt-4'>
                                    <p className="text-zinc-600 text-md"><b>Total Cobrado en Alquileres:</b>  {formatePrice(filteredPaidOrdersTotalAmount)}</p>
                                    <p  className="text-zinc-600 text-md"><b>Monto total Gastado:</b> {formatePrice(filteredExpensesTotalAmount + justEmployeesData.reduce((acc, el) => acc + el.totalAmountToPaid, 0))}</p>
                                    <p  className="text-zinc-600 text-md"><b>Monto total Gastado en Compras:</b> {formatePrice(filteredPurchasesTotalAmount)}</p>
                                    <p  className="text-zinc-600 text-md"><b>Monto total Gastado en Sub Alquileres:</b> {formatePrice(filteredSubletsTotalAmount)}</p>
                                    <p  className="text-zinc-600 text-md"><b>Gasto total en Empleados:</b> {formatePrice(justEmployeesData.reduce((acc, el) => acc + el.totalAmountToPaid, 0))}</p>
                                    <p  className="text-zinc-600 text-md"><b>Gasto total en Gastos Fijos:</b> {formatePrice(filteredFixedTotalAmount)}</p>
                                    <p  className="text-zinc-600 text-md"><b>Ganancia Neta:</b> {formatePrice(filteredPaidOrdersTotalAmount - (filteredExpensesTotalAmount + justEmployeesData.reduce((acc, el) => acc + el.totalAmountToPaid, 0)))}</p>
                                </div>                      
                             </div>
                          </div>  
                </div>  
            
              </div>

          </>
            :
            null
          }

    </div>
  )
}

export default PersonalizedClousure

