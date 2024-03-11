import { Button } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { formatePrice } from '../../functions/gralFunctions'

const UseSubletToOrderSecondStep = ({orderData, dataSublet}) => {

  useEffect(() => { 
    console.log("el detalle de sublet", dataSublet)
  }, [])

  return (
    <div className='flex flex-col justify-start items-start  w-full'>
        <div className='flex items-center gap-2'>
           <h5 className='font-bold text-green-800'>Cliente:</h5>
           <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.client)}</p>
        </div>
          <div className=' mt-2'>
            <h5 className='font-bold text-green-800'>Detalle de la orden:</h5>
             <div className='flex flex-col items-center justify-center '>
                {orderData.map((ord) => ord.orderDetail.map((c) => ( 
                    <div className='flex items-center justify-center gap-2'>
                        <p className='text-sm font-medium text-zinc-600'>Articulo: {c.productName}</p>
                        <p className='text-sm font-medium text-zinc-600'>Cantidad: {c.quantity}</p>
                    </div>
                )))}
            </div>
          </div>
          <div className='flex flex-col items-start mt-2'>
            <h5 className='font-bold text-green-800'>SubAlquiler para Agregar:</h5>
                <div>
                <p className='text-sm font-medium text-zinc-600'>Total de dinero Gastado: {dataSublet.amount}</p>
                        {dataSublet.productsDetail.map((s) => ( 
                            <div className='flex items-center gap-2'>
                                <p className='text-sm font-medium text-zinc-600'>Articulo: {s.productName}</p>
                                <p className='text-sm font-medium text-zinc-600'>Cantidad: {s.quantity}</p>
                            </div>
                        ))}                 
                </div>
         
        </div>
        <div className='flex flex-col items-start justify-start mt-4'>
              <p className='text-sm font-medium text-zinc-600'>Tu Orden tenia un total de {formatePrice(orderData.map((ord) => ord.total))}</p>
              <p className='text-sm font-medium text-zinc-600'> Ahora pasará a tener un total de: {formatePrice(orderData.reduce((total, ord) => total + ord.total, 0) + dataSublet.amount)}</p>
            <Button className='text-white bg-green-800 font-medium text-md mt-2'>¿Estas seguro de agregar?</Button>
        </div>
    </div>
  )
}

export default UseSubletToOrderSecondStep
