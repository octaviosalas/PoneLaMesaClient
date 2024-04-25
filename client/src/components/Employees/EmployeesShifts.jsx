import React, {useState, useEffect} from 'react'
import NavBarComponent from '../Navbar/Navbar'
import {Input, Select, SelectItem, Button} from "@nextui-org/react";
import {everyMonthsOfTheYear, everyYears, formatePrice, resumeDecimalNum} from "../../functions/gralFunctions"
import axios from 'axios';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import {Card} from "@tremor/react"
import ModalCardEmployeesShifts from './ModalCardEmployeesShifts';


    const EmployeesShifts = () => {
 
      const [daySelected, setDaySelected] = useState(0)
      const [months, setMonths] = useState(everyMonthsOfTheYear)
      const [monthSelected, setMonthSelected] = useState("")
      const [years, setYears] = useState(everyYears)
      const [yearSelected, setYearSelected] = useState("")
      const [missedData, setMissedData] = useState(false)
      const [shiftsPerformed, setShiftsPerformed] = useState([])
      const [withOutShiftsPerformed, setWithOutShiftsPerformed] = useState(false)
      const [replacementsPerformed, setReplacementsPerformed] = useState([])
      const [withOutReplacementsPerformed, setWithOutReplacementsPerformed] = useState(false)
      const [showTableData, setShowTableData] = useState(false)
      const [shiftsTotalHours, setShiftsTotalHours] = useState(0)
      const [responseDataEstadisticsOperatives, setResponseDataEstadisticsOperatives] = useState("")
      const [coastCleaningEmployees, setCoastCleaningEmployees] = useState(0)
      const [coastByArticle, setCoastByArticle] = useState([])
      const [firstTableData, setFirstTableData] = useState([])
      const [columns, setColumns] = useState([])
      const [operativeColumns, setOperativeColumns] = useState([])
      const [showTable, setShowTable] = useState(false)
      const [showOperativeTable, setShowOperativeTable] = useState(false)
      const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
      const [articlesAgroupedQuantityGains, setArticlesAgroupedQuantityGains] = useState(0)
      const [operativeDataFinished, setOperativeDataFinished] = useState([])
      const [showTheLastTable, setShowTheLastTable] = useState(false)
      const [showDateInputs, setShowDateInputs] = useState(true)
      const [operativeValueMorningShiftForCard, setOperativeValueMorningShiftForCard] = useState(0)
      const [operativeValueEveningShiftForCard, setOperativeValueEveningShiftForCard] = useState(0)
      const [employeesMorningDataForModal, setEmployeesMorningDataForModal] = useState([])
      const [employeesEveningDataForModal, setEmployeesEveningDataForModal] = useState([])



      const agroupShiftsByEmployeeName = (shifts) => { 
        const agroup = shifts.reduce((acc, el) => { 
          const employeeName = el.employeeName
          if(acc[employeeName]) { 
            acc[employeeName].push(el)
          } else { 
            acc[employeeName] = [el]
          }
          return acc
        }, {})
         const transformData = Object.entries(agroup).map(([employeeName, data]) => { 
          return { 
            employeeName: employeeName,
            totalAmountToPaid: data.map((d) => d.totalAmountPaidShift)[0]
          }
        })
        const quantityEmployees = transformData.length
        const getTotalAmount = transformData.reduce((acc, el) => acc + el.totalAmountToPaid, 0)
        return {
          getTotalAmount,
          quantityEmployees
        }
      }

      const agroupShiftsByTime = (shifts, replenishments) => { 

        console.log(replenishments)
        console.log(shifts)
        const justDetails = replenishments.map((rep) => rep.replenishDetail).flat()
        const agroupByName = justDetails.reduce((acc, el) => { 
          const productName = el.productName
          if(acc[productName]) { 
            acc[productName].push(el)
          } else { 
            acc[productName] = [el]
          }
          return acc
        }, {})
        const transformDataToGetValue = Object.entries(agroupByName).map(([productName, data]) => { 
            const price = data.map((d) => d.productPrice)[0]
            const quantityArticles = data.map((d) => d.quantity)[0]
           return { 
            productName: productName,
            price: price,
            quantityProducts: quantityArticles,
            totalAmountFacturedByArticle: price * quantityArticles
           }
        })
       console.log(transformDataToGetValue)
       const getTotal = transformDataToGetValue.reduce((acc, el) => acc + el.totalAmountFacturedByArticle, 0)
       console.log(getTotal)
       setArticlesAgroupedQuantityGains(getTotal)
      
        const agroupThem = shifts.reduce((acc, el) => { 
          const time = el.shift;
          if(acc[time]) { 
            acc[time].push(el)
          } else { 
            acc[time] = [el]
          }
          return acc
        }, {})
        const getMorning = replenishments.filter((rep) => rep.shift === "Mañana").map((dd) => dd.replenishDetail).flat()
        const getEvening = replenishments.filter((rep) => rep.shift === "Tarde").map((dd) => dd.replenishDetail).flat()
        const getFinalData = Object.entries(agroupThem).map(([time, data]) => { 
          const employee = data.map((ee) => { 
            return  { 
              name: ee.employeeName,
              amountHour: ee.hourAmountPaid,
              totalAmount: ee.totalAmountPaidShift,
              workedHours: ee.hours
            }
          })
          return  { 
            time: time,
            totalHours: data.reduce((acc, el) => acc + el.hours, 0),
            totalAmountEmployeesShifts: employee.reduce((acc, el) => acc + el.totalAmount, 0),
            employeesData: employee,
            detail: time === "Mañana" ? getMorning : time === "Tarde" ? getEvening : null
          }
        })
        const transformFinalData = getFinalData.map((tr) => { 

          const cantidadTotalDeArticulosLavadosEnElTurno =  tr.detail.reduce((acc, el) => acc + el.quantity, 0)
          const totalAPagarEmpleados = tr.totalAmountEmployeesShifts

          const soloMañana = getFinalData.filter((f) => f.time === "Mañana")
          const cantidadDeVecesMañana = soloMañana.map((d) => d.detail).flat().length
          console.log(cantidadDeVecesMañana)
          const soloTarde = getFinalData.filter((f) => f.time === "Tarde")
          const cantidadDeVecesTarde = soloTarde.map((d) => d.detail).flat().length
          console.log(cantidadDeVecesMañana)

          const cantidadTotalMañana =  soloMañana.map((final) => final.detail).flat().reduce((acc, el) => acc + el.quantity, 0)
          const cantidadTotalTarde = soloTarde.map((final) => final.detail).flat().reduce((acc, el) => acc + el.quantity, 0)

         
          const cantidadCorrecta = tr.time === "Mañana" ? cantidadTotalMañana : cantidadTotalTarde; 
          const numeroADividirMontoEmpleado = tr.time === "Mañana" ? cantidadDeVecesMañana : cantidadDeVecesTarde
          const porcentajeArticuloEnTotal =  tr.time === "Mañana" ? cantidadTotalDeArticulosLavadosEnElTurno/cantidadTotalMañana : cantidadTotalDeArticulosLavadosEnElTurno/cantidadTotalTarde
        
           return { 
              turno: tr.time,
              horasTotales: tr.totalHours,
              montoTotalAPagarEnEsteTurno: totalAPagarEmpleados,
              empleados: tr.employeesData,
              cantidadTotalDeArticulosLavadosEnElDia: cantidadTotalDeArticulosLavadosEnElTurno,
             
              articulos: tr.detail.map((tt) => { 
                return { 
                  nombre: tt.productName,
                  id: tt.productId,
                  cantidadLavada: tt.quantity,
                  tiempoIdeal: tt.quantity * tt.estimatedWashTime,
                  porcentajeDelArticuloLavadoEnBaseAlTotal: porcentajeArticuloEnTotal,
                  costoLavadoArticulo: totalAPagarEmpleados * ( tt.quantity/cantidadCorrecta) / tt.quantity,
                  turno: tr.time,
                  empleados: tr.employeesData.length,
                  horasDelTurno: tr.totalHours,
                  costoDelTurnoEnEmpleados:  formatePrice(tr.totalAmountEmployeesShifts/numeroADividirMontoEmpleado),
                }
              }),
           
           }
        })
        if(transformFinalData.length > 0) { 
          console.log("TRANSFORM FINAL DATA", transformFinalData)
          const getJustMorningEmployees = transformFinalData.filter((employee) => employee.turno === "Mañana")
          const getJustEveningEmployees = transformFinalData.filter((employee) => employee.turno === "Tarde")
          setFirstTableData(transformFinalData)
          createTable(transformFinalData)
          createOperativeData(transformFinalData)
          setEmployeesMorningDataForModal(getJustMorningEmployees)
          setEmployeesEveningDataForModal(getJustEveningEmployees)
        }
        return transformFinalData
      }

      const agroupReplacementsByArticles = (items) => { 
        console.log("Mirame aca", items)
        const agroupThem = items.reduce((acc, el) => { 
          const article = el.productName;
          if(acc[article]) { 
            acc[article].push(el)
          } else { 
            acc[article] = [el]
          }
          return acc
        }, {})
        const getFinalData = Object.entries(agroupThem).map(([article, data]) => { 
          const estimatedTime = data.map((dat) => dat.estimatedWashTime)[0];
          const quantity = data.map((d) => d.quantity)[0];
          return  { 
            article: article,
            totalQuantityReplaced: data.map((d) => d.quantity)[0],
            quantity: quantity,
            assumedWashTime: quantity * estimatedTime
          }
        })

        const totalEstimatedWashTime = getFinalData.reduce((sum, item) => sum + item.assumedWashTime, 0);



        return { 
          getFinalData,
          totalEstimatedWashTime 
        }
      };

      const getAverage = async (quantityEmployees, totalAmountToPaid, details, totalMinutes) => {
        console.log("Cantidad de Empleados", quantityEmployees) 
        console.log("Casto total del dia en turnos en empleados", totalAmountToPaid) 
        console.log("Detalle de los Productos Lavados", details) 
        console.log("Cantidad total de Minutos trabajados en los turnos", totalMinutes) 
        const workedHours = totalMinutes / 60 
        const detailsOfDetails = await details.getFinalData
        const average =  totalAmountToPaid / quantityEmployees
        console.log("AVERAGE", average)
        const minutesPerAverage = workedHours * average
        console.log("MINUTES PER AVERAGE", minutesPerAverage)
        const getAccount = detailsOfDetails.map((det) => { 
          return { 
            article: det.article,
            quantityArticles: det.quantity,
            coastCleanArticle: totalAmountToPaid / det.quantity
          }
        })
        console.log("COSTO POR ARTICULO LAVADO", getAccount)
        setCoastByArticle(getAccount)
        return getAccount
      } 

      const getShifts = async () => { 
      const dayReseted = Number(daySelected)
      if (monthSelected.length > 0 && yearSelected > 0 && daySelected > 0) { 
          try {
              const { data: responseShifts, status: shiftsStatus } = await axios.get(`http://localhost:4000/employees/getShifsByMonth/${monthSelected}`)
              const filterData = responseShifts.filter((res) => res.day === dayReseted && res.year === yearSelected)  // filtro los turnos por fecha     
              const totalCashToPaidToEmployees = filterData.reduce((acc, el) => acc + el.totalAmountPaidShift, 0) // sumo los totales a pagar para saber el gasto en empleados del dia
             // console.log("MONTO REAL PARA PAGARLE A LOS EMPLEADOS", totalCashToPaidToEmployees) // muestro por consola el monto total a pagar a empleados
              const result = agroupShiftsByEmployeeName(filterData);
              const quantityEmployees = result.quantityEmployees // La funcion que me agrupa a los empleados, me devuelve la cantidad total de empleados
     
              setCoastCleaningEmployees(totalCashToPaidToEmployees) 
                let getTotalHours = 0;
                let getTotalMinutes = 0;
                if(filterData.length > 0) { 
                  setShiftsPerformed(filterData) 
                  setWithOutShiftsPerformed(false) 
                  getTotalHours = filterData.reduce((acc, el) => acc + el.hours, 0);
                  getTotalMinutes = filterData.reduce((acc, el) => acc + el.minutes, 0);
                  const totalHoursFromMinutes = Math.floor(getTotalMinutes / 60);
                  console.log(totalHoursFromMinutes)
                  getTotalHours += totalHoursFromMinutes;
                } else { 
                  setWithOutShiftsPerformed(true)
                }
               
              if (shiftsStatus === 200) { 
                  const { data: responseReplenishment } = await axios.get(`http://localhost:4000/replenishment/${monthSelected}`)// consulto reposiciones
                  const filterDataReplenishment = responseReplenishment.filter((res) => res.day === dayReseted && res.year === yearSelected)// filtro reposiciones por fecha
                  if(filterDataReplenishment.length > 0) { 
                    setWithOutReplacementsPerformed(false)
                    setReplacementsPerformed(filterDataReplenishment) // seteo al estado ReplacementsPerformed por todas las reposiciones
                      console.log("TURNOS AGRUPADOS POR HORARIO, EMPLEADOS  PRODUCTOS, CANTIDADES, TIEMPO", agroupShiftsByTime(filterData, filterDataReplenishment)) //Le paso a la funcion agroupShiftsByTime los turnos y las reposiciones, para que agrupe todo en un array
                      const getJustDetails = filterDataReplenishment.map((filt) => filt.replenishDetail).flat() //Uno todos los articulos repuestos
                      const transformShiftsHoursToMinutes = 60 * getTotalHours; 
                      const result = agroupReplacementsByArticles(getJustDetails);
                      setShowTableData(true)
                      setResponseDataEstadisticsOperatives(`Segun los articulos lavados y las horas de turnos realizadas, se deberian haber lavado los articulos en un tiempo de ${result.totalEstimatedWashTime} minutos y la carga horaria total entre todos los empleados fue de  ${transformShiftsHoursToMinutes} minutos`)
                      getAverage(quantityEmployees, totalCashToPaidToEmployees, agroupReplacementsByArticles(getJustDetails), transformShiftsHoursToMinutes)
                      setShowTheLastTable(true)
                      setShowDateInputs(false)
                  } else { 
                    setWithOutReplacementsPerformed(true)
                    setShowTableData(false)

                  }
              }
          } catch (error) {
              console.error("Error al obtener los datos:", error.message)
          }
      } else { 
          console.log("a")
          setMissedData(true)
          setDaySelected(0)
          setYearSelected(0)
          setMonthSelected("")
          setTimeout(() => { 
              setMissedData(false)
          }, 1500)
      }
      }    
 
      const createTable = (firstTableData) => { 
        console.log("MIRAME ACA LA FIRST TABLE DATA", firstTableData)
        
         const articles = firstTableData.map((f) => f.articulos).flat()
         console.log(articles)
         const properties = Object.keys(articles[0]);
         console.log("Propiedad", properties)
         if(articles.length > 0 ) { 
          console.log(articles)
          const firstDetail = articles[0];
          const properties = Object.keys(firstDetail);
          const filteredProperties = properties.filter(property => property !== 'id' && property !== 'tiempoIdeal' && property !== 'porcentajeDelArticuloLavadoEnBaseAlTotal');
        
          const columnLabelsMap = {
            turno: 'Turno',
            nombre: 'Articulo',
            horasDelTurno: 'Cantidad de Horas',
            costoDelTurnoEnEmpleados: 'Gasto Empleados',
          };
        
          const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));
     
          setColumns(tableColumns);
          console.log(tableColumns);
          setShowTable(true)  
         } else { 
          console.log("First table length 0!")
         }
          
      }

      const createOperativeData = (data) => { 

        const getState = (first, second) => { 
          if(first > second) { 
            return false
          } else { 
            return true
          }
        }

        console.log(data)
          const createTheResult = data.map((dd) => { 
            const getTotalTime = data.map((d) => d.articulos).flat()
            const getMorning = getTotalTime.filter((fil) => fil.turno === "Mañana")
            const getEvening =  getTotalTime.filter((fil) => fil.turno === "Tarde")
            const totalMinutessMornignShift = dd.horasTotales * 60
            const totalMinutesEveningShift =  dd.horasTotales * 60
            const cantidadTotalLavada = dd.articulos.map((art) => art.cantidadLavada).reduce((acc, el) => acc + el, 0)
             return { 
                turno: dd.turno,   
                cantidadTotalLavada: cantidadTotalLavada,          
                tiempoIdealTotal: dd.turno === "Mañana" ? getMorning.reduce((acc, el) => acc + el.tiempoIdeal, 0) :  getEvening.reduce((acc, el) => acc + el.tiempoIdeal, 0),
                horasTotalDelTurno: dd.horasTotales * 60,
                estado: dd.turno === "Mañana" ? getState(totalMinutessMornignShift, getMorning.reduce((acc, el) => acc + el.tiempoIdeal, 0)) : getState(totalMinutesEveningShift,  getEvening.reduce((acc, el) => acc + el.tiempoIdeal, 0)),
               
             }
          }) 
          console.log(createTheResult)
         
          const turnoMañana = createTheResult.filter((cr) => cr.turno === "Mañana").map((shiftData) => shiftData.tiempoIdealTotal - shiftData.horasTotalDelTurno);
          const turnoTarde = createTheResult.filter((cr) => cr.turno === "Tarde").map((shiftData) => shiftData.tiempoIdealTotal - shiftData.horasTotalDelTurno);
          console.log(turnoTarde)
          console.log(turnoMañana)

          setOperativeValueEveningShiftForCard(turnoTarde[0])
          setOperativeValueMorningShiftForCard(turnoMañana[0])
          console.log(turnoMañana, turnoTarde)
          if(createTheResult.length > 0) { 
            setOperativeDataFinished(createTheResult)
            console.log("Setee al estado de la tabla operativa por", createTheResult)
          } else { 
            console.log("No llegue a setear el estado")

          }
          createOperativeTable(createTheResult)

          return createTheResult
      }

      const createOperativeTable = (operativeData) => { 
        console.log("OPERATIVE DATA TABLA", operativeData)
         const properties = Object.keys(operativeData[0]);
         console.log("Propiedad", properties)
         if(operativeData.length > 0 ) { 
          const firstDetail = operativeData[0];
          const properties = Object.keys(firstDetail);
          const filteredProperties = properties.filter(property => property !== 'id' && property !== 'tiempoIdeal' && property !== 'porcentajeDelArticuloLavadoEnBaseAlTotal');
          console.log(properties)
          const columnLabelsMap = {
            turno: 'Turno',
            cantidadTotalLavada: 'Articulos Lavados',
            horasTotalDelTurno: 'Tiempo Realizado',
            tiempoIdealTotal: 'Tiempo ideal',
          };
        
          const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));

        
          setOperativeColumns(tableColumns);
          console.log(tableColumns);
          setShowOperativeTable(true)  
         } else { 
          console.log("First table length 0!")
         }
      }

     const chooseOtherDate = () => {
      setShowDateInputs(true)
      setShowTable(false)
      setShowTableData(false)
      setShowTheLastTable(false)
      setShowOperativeTable(false)
     }
      

     useEffect(() => { 
      console.log(operativeValueMorningShiftForCard)
      console.log(operativeValueEveningShiftForCard)

     }, [operativeValueMorningShiftForCard, operativeValueEveningShiftForCard])
   

    

  return (
    <div>
         <NavBarComponent/>

         <div>
              
         </div>

        {showDateInputs ? 
         <div className='flex flex-col items-center justify-center rounded-lg w-full '>

            <Input type="number" variant="bordered" className='w-96 mt-2' label="Dia" onChange={(e) => setDaySelected(e.target.value)}/>

            <Select variant={"faded"} label="Selecciona un Mes" className="w-96 mt-2" value={monthSelected}>          
              {months.map((month) => (
                <SelectItem key={month.value} value={month.label} textValue={month.value} onClick={() => setMonthSelected(month.value)}>
                  {month.label}
                </SelectItem>
                ))}
            </Select>

            <Select variant={"faded"} label="Selecciona un Año" className="w-96 mt-2" value={yearSelected}>          
                {years.map((year) => (
                <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                  {year.label}
                </SelectItem>
                ))}
            </Select>

            <Button className='bg-green-800 text-white font-medium text-sm w-96 mt-4' onClick={() => getShifts()}>Buscar</Button>

         </div> : null}

         <div className='mt-2 flex items-center jsutify-center'>
                {(withOutReplacementsPerformed && !withOutShiftsPerformed) ? (
                    <p>No hubo reposiciones asignada a turnos de la fecha elegida</p>
                ) : (
                    withOutShiftsPerformed && !withOutReplacementsPerformed ? (
                      <p>No hubo Turnos realizados en la fecha elegida</p>
                    ) : (
                      withOutReplacementsPerformed && withOutShiftsPerformed ? (
                        <p>No hubo Turnos realizados ni reposiciones asentadas en la fecha elegida</p>
                      ) : null
                    )
                )}
            </div>
            {showTableData ?
            <>
                <div className='flex flex-col text-start justify-start items-start border shadow-xl'>
                    
                </div> 
               
                {showTable ? 
                <>
                <div className='flex flex-col items-start justify-start mt-12'>
                 
                  <div className='flex gap-4 items-center justify-center'>
                    <div className='flex flex-col'>
                        <div className='flex justify-start items-start ml-2'>
                          <p className='text-zinc-600 font-medium text-sm'>Informacion Financiera del dia: </p>
                        </div>   
                            <Card className="mx-auto h-auto w-[750px] 2xl:w-full mt-1" decoration="top"  decorationColor="green-800" >                   
                                <div className='flex gap-8 items-center mt-4'>
                                  <div className='flex flex-col items-center justify-enter'>
                                      <p className='text-zinc-500 text-xs font-medium'>Total Gastado en Empleados:</p>
                                      <p className='font-medium text-xl text-black'>{formatePrice(coastCleaningEmployees)}</p>
                                  </div>
                                  <div className='flex flex-col items-center justify-enter'>
                                      <p className='text-zinc-500 text-xs font-medium'>Total Facturado por estos Articulos:</p>
                                      <p className='font-medium text-xl text-black'>{formatePrice(articlesAgroupedQuantityGains)}</p>
                                  </div>
                                    <div className='flex flex-col items-center justify-enter'>
                                        <p className='text-zinc-500 text-xs font-medium'>Rentabilidad del Dia:</p>
                                        <p className='font-medium text-xl text-black'>{formatePrice(articlesAgroupedQuantityGains - coastCleaningEmployees)}</p>
                                    </div>
                                </div>
                          </Card>
                    </div>
                    <div  className='flex flex-col'>
                        <div className='flex justify-start items-start ml-2'>
                          <p className='text-zinc-600 font-medium text-sm'>Informacion operativa del dia: </p>
                        </div>
                        <Card className="mx-auto h-auto w-[750px] 2xl:w-full mt-1" decoration="top"  decorationColor="green-800" >                   
                        <div className='flex  gap-28  items-center mt-4'>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Turno Mañana Efectividad:</p>
                              <p className={operativeValueMorningShiftForCard >= 0 ? 'font-medium text-xl text-black' : "font-medium text-xl text-red-600"}>
                                {resumeDecimalNum(operativeValueMorningShiftForCard)} <span className='text-xs font-medium text-zinc-600'>min</span>
                                <ModalCardEmployeesShifts data={employeesMorningDataForModal}/>
                             </p>
                             
                          </div>
                          <div className='flex flex-col items-center justify-enter'>
                              <p className='text-zinc-500 text-xs font-medium'>Turno Tarde Efectividad:</p>
                              <p className={operativeValueEveningShiftForCard >= 0 ? 'font-medium text-xl text-black' : "font-medium text-xl text-red-600"}>
                                  {resumeDecimalNum(operativeValueEveningShiftForCard)} <span className='text-xs font-medium text-zinc-600'>min</span>
                                  <ModalCardEmployeesShifts data={employeesEveningDataForModal}/>
                              </p>
                          </div>                         
                        </div>
                      </Card>
                    </div>
                     
                      
                    
                  </div>
                    
                </div>
                  <div className='flex justify-start items-start mt-8 ml-2'>
                    <p className='text-zinc-600 font-medium text-sm'>Estadistica financiera:</p>
                  </div>
                 <Table                          
                    columnAutoWidth={true} 
                    columnSpacing={10}  
                    aria-label="Selection behavior table example with dynamic content"   
                    selectionBehavior={selectionBehavior} 
                    className="w-full flex items-center justify-center shadow-2xl overflow-y-auto xl:max-h-[350px] 2xl:max-h-[450px]  border rounded-xl">
                        <TableHeader columns={columns}>
                  {(column) => (
                  <TableColumn key={column.key} className="text-xs gap-6">
                    {column.label}
                  </TableColumn>
                      )}
                  </TableHeader>
                    <TableBody items={firstTableData.map((f) => f.articulos).flat()}>
                                  {(item) => (
                    <TableRow key={item.nombre}>
                        {columns.map(column => (
                        <TableCell key={column.key}  className='text-left' >
                            {column.cellRenderer ? (
                            column.cellRenderer({ row: { original: item } })
                            ) : (
                            (column.key === "costoLavadoArticulo") ? (
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
            </Table>
                </> : null}

            </>
              : null}


              {showTheLastTable ? 
              <>
                   <div className='flex justify-start items-start mt-8 ml-2'>
                    <p className='text-zinc-600 font-medium text-sm'>Estadistica Operativa:</p>
                  </div>
                <Table                          
                  columnAutoWidth={true} 
                  columnSpacing={10}  
                  aria-label="Selection behavior table example with dynamic content"   
                  selectionBehavior={selectionBehavior} 
                  className="w-full flex items-center justify-center shadow-2xl overflow-y-auto xl:max-h-[350px] 2xl:max-h-[450px] border rounded-xl mt-2">
                      <TableHeader columns={operativeColumns}>
                {(column) => (
                <TableColumn key={column.key} className="text-xs gap-6">
                  {column.label}
                </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={operativeDataFinished}>
                    {(item) => (
                        <TableRow key={item.turno}>
                          {operativeColumns.map(column => (
                            <TableCell key={column.key} className='text-left'>
                              {column.cellRenderer ? (
                                column.cellRenderer({ row: { original: item } })
                              ) : (
                                column.key === "estado" ? (
                                  item[column.key] ? "En tiempo" : "Atrasado"
                                ) : (
                                  column.key === "costoLavadoArticulo" ? (
                                    formatePrice(item[column.key])
                                  ) : (
                                    item[column.key]
                                  )
                                )
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                    )}
                    </TableBody>
                  </Table>

                  <div className='flex items-center justify-center mt-6 mb-2'>
                        <Button className='bg-green-800 text-white font-medium text-sm w-96' onClick={() => chooseOtherDate()}>Elegir otra fecha</Button>
                  </div>
              </>
                
              : null}

              
    </div>
    
  )
}

export default EmployeesShifts
