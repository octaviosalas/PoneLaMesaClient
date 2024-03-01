import React from 'react'
import { Input } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import axios from 'axios'

const EditProvider = ({providerData, closeModalNow, updateChangesProviders}) => {

    const [providerName,setProviderName] = useState(providerData.name)
    const [providerTelephone, setNewProviderTelephone] = useState(providerData.telephone)
    const [providerEmail, setProviderEmail] = useState(providerData.email)
    const [succesChangesProvider, setSuccesChangesProvider] = useState(false)

    const changeProviderData = () => { 
        const newProviderData = ({ 
          name: providerName,
          telephone: providerTelephone,
          email: providerEmail,
        })
        axios.put(`http://localhost:4000/providers/changeData/${providerData.id}`, newProviderData)
             .then((res) => { 
              console.log(res.data)
              setSuccesChangesProvider(true)
              updateChangesProviders()
              setTimeout(() => { 
                setSuccesChangesProvider(false)
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
                    <Input type="text" className="mt-2 w-60" label="Proveedor" value={providerName} onChange={(e) => setProviderName(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Telefono" value={providerTelephone} onChange={(e) => setNewProviderTelephone(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Email" value={providerEmail} onChange={(e) => setProviderEmail(e.target.value)}/>
                    <div className="flex items-center justify-center gap-4 mt-4 mb-4">
                      <Button className="font-bold text-white bg-green-800 text-sm w-52" onClick={() => changeProviderData()}>Confirmar Cambios</Button>
                      <Button className="font-bold text-white bg-green-600 text-sm w-52" onPress={closeModalNow}>Cancelar</Button>
                    </div>
                   {succesChangesProvider ?
                    <div className="flex items-center justify-center mb-2 mt-2">
                        <p className="font-bold text-green-800 text-sm">Cambios almacenados con Exito ✔</p>
                    </div> : null}
                </div>
    </div>
  )
}

export default EditProvider
