import React from 'react'
import NavBarComponent from '../components/Navbar/Navbar';
import MonthlyBilling from '../components/Estadistics/ordersEstadistics/MonthlyBilling';
import ArticlesRanking from '../components/Estadistics/articlesEstadistics/ArticlesRanking';
import AccountsEstadistics from '../components/Estadistics/collectionsEstadistics/AccountsEstadistics';


const EstadisticsPage = () => {

  
  return (
    <div>
        <NavBarComponent/>
        <div className='flex gap-8 items-center justify-center'>

            <div className='flex flex-col items-center justify-center'>
                  <div>
                    <p className='font-bold text-md underline text-zinc-600'>Estadisticas de Alquileres</p>
                  </div>
                  <div className='mt-4'>
                    <MonthlyBilling/>
                  </div>
              </div>

              <div className='flex flex-col items-center justify-center'>
                  <div>
                  <p className='font-bold text-md underline text-zinc-600'>Estadisticas de Productos</p>
                  </div>
                  <div className='mt-4'>
                     <ArticlesRanking/>
                  </div>
              </div>

              <div className='flex flex-col items-center justify-center'>
                  <div>
                  <p className='font-bold text-md underline text-zinc-600'>Estadisticas de Cobros</p>
                  </div>
                  <div className='mt-4'>
                     <AccountsEstadistics/>
                  </div>
              </div>

        </div>
          


    </div>
  )
}

export default EstadisticsPage
