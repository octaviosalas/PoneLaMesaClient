import React from 'react'
import axios from 'axios'
import { Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'

const DeletePurchase = ({purchaseData, closeModalNow, updateList}) => {

    const [secondStepOfDelete, setSecondStepOfDelete] = useState(false)
    const [successDeleted, setSuccessDeleted] = useState(false)

    const goToSecondStepOfDelete = () => { 
        setSecondStepOfDelete(true)
      }

    const deletePurchase = () => { 
        axios.delete(`http://localhost:4000/purchases/${purchaseData.id}`)
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
    
      const deletePurchaseAndUpdateProductStock = () => { 
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
                  <div>
                     <p className="flex flex-col gap-1 text-black font-bold text-md">¿Estas seguro de eliminar La compra?</p>
                  </div>

                 {secondStepOfDelete ? null
                  :
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white w-auto bg-green-600" onClick={() => goToSecondStepOfDelete()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white w-auto bg-green-600" onPress={closeModalNow}>Cancelar</Button>
                  </div>}

                 {secondStepOfDelete ? 
                  <div className="flex gap-4 mt-4 mb-4">
                    <Button className="text-sm font-medium text-white w-auto bg-green-600" onClick={() => deletePurchaseAndUpdateProductStock()}>Deshacer del Stock</Button>
                    <Button className="text-sm font-medium text-white w-auto bg-green-600" onClick={() => deletePurchase()}>No Deshacer productos del Stock</Button>
                  </div> : null}

                 {successDeleted ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Compra Eliminada Correctamente ✔</p>
                  </div>
                  : null}

               </div>
    </div>
  )
}

export default DeletePurchase
