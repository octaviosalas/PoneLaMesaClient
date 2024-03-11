import { Button } from '@nextui-org/react'
import React from 'react'

const OrderNeedsSublet = ({comeBack, sendOrderToBeConfirmed}) => {



  return (
    <div className='flex flex-col items-center justify-center'>
        <div>
           <p className='font-medium text-green-800 text-sm'>El pedido quedara en estado de Confirmacion hasta que agregues sus productos SubAlquilados</p>
        </div>
        <div className='mt-6 mb-4 gap-4 flex items-center justify-center'>
           <Button className='font-medium text-white bg-green-800 text-sm w-52' onClick={() => sendOrderToBeConfirmed("A Confirmar")}>Guardar</Button>
           <Button className='font-medium text-white bg-green-700 text-sm w-52' onPress={comeBack}>Volver</Button>
        </div>
       
    </div>
  )
}

export default OrderNeedsSublet
