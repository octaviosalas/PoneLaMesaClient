import React, {useEffect, useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import { months, everyYears } from "../../functions/gralFunctions";
import {Select, SelectItem} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getEveryExpenses, getEveryCollections } from "../../functions/gralFunctions";
import Loading from "../Loading/Loading";
import ButtonComponent from "./ButtonComponent";

const ChooseDateClousures = () =>  {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [size, setSize] = useState("3xl")
  const [yearSelected, setYearSelected] = useState("");
  const [monthSelected, setMonthSelected] = useState("")
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
  const [maximizeModal, setMaximizeModal] = useState(false)

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
       
       const getPurchases = transform.filter((tr) => tr.collectionType === "Compra")
       const getSublets = transform.filter((tr) => tr.collectionType === "Sub Alquiler")
       const getFixedExpenses = transform.filter((tr) => tr.collectionType === "Gasto Fijo")
       setJustPurchases(getPurchases)
       setJustSublets(getSublets)
       setJustFixedExpenses(getFixedExpenses)
       setJustAllExpenses(transform)
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
      const paidOrders = transform.filter((tr) => tr.paid === "true")
      const noPaidOrders = transform.filter((tr) => tr.paid === "false")
      setJustPaidOrder(paidOrders)
      setJustNoPaidOrder(noPaidOrders)
      setJustAllOrders(transform)
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
 

/*   const getResultsAboutClousure = async (filteredOrdersObtained, filtredExpensesObtained, filteredCollectionsObtained, filteredShiftsObtained) => { 
    agroupExpensesByType(filtredExpensesObtained)
    agroupOrderByPaidOrNoPaid(filteredOrdersObtained)
    agroupCollectionByAccount(filteredCollectionsObtained)
    agroupCollectionByType(filteredCollectionsObtained)
    getEmployeesShiftsDataAmount(filteredShiftsObtained)
   }*/

  
//  <Button className="bg-green-800 text-white font-medium text-sm w-72" onClick={() => getResultsAboutClousure(filteredOrdersObtained, filtredExpensesObtained, filteredCollectionsObtained, filteredShiftsObtained)}>
  
   const goTo = () => { 
    navigate("/Cierre/Personalizado")
    console.log("a")
   }  

  return (
    <>
     
        <Card className="w-auto h-full cursor-pointer" onClick={() => console.log("a")}>
              <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-black uppercase font-bold">Cierre Filtrado por Fechas</p>
              </CardHeader>
              <Image
                onClick={() => goTo()}
                removeWrapper
                alt="Card background"
                className="z-0 w-[400px] h-[400px] object-cover"
                src="https://static.comunicae.com/photos/notas/1176175/1486038779_Gestion_de_proyectos_1_.jpg"
              />
          </Card>

    </>
  );
}

export default ChooseDateClousures