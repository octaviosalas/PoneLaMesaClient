import React, { useEffect } from 'react'
import { Input } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import axios from 'axios'
import { formateInputPrice } from '../../functions/gralFunctions'

const EditCollection = ({collectionData, closeModalNow, updateCollectionList}) => {

    const [collectionAmount, setCollectionAmount] = useState(formateInputPrice(collectionData.amount))
    const [succesMessage, setSuccesMessage] = useState(false)

    const changeCollectionOrderAmount = async () => { 
       console.log(collectionAmount)
       const newAmount = ({ 
        amount: Number(collectionAmount)
       })
       try {
          const updateAmount = await axios.put(`http://localhost:4000/collections/changeAmount/${collectionData.id}`, newAmount)
          console.log(updateAmount.data)
          if(updateAmount.status === 200) { 
            updateCollectionList()
            setSuccesMessage(true)
            setTimeout(() => { 
              setSuccesMessage(false)
              closeModalNow()
            }, 1800)
          }
       } catch (error) {
          console.log(error)
       }      
      }

    const changeCollectionDownPaymentAmount = async () => {
      const newAmount = ({ 
        amount: Number(collectionAmount),
        orderId: collectionData.orderId
       })
      try {
        const updateAmountDownPayment = await axios.put(`http://localhost:4000/collections/changeAmountDownPayment/${collectionData.id}`, newAmount)
        console.log(updateAmountDownPayment.data)
        if(updateAmountDownPayment.status === 200) { 
          updateCollectionList()
          setSuccesMessage(true)
          setTimeout(() => { 
            setSuccesMessage(false)
            closeModalNow()
          }, 1800)
        }
      } catch (error) {
        console.log(error)
      }
    }  

    const changeCollectionReplacement = async () => { 
        const newAmount = ({ 
          amount: Number(collectionAmount),
          orderId: collectionData.orderId,
          clientName: collectionData.clientName, 
          paymentReferenceId: collectionData.paymentReferenceId,
        })
        try {
           const editReplacement = await axios.put(`http://localhost:4000/collections/changeAmountReplacement/${collectionData.id}`, newAmount)
           console.log(editReplacement.data)
           if(editReplacement.status === 200) { 
            updateCollectionList()
            setSuccesMessage(true)
            setTimeout(() => { 
              setSuccesMessage(false)
              closeModalNow()
            }, 1800)
          }
        } catch (error) {
          console.log(error)
        }
    }



  return (
    <div>
          <div className="flex flex-col items-center justify-center">
                    <Input 
                    type="text" 
                    className="mt-2 w-60" 
                    label="Monto" 
                    value={collectionAmount} 
                    onChange={(e) => setCollectionAmount(e.target.value)} 
                      startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
                      </div>
                    }/>                  
                    <div className="flex items-center justify-center gap-4 mt-4 mb-4">
                      <Button 
                            className="font-bold text-white bg-green-800 text-sm w-52" 
                            onClick={() => 
                            {collectionData.collectionType === "Alquiler" ? changeCollectionOrderAmount() : 
                             collectionData.collectionType === "Seña" ? changeCollectionDownPaymentAmount() : 
                             collectionData.collectionType === "Reposicion" ? changeCollectionReplacement() : 
                             ac
                             null}}>
                            Confirmar Cambios
                      </Button>
                      <Button className="font-bold text-white bg-green-600 text-sm w-52" onPress={closeModalNow}>Cancelar</Button>
                    </div>
                   {succesMessage ?
                    <div className="flex items-center justify-center mb-2 mt-2">
                        <p className="font-bold text-green-800 text-sm">Cambios almacenados con Exito ✔</p>
                    </div> : null}
                </div>
    </div>
  )
}

export default EditCollection
