import React from 'react'
import axios from "axios"
import { useState, useEffect } from 'react'
import EmployeesTableData from './EmployeesTableData'
import { everyEmployees } from '../../functions/gralFunctions'
import NavBarComponent from '../Navbar/Navbar'

const EmployeesData = () => {

  const [employeesData, setEmployeesData] = useState([])
   
  

  
  const everyEmployees = async () => { 
      try {
        const getData = await axios.get(`http://localhost:4000/employees`)
        const response = getData.data
        console.log("Todos los empleados", response)
        setEmployeesData(response);
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => { 
      everyEmployees()
    }, [])
  

 

  return (
    <div>
         <NavBarComponent/>
         <EmployeesTableData employeesData={employeesData} updateList={everyEmployees}/>
    </div>
  )
}

export default EmployeesData
