import React from 'react'
import { Input } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import axios from 'axios'
import { formateInputPrice } from '../../functions/gralFunctions'

const EditCollection = ({collectionData, closeModalNow, updateCollectionList}) => {

    const [collectionAmount, setCollectionAmount] = useState(formateInputPrice(collectionData.amount))
    const [succesMessage, setSuccesMessage] = useState(false)

    const changeCollection = () => { 
        const newAmount = ({ 
           amount: collectionAmount
        })
        axios.put(`http://localhost:4000/collections/changeData/${collectionData.id}`, newAmount)
             .then((res) => { 
              console.log(res.data)
              setSuccesMessage(true)
              updateCollectionList()
              setTimeout(() => { 
                setSuccesMessage(false)
                closeModalNow()
              }, 1500)
             })
             .catch((err) => { 
              console.log(err)
             })
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
                      <Button className="font-bold text-white bg-green-800 text-sm w-52" onClick={() => changeCollection()}>Confirmar Cambios</Button>
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
