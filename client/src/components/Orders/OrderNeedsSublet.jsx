import { Button } from '@nextui-org/react'
import React, { useState } from 'react'

const OrderNeedsSublet = ({comeBack, sendOrderToBeConfirmed}) => {

  const [succesMessage, setSuccesMessage] = useState(false)

   const showSuccesMessage = () => { 
    sendOrderToBeConfirmed("A Confirmar")
    setSuccesMessage(true)
    setTimeout(() => { 
     setSuccesMessage(false)
    }, 2000)

   }

  return (
    <div className='flex flex-col items-center justify-center'>
        <div>
           <p className='font-medium text-green-800 text-sm'>El pedido quedara en estado de Confirmacion hasta que agregues sus productos SubAlquilados</p>
        </div>
        <div className='mt-6 mb-4 gap-4 flex items-center justify-center'>
           <Button className='font-medium text-white bg-green-800 text-sm w-52' onClick={() => showSuccesMessage()}>Guardar</Button>
           <Button className='font-medium text-white bg-green-700 text-sm w-52' onPress={comeBack}>Volver</Button>
        </div>
        {succesMessage ? 
        <div className='flex items-center justify-center mt-6 mb-4'>
           <p className='text-sm font-medium text-green-800'>Orden A Confirmar almacenada con Exito</p>
        </div> : null}
       
    </div>
  )
}

export default OrderNeedsSublet
