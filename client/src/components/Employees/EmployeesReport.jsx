import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import { months, everyYears } from "../../functions/gralFunctions";
import axios from "axios";
import EmployeesReportSecondStep from "./EmployeesReportSecondStep";

export const EmployeesReport = ({employeeData}) => { 


  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [monthSelected, setMonthSelected] = useState("")
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [yearSelected, setYearSelected] = useState("");
  const [filteredData, setFilteredData] = useState([])
  const [missedData, setMissedData] = useState(false)
  const [secondStep, setSecondStep] = useState(false)
  const [withOutShifts, setWithOutShifts] = useState(false)
 
  console.log(employeeData)


  const searchShifts = async () => { 
    console.log(monthSelected)
    console.log(yearSelected)
    if(monthSelected !== ""  && yearSelected !== "") { 
        console.log("a")
        try {
            const getData = await axios.get(`http://localhost:4000/employees/getEmployeeShifts/${employeeData.id}`)
            const response = getData.data
            console.log(response)
            const filterDataByMonth =  response.filter((d) => d.month === monthSelected && d.year === yearSelected)
            console.log(filterDataByMonth)
             setFilteredData(filterDataByMonth)
             if(filterDataByMonth.length > 0) { 
                setSecondStep(true)
             } else { 
                setWithOutShifts(true)
                setTimeout(() => { 
                    setWithOutShifts(false)
                }, 3000)
             }
        } catch (error) {
            console.log(error)
        }
    } else { 
        setMissedData(true)
        setTimeout(() => { 
            setMissedData(false)
        }, 2000)
    }
   
  }


  return (
    <>
      <p className="text-green-800 text-xs font-medium cursor-pointer" onClick={onOpen}>Reporte</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-[800px]" >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{employeeData.name}</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                    <Select variant={"faded"} label="Selecciona un año" className="max-w-xs" value={yearSelected}>          
                                            {years.map((year) => (
                                            <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                                {year.label}
                                            </SelectItem>
                                            ))}
                                    </Select>
                        <Select variant={"faded"} label="Selecciona un mes" className="max-w-xs mt-3" value={monthSelected}>          
                                {everyMonths.map((month) => (
                                <SelectItem key={month.label} value={month.value} onClick={() => setMonthSelected(month.value)}>
                                {month.label}
                                </SelectItem>))}
                        </Select>
              </ModalBody>

            {!secondStep ?
              <ModalFooter className="flex flex-col  gap-4 items-center justify-center">
                <div className="flex gap-4 items-center justify-center">
                     <Button className="bg-green-800 text-white font-medium text-sm w-72" onPress={searchShifts}> Confirmar </Button>
                     <Button  className="bg-green-800 text-white font-medium text-sm w-72"  onPress={onClose}> Cancelar </Button>
                </div>
                {missedData ? <p className="mt-4 mb-2 text-green-800 font-medium text-sm">Debes completar año y mes</p> : null}
                {withOutShifts ? <p className="mt-4 mb-2 text-green-800 font-medium text-sm">No hay datos que cumplan con el mes y el año aplicado </p> : null}

              </ModalFooter> : null}

              {secondStep ? 
                <div className="flex items-center justify-center mt-4 mb-2">
                    <EmployeesReportSecondStep filteredData={filteredData} closeModal={onClose} monthSelected={monthSelected} hourAmount={employeeData.hourAmount}/>
                </div> : null}

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EmployeesReport
