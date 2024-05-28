import React from 'react'
import axios from "axios"
import { useState, useEffect } from 'react'
import { getEveryExpenses } from '../../functions/gralFunctions'
import ExpensesTable from './ExpensesTable'
import NavBarComponent from '../Navbar/Navbar'
import FixedExpensesTable from './FixedExpenses'

const MainExpenses = ({from}) => {  
 
    const [everyExpenses, setEveryExpenses] = useState([])

       const getEveryExpenses = async () => {
        try {
          const query = await axios.get("http://localhost:4000/expenses");
          const response = query.data
          setEveryExpenses(response)
          } catch (error) {
          console.error(error);
        }
      };

      useEffect(() => {
        getEveryExpenses()
      }, [])



  return (
    <div>
        <NavBarComponent/>
        <ExpensesTable expensesData={everyExpenses} updateList={getEveryExpenses}/>
    </div>
  )
}

export default MainExpenses
