import React from 'react'
import axios from "axios"
import { useState, useEffect } from 'react'
import { getEveryExpenses } from '../../functions/gralFunctions'
import ExpensesTable from './ExpensesTable'
import NavBarComponent from '../Navbar/Navbar'

const MainExpenses = () => {  
 
    const [everyExpenses, setEveryExpenses] = useState([])

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getEveryExpenses();
            setEveryExpenses(data);
            console.log(data)
          } catch (error) {
            console.error("Error fetching gastos:", error);
          }
        };   
        fetchData();
      }, []);



  return (
    <div>
        <NavBarComponent/>
        <ExpensesTable expensesData={everyExpenses} updateList={getEveryExpenses}/>
    </div>
  )
}

export default MainExpenses
