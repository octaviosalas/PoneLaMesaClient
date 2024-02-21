import React from 'react'
import NavBarComponent from '../components/Navbar/Navbar'
import AccountsEstadistics from '../components/Estadistics/collectionsEstadistics/AccountsEstadistics'

const EstadisticsCollections = () => {
  return (
    <div>
    <NavBarComponent/>
      <div className='flex flex-col items-center justify-center'>
          <div>
                <p className='font-bold text-md underline text-zinc-600'>Estadisticas de Cobros</p>
          </div>
          <div className='mt-4'>
               <AccountsEstadistics/>
           </div>
      </div>
  </div>
  )
}

export default EstadisticsCollections
