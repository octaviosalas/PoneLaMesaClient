import React, {useState, useEffect} from 'react'
import NavBarComponent from '../Navbar/Navbar'
import {Input, Select, SelectItem, Button} from "@nextui-org/react";
import {everyMonthsOfTheYear, everyYears, formatePrice} from "../../functions/gralFunctions"
import axios from 'axios';

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
    
      const agroupShiftsByEmployeeName = (shifts) => { 
        console.log("AGROUOPBYEMPLOYEES", shifts)
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
        console.log("ACA", getTotalAmount)
        return {
          getTotalAmount,
          quantityEmployees
        }
      }

      const agroupShiftsByTime = (shifts) => { 
        console.log(shifts)
        const agroupThem = shifts.reduce((acc, el) => { 
          const time = el.shift;
          if(acc[time]) { 
            acc[time].push(el)
          } else { 
            acc[time] = [el]
          }
          return acc
        }, {})
        const getFinalData = Object.entries(agroupThem).map(([time, data]) => { 
          const estimatedTime = data.map((dat) => dat.estimatedWashTime)[0];
          const quantity = data.map((d) => d.quantity)[0];
          return  { 
            time: time,
            totalHours: data.reduce((acc, el) => acc + el.hours, 0)
          }
        })
        return getFinalData
      }

      const agroupReplacementsByArticles = (items) => { 
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
              const filterData = responseShifts.filter((res) => res.day === dayReseted && res.year === yearSelected)       
              console.log(`Turnos realizados el dia ${daySelected} de ${monthSelected}`, filterData)
              console.log("Turnos agrupados por horario", agroupShiftsByTime(filterData))
              console.log("Turnos agrupados por empleado", agroupShiftsByEmployeeName(filterData))
              const totalCashToPaidToEmployees = filterData.reduce((acc, el) => acc + el.totalAmountPaidShift, 0)
              console.log("MONTO REAL PARA PAGARLE A LOS EMPLEADOS", totalCashToPaidToEmployees)
              const result = agroupShiftsByEmployeeName(filterData);
              const quantityEmployees = result.quantityEmployees
              console.log("CANTIDAD DE EMPLEADOS", quantityEmployees)
              setCoastCleaningEmployees(totalCashToPaidToEmployees)
                let getTotalHours = 0;
                let getTotalMinutes = 0;
                if(filterData.length > 0) { 
                  setShiftsPerformed(filterData)
                  setWithOutShiftsPerformed(false)
                  getTotalHours = filterData.reduce((acc, el) => acc + el.hours, 0);
                  getTotalMinutes = filterData.reduce((acc, el) => acc + el.minutes, 0);
                  console.log("Total de Horas realizadas este dia", getTotalHours)
                  console.log("Total de Minutos realizadas este dia", getTotalMinutes)
                  const totalHoursFromMinutes = Math.floor(getTotalMinutes / 60);
                  console.log(totalHoursFromMinutes)
                  getTotalHours += totalHoursFromMinutes;
                } else { 
                  setWithOutShiftsPerformed(true)
                }
               
              if (shiftsStatus === 200) { 
                  const { data: responseReplenishment } = await axios.get(`http://localhost:4000/replenishment/${monthSelected}`)
                  const filterDataReplenishment = responseReplenishment.filter((res) => res.day === dayReseted && res.year === yearSelected)       
                  console.log(`Reposiciones realizadas el dia ${daySelected} de ${monthSelected}`, filterDataReplenishment)
                  if(filterDataReplenishment.length > 0) { 
                    setWithOutReplacementsPerformed(false)
                    setReplacementsPerformed(filterDataReplenishment)
                      const getJustDetails = filterDataReplenishment.map((filt) => filt.replenishDetail).flat()
                      console.log(agroupReplacementsByArticles(getJustDetails))
                      const transformShiftsHoursToMinutes = 60 * getTotalHours; 
                      console.log("Horas del turno transformadas a minutos", transformShiftsHoursToMinutes)
                      const result = agroupReplacementsByArticles(getJustDetails);
                      console.log(result.getFinalData)
                      console.log(`Segun los articulos lavados y las horas de turnos realizadas, se deberian haber lavado los articulos en un tiempo de ${result.totalEstimatedWashTime} minutos y la carga horaria total entre todos los empleados fue de  ${transformShiftsHoursToMinutes} minutos`)
                      setShowTableData(true)
                      setResponseDataEstadisticsOperatives(`Segun los articulos lavados y las horas de turnos realizadas, se deberian haber lavado los articulos en un tiempo de ${result.totalEstimatedWashTime} minutos y la carga horaria total entre todos los empleados fue de  ${transformShiftsHoursToMinutes} minutos`)
                      console.log(getAverage(quantityEmployees, totalCashToPaidToEmployees, agroupReplacementsByArticles(getJustDetails), transformShiftsHoursToMinutes))
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
 
      useEffect(() => {
       console.log(coastByArticle)
      }, [coastByArticle])
    

  return (
    <div>
         <NavBarComponent/>
         <div className='flex flex-col items-center justify-center rounded-lg w-full border'>
            <Input type="number" variant="underlined" className='w-96 mt-2' label="Dia" onChange={(e) => setDaySelected(e.target.value)}/>

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
         </div>
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
                  <h5 className='text-md text-zinc-700 font-medium'>Estadistica Operativa: </h5>
                  <div className='flex items-center justify-center'>
                    <p className='text-sm font-medium text-zinc-600'>{responseDataEstadisticsOperatives}</p>
                  </div>
                </div> 
                <div className='flex flex-col text-start justify-start items-start border shadow-xl mt-4'>
                   <h5 className='text-md text-zinc-700 font-medium'>Estadistica Financiera: </h5>
                    <div className='flex items-center justify-center'>
                      <p className='text-sm font-medium text-zinc-600'>El monto total gastado en empleados en este dia, es de: {formatePrice(coastCleaningEmployees)}</p>
                    </div>
                </div>
                <div className='flex flex-col text-start justify-start items-start border shadow-xl mt-4'>
                   <h5 className='text-md text-zinc-700 font-medium'>Costo de Lavado unitario por cada Articulo: </h5>
                    <div className='flex flex-col items-center justify-center'>
                      {coastByArticle.map((c) => ( 
                        <div className='flex items-center gap-2' ket={c.article}>
                            <p className='text-zinc-600'><b>Articulo: </b>{c.article}</p>
                            <p className='text-zinc-600'><b>Costo Lavado Unitario: </b>{formatePrice(c.coastCleanArticle)}</p>
                        </div>
                      ))}
                    </div>
                </div>
            </>
              : null}
    </div>
  )
}

export default EmployeesShifts
