import React, { useState } from 'react'
import { Button } from '@nextui-org/react'
import { formatePrice } from '../../functions/gralFunctions'

const EmployeesReportSecondStep = ({filteredData, closeModal, monthSelected, hourAmount}) => {

    const [everyHours, setEveryHours] = useState(filteredData.map((data) => data.totalAmountPaidShift).reduce((acc, el) => acc + el, 0))

   
    


  return (
    <div>
       <h5 className='mt-2 font-medium text-black text-sm'>Reporte {monthSelected}: </h5>
       <p className='text-zinc-700 font-medium text-sm'>Cantidad de horas trabajadas: {everyHours}</p>
       <p className='text-zinc-700 font-medium text-sm'>Cantidad turnos: {filteredData.length}</p>
       <p className='text-zinc-700 font-medium text-sm underline'>Monto a Pagar: {formatePrice(everyHours)}</p>

       <div className='flex flex-col'>
         <h5 className='mt-2 font-medium text-black text-sm'>Detalle de los turnos: </h5>
         {filteredData.map((filt) => ( 
          <div className='flex items-center gap-4'>
             <p className='text-zinc-700 font-medium text-sm'>Fecha: {filt.date}</p>
             <p className='text-zinc-700 font-medium text-sm'>Horas trabajadas: {filt.hours} Horas</p>
             <div>
             <div className='flex gap-1'>
              <p className='text-zinc-700 font-medium text-sm'>Actividades:</p>
              {filt.activities.map((act) => ( 
                  <div className='flex items-center'>
                    <p className='text-zinc-700 font-medium text-sm'>{act}</p>
                  </div>
                ))}
             </div>
            
             </div>
          </div>
         ))}
         <div className='w-full flex items-center justify-center mt-4 mb-2'>
          <Button className="text-white font-medium text-sm bg-green-800 w-72" onPress={closeModal}>Cerrar</Button>
         </div>
       </div>
    </div>
  )
}

export default EmployeesReportSecondStep
