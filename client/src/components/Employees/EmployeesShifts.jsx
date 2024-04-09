import React, {useState, useEffect} from 'react'
import NavBarComponent from '../Navbar/Navbar'
import {Input, Select, SelectItem, Button} from "@nextui-org/react";
import {everyMonthsOfTheYear, everyYears} from "../../functions/gralFunctions"
import axios from 'axios';

const EmployeesShifts = () => {
 
    const [daySelected, setDaySelected] = useState(0)
    const [months, setMonths] = useState(everyMonthsOfTheYear)
    const [monthSelected, setMonthSelected] = useState("")
    const [years, setYears] = useState(everyYears)
    const [yearSelected, setYearSelected] = useState("")

    const getShifts = async () => { 
        const dayReseted = Number(daySelected)
        if(monthSelected.length > 0 && yearSelected > 0 && daySelected > 0) { 
            try {
                const getData = await axios.get(`http://localhost:4000/employees/getShifsByMonth/${monthSelected}`)
                const responseShifts = getData.data
                console.log("STATUS", getData.status)
                const filterData = responseShifts.filter((res) => res.day === dayReseted && res.year === yearSelected)       
                console.log(`Turnos realizados el dia ${daySelected} de ${monthSelected}`, filterData)
                if(getData.status === 200) { 
                    const getReplenishmentData = await axios.get(`http://localhost:4000/replenishment/${monthSelected}`)
                    const response = getReplenishmentData.data
                    const filterDataReplenishment = response.filter((res) => res.day === dayReseted && res.year === yearSelected)       
                    console.log(`Reposiciones realizadas el dia ${daySelected} de ${monthSelected}`, filterDataReplenishment)
                }
            } catch (error) {
                console.log(error)
            }
        } else { 
            console.log("ee")
        }
    }
    

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

            <Button className='bg-green-800 text-white font-medium text-sm w-full mt-4' onClick={() => getShifts()}>Buscar</Button>
         </div>
    </div>
  )
}

export default EmployeesShifts
