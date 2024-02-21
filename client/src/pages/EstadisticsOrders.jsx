import React from 'react'
import MonthlyBilling from '../components/Estadistics/ordersEstadistics/MonthlyBilling'
import NavBarComponent from '../components/Navbar/Navbar'

const EstadisticsOrders = () => {
  return (
    <div>
      <NavBarComponent/>
           <div className='flex flex-col items-center justify-center'>
                  <div>
                    <p className='font-bold text-md underline text-zinc-600'>Estadisticas de Alquileres</p>
                  </div>
                  <div className='mt-4'>
                    <MonthlyBilling/>
                  </div>
              </div>

    </div>
  )
}

export default EstadisticsOrders
