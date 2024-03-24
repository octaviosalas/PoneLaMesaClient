import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '@nextui-org/react'

//1 - Eliminar cobro + actualizar paid de orden a false ✔
//2 - Eliminar cobro de reposicion + Actualizar la deuda del cliente a false el paid 
// 3 - Eliminar cobro de seña + eliminar de la orden el downPaymentData 

const DeleteCollection = ({collectionData, closeModalNow, updateCollections}) => {

    const [messageSuccesDeleteCollection, setMessageSuccesDeleteCollection] = useState(false)
    const [succesDeleted, setSuccesDeleted] = useState(false)
    
    useEffect(() => { 
      console.log(collectionData)
    }, [])


    const deleteOrderCollection = async () => { 
       try {
         const deleteCollection = await axios.delete(`http://localhost:4000/collections/deleteCollection/${collectionData.id}`, {data: collectionData})
         console.log(deleteCollection.data)
         if(deleteCollection.status === 200) { 
            setSuccesDeleted(true)
            setTimeout(() => { 
               setSuccesDeleted(false)
               closeModalNow()
               updateCollections()
            }, 1800)
         }
       } catch (error) {
         
       }
    }

    const deleteReplacementCollection =  () => { 
   
    }

    const deleteDownPaymentCollection = () => { 

    }

      
  return (
    <div>
           <div className="flex flex-col items-center justify-center">
                  <div className='flex flex-col items-center justify-center'>
                     <p className="flex flex-col gap-1 text-green-800 font-medium text-md">¿Estas seguro de eliminar el Cobro?</p>

                    {collectionData.collectionType === "Alquiler" ?
                     <p className="flex flex-col gap-1 text-zinc-600 font-medium text-xs">Ten en cuenta, que el {collectionData.collectionType} quedara pendiente de pago</p> 
                     : null}

                     {collectionData.collectionType === "Seña" ?
                      <p className="flex flex-col gap-1 text-zinc-600 font-medium text-xs">Ten en cuenta, que la {collectionData.collectionType} se eliminara del pedido</p> 
                     : null}

                     {collectionData.collectionType === "Reposicion" ?
                      <p className="flex flex-col gap-1 text-zinc-600 font-medium text-xs">Ten en cuenta, que la {collectionData.collectionType} quedara como deuda del cliente</p> 
                     : null}


                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     
                     <Button className="text-sm w-52 font-medium text-white bg-green-800" 
                              onClick={() => {collectionData.collectionType === "Alquiler" ? deleteOrderCollection() : null}}>
                              Eliminar
                     </Button>
                     <Button className="text-sm w-52 font-medium text-white bg-green-800" 
                             onPress={closeModalNow}>
                             Cancelar
                    </Button>

                  </div>
                  
                 {succesDeleted ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Cobro Eliminado Correctamente ✔</p>
                  </div>
                  : null}
               </div>
    </div>
  )
}

export default DeleteCollection
