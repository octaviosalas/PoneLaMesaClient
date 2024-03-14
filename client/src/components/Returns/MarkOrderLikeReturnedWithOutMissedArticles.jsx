import React, { useState } from 'react'
import { Button } from '@nextui-org/react'
import axios from 'axios'
import Loading from '../Loading/Loading'



const MarkOrderLikeReturnedWithOutMissedArticles = ({cancel, orderId, closeNow, updateList}) => {

    const [succesMessage, setSuccesMessage] = useState(false)
    const [load, setLoad] = useState(false)

    const updateStateOrderLikeReturnedWithOutMissedArticles = async () => { 
      setLoad(true)
       try {
         const newStatus = "Devuelto";
         const statusUpdateResponse = await axios.put(`http://localhost:4000/orders/changeOrderState/${orderId}`, { newStatus });
         console.log(statusUpdateResponse.data);
         if (statusUpdateResponse.status === 200) { 
            setSuccesMessage(true)
            setLoad(false)
            updateList()
            setTimeout(() => { 
                closeNow()
                setSuccesMessage(false)
            }, 2000)
         }
       } catch (error) {
          console.log(error)
          setLoad(false)
       }
    }

  return (
    <div className='flex flex-col items-center justify-center'>
        <p className='text-zinc-600 font-medium text-sm'>¿Estas seguro de modificar el estado de la orden a <b>Devuelto</b>?</p>
        <div className='flex items-center justify-center gap-4 mt-4 mb-4'>
            <Button className='w-52 text-white font-medium text-sm bg-green-800' onClick={() => updateStateOrderLikeReturnedWithOutMissedArticles()}>Confirmar</Button>
            <Button className='w-52 text-white font-medium text-sm bg-green-800' onClick={() => cancel()}>Cancelar</Button>
        </div>
        {load ?
         <Loading/> : (
            succesMessage ? 
             <div className='flex items-center justify-center mt-4 mb-4'>
                 <p className='text-sm font-medium text-green-800'>El estado de la orden fue actualizado con Exito ✔</p>
             </div>
               : null
        )
        }
    </div>
  )
}

export default MarkOrderLikeReturnedWithOutMissedArticles
