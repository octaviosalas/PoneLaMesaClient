import React from 'react'
import NavBarComponent from '../components/Navbar/Navbar'
import TopClientsEstadistics from '../components/Estadistics/clientsEstadistics/TopClientsEstadistics'

const EstadisticsClients = () => {
  return (
    <div>
      <NavBarComponent/>
       <div className='flex flex-col items-center justify-center'>
            <div>
                  <p className='font-bold text-md underline text-zinc-600'>Estadisticas de Clientes</p>
            </div>
            <div className='mt-4'>
                 <TopClientsEstadistics/>
             </div>
        </div>
    </div>
  )
}

export default EstadisticsClients
