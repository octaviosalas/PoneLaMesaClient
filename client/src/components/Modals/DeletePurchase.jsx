import React from 'react'
import axios from 'axios'
import { Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'

const DeletePurchase = ({purchaseData, closeModalNow, updateList}) => {

    const [secondStepOfDelete, setSecondStepOfDelete] = useState(false)
    const [successDeleted, setSuccessDeleted] = useState(false)


   
      const deletePurchaseAndUpdateProductStock = () => { 
        console.log(purchaseData.id)
        axios.delete(`http://localhost:4000/purchases/replenishShares/${purchaseData.id}`)
             .then((res) => { 
              console.log(res.data)
              setSuccessDeleted(true)
              updateList()
              setTimeout(() => { 
                closeModalNow()
                setSuccessDeleted(false)
              }, 2500)

             })
             .catch((err) => { 
              console.log(err)
             })
      }


  return (
    <div>
          <div className="flex flex-col items-center justify-center">
                  <div className='flex flex-col texct-center justify-center items-center'>
                     <p className="flex flex-col gap-1 text-black font-medium text-md">¿Estas seguro de eliminar La compra?</p>
                     <p className='text-sm underline mt-2'>Ten en cuenta que los articulos seran descontados del stock actual</p>
                  </div>

                 {secondStepOfDelete ? null
                  :
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white  w-60 bg-green-800" onClick={() => deletePurchaseAndUpdateProductStock()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white  w-60 bg-green-800" onPress={closeModalNow}>Cancelar</Button>
                  </div>}

              

                 {successDeleted ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-800 text-sm font-medium">Compra Eliminada Correctamente ✔</p>
                  </div>
                  : null}

               </div>
    </div>
  )
}

export default DeletePurchase
