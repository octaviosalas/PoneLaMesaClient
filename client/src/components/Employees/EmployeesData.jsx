import React from 'react'
import axios from "axios"
import { useState, useEffect } from 'react'
import EmployeesTableData from './EmployeesTableData'
import { everyEmployees } from '../../functions/gralFunctions'
import NavBarComponent from '../Navbar/Navbar'

const EmployeesData = () => {

  const [employeesData, setEmployeesData] = useState([])
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await everyEmployees();
        setEmployeesData(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };   
    fetchData();
  }, []);

 

  return (
    <div>
         <NavBarComponent/>
         <EmployeesTableData employeesData={employeesData}/>
    </div>
  )
}

export default EmployeesData
