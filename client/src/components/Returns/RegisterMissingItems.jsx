import React, { useEffect, useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import RegisterMissingItemsSecondStep from './RegisterMissingItemsSecondStep'

const RegisterMissingItems = ({closeModalNow, orderData, cancel}) => {

    const [allOrderProducts, setAllOrderProducts] = useState([])
    const [newOrderDetailArray, setNewOrderDetailArray] = useState([])
    const [originalOrderDetail, setOriginalOrderDetail] = useState([])
    const [confirmRegisterMissing, setConfirmRegisterMissing] = useState(false)
    const [withOutQuantityModified, setWithOutQuantityModified] = useState(false)
    const [largerAmount, setLargerAmount] = useState(false)

     useEffect(() => { 
        console.log(orderData)
        const articles = orderData.map((ord) => ord.orderDetail)[0]
        const subletsArticles = orderData.map((ord) => ord.subletsDetail)[0]
        const concatenatedArray = articles.concat(subletsArticles);
        setAllOrderProducts(concatenatedArray)
        setNewOrderDetailArray(concatenatedArray)
        setOriginalOrderDetail(concatenatedArray)
     }, [orderData])
    
     const handleQuantityChange = (index, newQuantity) => {
        const updatedOrderDetailArray = [...newOrderDetailArray];
        const updatedOrderDetail = {
          ...updatedOrderDetailArray[index],
          quantity: newQuantity,
          missing: originalOrderDetail[index].quantity - newQuantity
        };
        if (updatedOrderDetail.missing === 0) {
          delete updatedOrderDetail.missing;
        }
        updatedOrderDetailArray[index] = updatedOrderDetail;
        setNewOrderDetailArray(updatedOrderDetailArray);
        console.log(updatedOrderDetailArray);
     };

      const continueToConfirm = () => { 
        const hasMissingPropperty = newOrderDetailArray.some(obj => 'missing' in obj);
        const articlesWithMissedPropperty = newOrderDetailArray.filter(obj => 'missing' in obj);
        if(hasMissingPropperty === true) { 
          const quantityMissed = articlesWithMissedPropperty.map((miss) => miss.missing)
          const detectWrongQuantitys = quantityMissed.some((num) => num <= -1)
          if(detectWrongQuantitys === false && hasMissingPropperty) { 
            setConfirmRegisterMissing(true)
          } else { 
            setLargerAmount(true)
            setTimeout(() => { 
              setLargerAmount(false)
            }, 2200)
          }
          console.log(detectWrongQuantitys)
          console.log(quantityMissed)
        } else { 
          setConfirmRegisterMissing(false)
          setWithOutQuantityModified(true)
          setTimeout(() => { 
            setWithOutQuantityModified(false)
          }, 1500)
        }
      }

      const comeBack = (item) => { 
        setConfirmRegisterMissing(item)
      }

  return (
    <div className='flex flex-col items-center justify-center'>
      {confirmRegisterMissing === false ?
      <>
        <div className='flex items-center justify-center'>
           <p className='text-sm font-medium text-zinc-600 underline'>Indica la cantidad de Arituclos que recibiste</p>
        </div>
        <div>
            {allOrderProducts.map((ord, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center justify-start w-72 gap-4 mt-2">
                    <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                    <Input type="number" variant="underlined" label="Cantidad" className="max-w-md min-w-sm"   value={newOrderDetailArray[index].quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} /> 
                </div>
              </div>
            ))}
        </div>
        <div className='mt-4 mb-2 flex gap-4 items-center justify-center'>
            <Button className='text-white font-sm font-medium bg-green-800 w-52' onClick={() => continueToConfirm()}>Continuar</Button>
            <Button className='text-white font-sm font-medium bg-green-800 w-52' onClick={() => cancel()}>Cancelar</Button>
        </div> 
        {withOutQuantityModified ? <p className="font-medium text-green-800 text-sm mt-4">No has registrado ningun Faltante</p> : null}
        {largerAmount ? <p className="font-medium text-green-800 text-sm mt-4">Has Ingresado cantidades Mayores a las entregadas</p> : null}

       </>
       :
        <RegisterMissingItemsSecondStep dataUpdated={newOrderDetailArray} orderData={orderData} comeBack={comeBack} closeModalNow={closeModalNow}/>
        }

    </div>
  )
}

export default RegisterMissingItems

