import React, { useEffect, useState } from 'react'
import {getMonthlyOrder, getEveryExpenses, formatePrice, getMonthlySublets, getMonthlyFixedExpenses, getEveryPurchases} from "../../../functions/gralFunctions"
import { Card, List, ListItem, Title } from '@tremor/react';
import axios from 'axios';

const EmployeesLiquidationGraphic = ({monthSelected, yearSelected}) => {

   const [employeesReport, setEmployeesReport] = useState([])
   const [withOutEmployeesData, setWithOutEmployeesData] = useState(false)
   const [totalAmount, setTotalAmount] = useState(0)

    const getData = async () => { 
        const yearFormated = Number(yearSelected)
       try {
        const getShiftsByMonth = await axios.get(`http://localhost:4000/employees/getShifsByMonth/${monthSelected}`)
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
       } catch (error) {
        console.log(error)
       }
    }


    useEffect(() => { 
        getData()
    }, [])

  return (
    <div>
        <Card className="mx-auto  w-[800px] max-h-[500px] overflow-y-auto rounded-xl shadow-xl">
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Liquidacion Empleados</h3>
               <p className='text-sm font-medium text-zinc-600'>Total: {formatePrice(employeesReport.reduce((acc, el) => acc + el.totalAmountToPaid, 0))}</p>
            </div>
              <List className="mt-2">
                  {employeesReport.map((item, index) => (
                      <ListItem key={item.employeeName} className='flex justify-between items-center'>
                        <span>{item.employeeName}</span>
                        <span>Turnos: {item.quantityShifts}</span>
                        <span>Horas: {item.totalHours}</span>
                        <span>Liquidacion: {formatePrice( item.totalAmountToPaid)}</span>
                       
                      </ListItem>
                  ))}
                </List>
        </Card>
    </div>
  )
}

export default EmployeesLiquidationGraphic
