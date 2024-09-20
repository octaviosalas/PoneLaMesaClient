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
          console.log("QUERYDATA", query.data)
          const filter = response.filter((exp) => exp.typeOfExpense === "Sub Alquiler"  || exp.typeOfExpense === "Compra")
          setEveryExpenses(filter)
          console.log("ESTO ES LO QUE VES EN LA TABLA", filter)
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
