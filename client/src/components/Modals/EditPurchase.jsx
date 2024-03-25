import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";

const EditPurchase = ({purchaseData, closeModalNow, updateChanges}) => {
  
    const [step, setStep] = useState(0)
    const [modifyData, setModifyData] = useState(false)
    const [modifyOrderDetailData, setModifyOrderDetailData] = useState(false)
    const [newDay, setNewDay] = useState(purchaseData.day)
    const [newMonth, setNewMonth] = useState(purchaseData.month)
    const [newYear, setNewYear] = useState(purchaseData.year)
    const [newPurchaseDetail, setNewPurchaseDetail] = useState(purchaseData.detail)
    const [succesMessage, setSuccesMessage] = useState(false)
    const [theRealDataOfOrderDetail, setTheRealDataOfOrderDetail] = useState(purchaseData.orderDetail)

    const memoizedPropValue = useMemo(() => purchaseData.detail, []);

    const handleQuantityChange = (index, newQuantity) => {
        const updatePurchaseDetail = [...newPurchaseDetail];
        updatePurchaseDetail[index] = {
          ...updatePurchaseDetail[index],
          quantity: newQuantity,
          choosenProductTotalPrice: newQuantity * updatePurchaseDetail[index].price
        };
        setNewPurchaseDetail(updatePurchaseDetail);
      };

      const handleTotalChange = (index, newTotal) => {
        const updatePurchaseDetail = [...newPurchaseDetail];
        updatePurchaseDetail[index] = {
          ...updatePurchaseDetail[index],
          value: newTotal,
        };
        setNewPurchaseDetail(updatePurchaseDetail);
      };

      const changePurchaseData = async () => { 
      const newPurchaseData = ({ 
        month: newMonth,
        year: newYear,
        day: newDay         
      })
      try {
         const updatePurchaseData = await axios.put(`http://localhost:4000/purchases/updatePurchaseData/${purchaseData.id}`, newPurchaseData)
          if(updatePurchaseData.status === 200) { 
            setSuccesMessage(true)
            updateChanges()
            setTimeout(() => { 
              closeModalNow()
              setSuccesMessage(false)
              setModifyData(false)
            }, 1500)
          }
        } catch (err) {
          console.log(err)
        }     
      }

  

      const changePurchaseDetail = () => {  
        const sumarStock = [];
        const disminuirStock = [];
        const getDifferences = newPurchaseDetail.map((newArray) => { 
           const viewOriginal = memoizedPropValue.filter((original) => original.productId === newArray.productId);
           return { 
             nuevaCantidad: Number(newArray.quantity),
             cantidadOriginal: Number(viewOriginal.map((o) => o.quantity)[0]),
             diferencia: newArray.quantity - viewOriginal.map((o) => o.quantity)[0],
             productId: newArray.productId
           };
        }).map((dif) => { 
           if(dif.diferencia > 0) { 
             sumarStock.push(dif);
           } else { 
             disminuirStock.push(dif);
           }
        });
       
        console.log(sumarStock)
        console.log(disminuirStock)
        return { sumarStock, disminuirStock };
       };

      useEffect(() => { 
        console.log(newPurchaseDetail)
        console.log(memoizedPropValue)
      }, [newPurchaseDetail])
 
  
    return (
    <div className='w-full'>

                {modifyData === false && modifyOrderDetailData === false ?
                  <div className="flex flex-col mt-4 mb-4 items-center justify-center w-full">
                     <div className='w-full h-9 flex items-center cursor-pointer  bg-green-800' onClick={() => setModifyData(true)}>
                         <p className='font-bold text-white text-md'>Editar datos de la compra</p>
                     </div>
                     <div className='w-full h-9 flex items-center  cursor-pointer  bg-green-600 mt-2'  onClick={() => setModifyOrderDetailData(true)}>
                         <p className='font-bold text-white text-md'>Editar Detalle de la compra</p>
                     </div>
                  </div>
                  : null}

                  {modifyData === true ?
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col items-center justify-center">
                            <Input type="text" variant="underlined" label="Dia" value={newDay} className="w-56 mt-2" onChange={(e) => setNewDay(e.target.value)} />
                            <Input type="text" variant="underlined" label="Mes" value={newMonth} className="w-56 mt-2" onChange={(e) => setNewMonth(e.target.value)} />
                            <Input type="text" variant="underlined" label="Año" value={newYear} className="w-56 mt-2" onChange={(e) => setNewYear(e.target.value)} />
                                            
                        <div className="mt-4 mb-4 flex items-center gap-6">
                            <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => setModifyData(false)}>Cancelar</Button>
                            <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => changePurchaseData()}>Editar</Button>
                        </div>

                        {succesMessage === true && modifyData === true ? (
                        <div className="mt-4 mb-4 flex items-center">
                            <p className="font-medium text-green-500 text-sm">Datos de Compra editados con Éxito ✔</p>
                        </div>
                        ) : null}

                    </div>
                </div> 
                : null                
                 }

                 {modifyOrderDetailData === true ? 
                     <div>
                        {newPurchaseDetail.map((ord, index) => (
                            <div key={index} className="flex flex-col">
                            <div className="flex items-center justify-start w-72 gap-4 mt-2">
                                <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                                <Input type="number" variant="underlined" label="Cantidad" className="max-w-md min-w-sm" value={ord.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                                <Input type="number" variant="underlined" label="Total" className="max-w-md min-w-sm" value={ord.value} onChange={(e) => handleTotalChange(index, e.target.value)} />
                            </div>
                            </div>
                        ))}
                           
                            <div className="flex items-center gap-6 mt-6 mb-2">
                                <Button className="bg-green-800 font-bold text-white" onClick={() => console.log(changePurchaseDetail())}>Confirmar</Button>
                                <Button className="bg-green-800 font-bold text-white">Cancelar</Button>
                            </div>
                   </div>
                 :
                 null
                 }

                 {succesMessage === true && modifyOrderDetailData === true ? 
                   <p className='font-bold text-green-700 text-sm'>Detalle de la compra editados Exitosamente ✔</p>
                   :
                   null
                  }



    </div>
  )
}

export default EditPurchase
