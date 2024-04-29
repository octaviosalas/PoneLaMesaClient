import { Button, Input } from '@nextui-org/react'
import React, { useEffect } from 'react'

const EditSublet = ({subletData, closeModalNow}) => {

    useEffect(() => { 
        console.log(subletData)
        console.log(subletData.used)
    }, [subletData])

  return (

    <>
    {subletData.used === true ? 
      <div className='flex flex-col items-center jsutify-center'>
          <p className='text-sm text-zinc-600'>El Sub Alquiler ya fue derivado a una orden. No es posible editarlo</p>
          <Button className='bg-green-800 text-white font-medium w-60 mt-4 mb-2'  onClick={() => closeModalNow()}>Cerrar</Button>
      </div> 
    :
    <div>
          {subletData.productsDetail.map((sub) => ( 
              <div className='flex items-center gap-6'>
                  <p className='font-medium text-zinc-800 text-sm'>{sub.productName}</p>
                  <Input label="Cantidad" variant="underlined" className='w-32' value={sub.quantity}/>
              </div>
          ))}
          <div className='mt-2'>
              <Input type="text" variant="underlined" className='w-full' label="Total" value={subletData.amount}
              startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }/>
          </div>
          <div className='flex items-center justify-center gap-4 mt-4 mb-2'>
            <Button className='bg-green-800 text-white font-medium w-32'>Confirmar</Button>
            <Button className='bg-green-800 text-white font-medium w-32' onClick={() => closeModalNow()}>Cancelar</Button>
          </div>
      </div>    }
    </>

  )
}

export default EditSublet
