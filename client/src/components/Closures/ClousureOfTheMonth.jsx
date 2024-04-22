import React from 'react'
import OrdersListGraphic from './Graphics/OrdersListGraphic'
import ExpensesGraphic from './Graphics/ExpensesGraphic'
import CollectionsGraphic from './Graphics/CollectionsGraphic'
import EmployeesLiquidationGraphic from './Graphics/EmployeesLiquidationGraphic'
import { useParams } from 'react-router-dom';
import NavBarComponent from '../Navbar/Navbar'

const ClousureOfTheMonth = () => {

  const { year, month } = useParams();

  return (
    <div className='flex flex-col'>
       <NavBarComponent/>
       <div className='mt-24'>
          <OrdersListGraphic  yearSelected={year} monthSelected={month}/>
       </div>
       <div className='mt-12'>
          <ExpensesGraphic yearSelected={year} monthSelected={month}/>
       </div>
       <div className='mt-12'>
        <CollectionsGraphic yearSelected={year} monthSelected={month}/>
       </div>
       <div className='mt-12'>
         <EmployeesLiquidationGraphic yearSelected={year} monthSelected={month}/>
       </div>
    </div>
  )
}

export default ClousureOfTheMonth
