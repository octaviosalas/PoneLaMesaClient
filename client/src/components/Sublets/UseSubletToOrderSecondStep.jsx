import { Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { formatePrice } from '../../functions/gralFunctions'
import axios from 'axios'
import Loading from '../Loading/Loading'

const UseSubletToOrderSecondStep = ({orderData, orderDataStatus, dataSublet, comeBack, closeModalNow, update}) => {

  const [totalToAdd, setTotalToAdd] = useState(0)
  const [orderId, setOrderId] = useState(orderData._id)
  const [orderDetail, setOrderDetail] = useState(null)
  const [succesMessage, setSuccesMessage] = useState(null)
  const [load, setLoad] = useState(false)


  useEffect(() => { 
    getTotalToAdd(dataSublet)
    console.log(dataSublet)
    setOrderId(orderData.map((ord) => ord._id)[0])
    setOrderDetail(orderData.map((ord) => ord.orderDetail)[0])
    console.log(orderData)
  }, [])

  useEffect(() => { 
    console.log(orderDetail)
  }, [orderDetail])

  const getTotalToAdd = (dataSublet) => { 
    const values = dataSublet.productsDetail.map((num) => num.rentalPrice)
    const finalValue = values.reduce((acc, el) => acc + el, 0)
    setTotalToAdd(finalValue)
    console.log(finalValue)
    return finalValue
  }

  const addSubletToTheOrder = async () => {
    setLoad(true);
    try {
      const newStatus = "Armado";
      const statusUpdateResponse = await axios.put(`http://localhost:4000/orders/changeOrderState/${orderId}`, { newStatus });
      console.log(statusUpdateResponse.data);
  
      if (statusUpdateResponse.status === 200) {
        const detailOrder = {
          orderDetail: orderDetail,
          subletDetail: dataSublet.productsDetail,
          newAmount: orderData.reduce((total, ord) => total + ord.total, 0) + totalToAdd
        };
        console.log(detailOrder);
  
        const stockUpdateResponse = await axios.post(`http://localhost:4000/orders/confirmOrderAndDiscountStock/${orderId}`, { detailOrder });
        console.log(stockUpdateResponse.data);
  
        if (stockUpdateResponse.status === 200) {
          const newSubletState = await axios.put(`http://localhost:4000/sublets/updateState/${dataSublet.id}`);
          console.log(newSubletState.data);
  
          if (newSubletState.status === 200) {
            setSuccesMessage(true);
            setLoad(false);
            update()
            setTimeout(() => {
              closeModalNow();
              setSuccesMessage(false);
              comeBack();
            }, 1800);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };

  return (
     <div className='flex flex-col w-full'>
     
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

                {load ?
                <div className='flex flex-col items-center justify-center mt-4 mb-4'>
                    <Loading/>
                </div> : null}
                {succesMessage ?
                  <div className='flex flex-col items-center justify-center mt-4 mb-4'>
                      <p className='font-medium text-green-800 text-sm'>Operacion Realizada con Exito ✔</p>
                      <p className='font-medium text-green-800 text-sm'>El pedido se encuentra en Armado</p>
                  </div> : null}

              </> 
             
       </div>
   
  )
}

export default UseSubletToOrderSecondStep
