import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '@nextui-org/react'

const DeleteArticle = ({productData, closeModalNow, updateList}) => {

    const [messageSuccesDeleteArticle, setMessageSuccesDeleteArticle] = useState(false)


    const deleteArticle = () => { 
        axios.delete(`http://localhost:4000/products/delete/${productData.id}`)
             .then((res) => { 
              console.log(res.data)
              updateList()
              setMessageSuccesDeleteArticle(true)
              setTimeout(() => { 
                closeModalNow()
                setMessageSuccesDeleteArticle(false)
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
                     <p className="flex flex-col gap-1 text-black font-medium text-md">¿Estas seguro de eliminar el producto?</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white w-60 bg-green-800" onClick={() => deleteArticle()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white w-60 bg-green-800" onPress={closeModalNow}>Cancelar</Button>
                  </div>
                 {messageSuccesDeleteArticle ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-800 text-sm font-medium">Articulo Eliminado Correctamente ✔</p>
                  </div>
                  : null}
               </div>
    </div>
  )
}

export default DeleteArticle
