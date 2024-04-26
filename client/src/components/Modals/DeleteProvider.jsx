import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '@nextui-org/react'

const DeleteProvider = ({providerData, closeModalNow, updateProviderList}) => {

    const [messageSuccesDeleteProvider, setMessageSuccesDeleteProvider] = useState(false)


    const deleteProvider = () => { 
        console.log("id enviado.", providerData.id)
        axios.delete(`http://localhost:4000/providers/${providerData.id}`)
             .then((res) => { 
              console.log(res.data)
              updateProviderList()
              setMessageSuccesDeleteProvider(true)
              setTimeout(() => { 
                closeModalNow()
                setMessageSuccesDeleteProvider(false)
              }, 1500)
             })
             .catch((err) => { 
              console.log(err)
             })
      }

      
  return (
    <div>
           <div className="flex flex-col items-center justify-center">
                  <div>
                     <p className="flex flex-col gap-1 text-zinc-600 font-medium text-sm">¿Estas seguro de eliminar el Proveedor?</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteProvider()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={closeModalNow}>Cancelar</Button>
                  </div>
                 {messageSuccesDeleteProvider ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Proveedor Eliminado Correctamente ✔</p>
                  </div>
                  : null}
               </div>
    </div>
  )
}

export default DeleteProvider
