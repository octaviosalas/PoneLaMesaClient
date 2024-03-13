import React, { useEffect, useState } from 'react'
import { formatePrice } from '../../functions/gralFunctions'
import { Button } from '@nextui-org/react'
import PostPayment from '../Orders/PostPayment'
import RegisterMissingItems from './RegisterMissingItems'

const CreateNewReturnSecondStep = ({orderData, orderDataStatus, comeBack, closeModalNow}) => {

    const [orderHasBrokenArticles, setOrderHasBrokenArticles] = useState(false)

    useEffect(() => { 
        console.log(orderData)
        console.log(orderDataStatus)
    })

    const comeBackFirstStep = () => { 
        setOrderHasBrokenArticles(true)
    }

  return (
    <div>
  {orderHasBrokenArticles === false ?
  <>
     <div className='flex flex-col justify-start items-start w-full'>
         <div >
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Cliente:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.client)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Fecha de Entrega:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.dateOfDelivery)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Lugar de Entrega:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.placeOfDelivery)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Estado actual del Pedido:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.orderStatus)}</p>
                  </div>

                    <div className='mt-2'>
                      <h5 className='font-bold text-green-800'>Detalle de la orden:</h5>
                        <div className='flex flex-col items-start justify-start '>
                            {orderData.map((ord) => ord.orderDetail.map((c) => ( 
                                <div className='flex items-center justify-center gap-2' key={c.productName}>
                                    <p className='text-sm font-medium text-zinc-600'>Articulo: {c.productName}</p>
                                    <p className='text-sm font-medium text-zinc-600'>Cantidad: {c.quantity}</p>
                                </div>
                            )))}
                        </div>
                    </div>
                    <div className='mt-2'>
                      <h5 className='font-bold text-green-800'>SubAlquileres añadidos</h5>
                        <div className='flex flex-col items-start justify-start '>
                            {orderData.map((ord) => ord.subletsDetail.map((c) => ( 
                                <div className='flex items-center justify-center gap-2' key={c.productId}>
                                    <p className='text-sm font-medium text-zinc-600'>Articulo: {c.productName}</p>
                                    <p className='text-sm font-medium text-zinc-600'>Cantidad: {c.quantity}</p>
                                </div>
                            )))}
                        </div>
                    </div>
                    <div className='flex flex-col items-start justify-start mt-4'>
                        <h5 className='font-bold text-green-800'>Monto total del Pedido</h5>
                        <p className='text-sm font-medium text-zinc-600'>{formatePrice(orderData.map((ord) => ord.total))}</p>
                    </div>
                </div>
     </div>
     <div className='flex flex-col items-center justify-center mt-2'>
                {orderData.map((ord) => ord.paid === false) ? 
                    <div className='flex flex-col items-center justify-center'>
                    <p className='text-sm font-medium text-zinc-600 underline'>Este pedido se encuentra pendiente de pago</p>
                    <PostPayment usedIn="CreateNewReturn" valueToPay={formatePrice(orderData.map((ord) => ord.total))} orderData={orderData}/>
                    </div>
                :
                    <p className='text-sm font-medium text-zinc-600 underline'>Este pedido se encuentra Abonado</p>
                }
      </div>
      <div className='flex mt-4 gap-4 items-center justify-center'>
                <Button className="text-white bg-green-700 font-medium text-sm">Asentar Devolucion Sin Faltantes</Button>
                <Button className="text-white bg-green-700 font-medium text-sm" onClick={() => setOrderHasBrokenArticles(true)}>Registrar Faltantes</Button>
      </div>    
     </>
      :
      <RegisterMissingItems returnFirstStep={comeBackFirstStep} orderData={orderData}/> 
      }

    </div>
   
  )
}

export default CreateNewReturnSecondStep
