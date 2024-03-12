import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '@nextui-org/react'

const DeleteSublet = ({subletData, closeModalNow, updateSubletList}) => {

    const [messageSuccesDeleteSublet, setMessageSuccesDeleteSublet] = useState(false)

    useEffect(() => { 
        console.log(subletData)
    }, [])


    const deleteSublet = () => { 
        axios.delete(`http://localhost:4000/sublets/${subletData.id}`)
             .then((res) => { 
              console.log(res.data)
              updateSubletList()
              setMessageSuccesDeleteSublet(true)
              setTimeout(() => { 
                closeModalNow()
                setMessageSuccesDeleteSublet(false)
              }, 1500)
             })
             .catch((err) => { 
              console.log(err)
             })
      }

      
  return (
    <div>
           <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                     <p className="flex flex-col gap-1 text-zinc-600 font-bold text-md">¿Estas seguro de eliminar el Sub Alquiler?</p>
                     <p className="flex flex-col gap-1 text-zinc-500 font-medium text-xs mt-1 underline">Los Articulos asignados se descontaran del stock</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-600" onClick={() => deleteSublet()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-600" onPress={closeModalNow}>Cancelar</Button>
                  </div>
                 {messageSuccesDeleteSublet ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-600 text-md font-medium">Sub Alquiler Eliminado Correctamente ✔</p>
                  </div>
                  : null}
               </div>
    </div>
  )
}

export default DeleteSublet
