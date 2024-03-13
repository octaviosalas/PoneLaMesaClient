import React, { useEffect, useState } from 'react'
import { Button, Input } from '@nextui-org/react'

const RegisterMissingItems = ({returnFirstStep, orderData}) => {

    const [allOrderProducts, setAllOrderProducts] = useState([])
    const [newOrderDetailArray, setNewOrderDetailArray] = useState(orderData.map((ord) => ord.orderDetail))


    useEffect(() => { 
        console.log(orderData)
        const articles = orderData.map((ord) => ord.orderDetail)[0]
        const subletsArticles = orderData.map((ord) => ord.subletsDetail)[0]
        const concatenatedArray = articles.concat(subletsArticles);
        setAllOrderProducts(concatenatedArray)
    }, [orderData])

    useEffect(() => { 
        console.log(allOrderProducts)
    }, [allOrderProducts])

    const handleQuantityChange = (index, newQuantity) => {
        const updatedOrderDetailArray = [...newOrderDetailArray];
        updatedOrderDetailArray[index] = {
          ...updatedOrderDetailArray[index],
          quantity: newQuantity,
          missing: updatedOrderDetailArray[index].quantity - newQuantity
        };
        setNewOrderDetailArray(updatedOrderDetailArray);
      };

  return (
    <div className='flex flex-col items-center justify-center'>
        <div className='flex items-center justify-center'>
           <p className='text-sm font-medium text-zinc-600 underline'>Indica la cantidad de Arituclos que recibiste</p>
        </div>
        <div>
            {allOrderProducts.map((ord, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center justify-start w-72 gap-4 mt-2">
                    <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                    <Input type="number" variant="underlined" label="Cantidad" className="max-w-md min-w-sm" value={ord.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} /> 
                </div>
              </div>
            ))}
        </div>
        <div className='mt-4 mb-2'>
            <Button className='text-white font-sm font-medium bg-green-800 w-72'>Confirmar Faltantes</Button>
        </div>

    </div>
  )
}

export default RegisterMissingItems

