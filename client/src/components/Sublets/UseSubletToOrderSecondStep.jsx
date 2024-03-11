import { Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { formatePrice } from '../../functions/gralFunctions'
import axios from 'axios'

const UseSubletToOrderSecondStep = ({orderData, orderDataStatus, dataSublet, comeBack}) => {

  const [totalToAdd, setTotalToAdd] = useState(0)
  const [orderId, setOrderId] = useState(orderData._id)

  useEffect(() => { 
    getTotalToAdd(dataSublet)
    setOrderId(orderData.map((ord) => ord._id)[0])
  }, [])

  const getTotalToAdd = (dataSublet) => { 
    const values = dataSublet.productsDetail.map((num) => num.rentalPrice)
    const finalValue = values.reduce((acc, el) => acc + el, 0)
    setTotalToAdd(finalValue)
    console.log(finalValue)
    return finalValue
  }

  const addSubletToTheOrder = () => { 
    console.log(orderId)
    const newStatus = "En Armado"
    axios.put(`http://localhost:4000/orders/changeOrderState/${orderId}`, { newStatus })
         .then((res) => { 
          console.log(res.data)
         })
         .catch((err) => { 
          console.log(err)
         })
    const orderData = ({ 
      orderDetail: orderData.map((ord) => ord.orderDetail)
    })
    axios.post(`http://localhost:4000/confirmOrderAndDiscountStock/${orderId}`, orderData) 
         .then((res) => { 
          console.log(res.data)
         })   
         .catch((err) => { 
          console.log(err)
         })
  }

  return (
     <div className='flex flex-col w-full'>
            {orderDataStatus === "A Confirmar" ?
            <> 
                <div className='flex flex-col justify-start items-start w-full '>
                  <div className='flex items-center gap-2'>
                    <h5 className='font-bold text-green-800'>Cliente:</h5>
                    <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.client)}</p>
                  </div>
                    <div className='mt-2'>
                      <h5 className='font-bold text-green-800'>Detalle de la orden:</h5>
                        <div className='flex flex-col items-start justify-start '>
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
                                      <div className='flex items-center gap-2' key={s.productId}>
                                          <p className='text-sm font-medium text-zinc-600'>Articulo: {s.productName}</p>
                                          <p className='text-sm font-medium text-zinc-600'>Cantidad: {s.quantity}</p>
                                      </div>
                                  ))}                 
                            </div>           
                    </div>
                    <div className='flex flex-col items-start justify-start mt-4'>
                            <p className='text-sm font-medium text-zinc-600'>Tu Orden tenia un total de {formatePrice(orderData.map((ord) => ord.total))}</p>
                            <p className='text-sm font-medium text-zinc-600'> Ahora pasará a tener un total de: {formatePrice(orderData.reduce((total, ord) => total + ord.total, 0) + totalToAdd)}</p>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-4 mt-4 mb-4'>
                  <Button className='text-white bg-green-800 font-medium text-md mt-2' onClick={() => addSubletToTheOrder()}>Agregar</Button>
                  <Button  className='text-white bg-green-800 font-medium text-md mt-2' onClick={() => comeBack()}>Cancelar</Button>
                </div>
              </> 
              : 
              <div className='m-4 flex flex-col items-center justify-center'>
                  <div className='flex flex-col items-start justify-start text-start'>
                     <p className='font-medium text-sm text-green-800'>La orden ya se encuentra en {orderDataStatus}</p>
                     <p className='font-medium text-sm text-green-800'>Si deseas añadir un SubAlquiler debe estar en A Confirmar</p>
                  </div>
                  <div className='mt-4 mb-4'>
                    <Button className='bg-green-800 text-white font-medium text-sm w-52' onClick={() => comeBack()}>Volver</Button>
                  </div>
              </div>
            }
       </div>
   
  )
}

export default UseSubletToOrderSecondStep
