import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '@nextui-org/react'

const DeleteClient = ({clientData, closeModalNow, updateClientList}) => {

    const [messageSuccesDeleteClient, setMessageSuccesDeleteClient] = useState(false)


    const deleteClient = () => { 
        axios.delete(`http://localhost:4000/clients/${clientData.id}`)
             .then((res) => { 
              console.log(res.data)
              updateClientList()
              setMessageSuccesDeleteClient(true)
              setTimeout(() => { 
                closeModalNow()
                setMessageSuccesDeleteClient(false)
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
                     <p className="flex flex-col gap-1 text-black font-bold text-md">¿Estas seguro de eliminar el cliente?</p>
                     {clientData.id}
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteClient()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={closeModalNow}>Cancelar</Button>
                  </div>
                 {messageSuccesDeleteClient ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Cliente Eliminado Correctamente ✔</p>
                  </div>
                  : null}
               </div>
    </div>
  )
}

export default DeleteClient
