import React, { useEffect, useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import RegisterMissingItemsSecondStep from './RegisterMissingItemsSecondStep'

const RegisterMissingItems = ({returnFirstStep, orderData}) => {

    const [allOrderProducts, setAllOrderProducts] = useState([])
    const [newOrderDetailArray, setNewOrderDetailArray] = useState([])
    const [originalOrderDetail, setOriginalOrderDetail] = useState([])
    const [confirmRegisterMissing, setConfirmRegisterMissing] = useState(false)
    const [withOutQuantityModified, setWithOutQuantityModified] = useState(false)



    useEffect(() => { 
        console.log(orderData)
        const articles = orderData.map((ord) => ord.orderDetail)[0]
        const subletsArticles = orderData.map((ord) => ord.subletsDetail)[0]
        const concatenatedArray = articles.concat(subletsArticles);
        setAllOrderProducts(concatenatedArray)
        setNewOrderDetailArray(concatenatedArray)
        setOriginalOrderDetail(concatenatedArray)
    }, [orderData])

    useEffect(() => { 
        console.log(allOrderProducts)
    }, [allOrderProducts])

    useEffect(() => { 
      console.log(newOrderDetailArray)
  }, [newOrderDetailArray])

  
  useEffect(() => { 
    console.log(originalOrderDetail)
}, [originalOrderDetail])

      const handleQuantityChange = (index, newQuantity) => {
        const updatedOrderDetailArray = [...newOrderDetailArray];
        updatedOrderDetailArray[index] = {
          ...updatedOrderDetailArray[index],
          quantity: newQuantity,
          missing: originalOrderDetail[index].quantity  - newQuantity
        };
        setNewOrderDetailArray(updatedOrderDetailArray);
      };

      const continueToConfirm = () => { 
        const hasMissingPropperty = newOrderDetailArray.some(obj => 'missing' in obj);
        if(hasMissingPropperty === true) { 
          console.log("yes")
          setConfirmRegisterMissing(true)
        } else { 
          console.log("no")
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
        <div className='mt-4 mb-2 flex flex-col items-center justify-center'>
            <Button className='text-white font-sm font-medium bg-green-800 w-72' onClick={() => continueToConfirm()}>Continuar</Button>
            {withOutQuantityModified ? <p className="font-medium text-green-800 text-sm mt-4">No has registrado ningun Faltante</p> : null}
        </div> 
       </>
       :
        <RegisterMissingItemsSecondStep dataUpdated={newOrderDetailArray} orderData={orderData} comeBack={comeBack}/>
        }

    </div>
  )
}

export default RegisterMissingItems

