import React from 'react'
import { useState } from 'react'
import { Input, Button, Select, SelectItem } from '@nextui-org/react'
import axios from "axios"

const EditClient = ({clientData, updateChanges, closeModalNow}) => {

    const [newClientName, setNewClientName] = useState(clientData.name)
    const [newClientTelephone, setNewClientTelephone] = useState(clientData.telephone)
    const [newClientDni, setNewClientDni] = useState(clientData.dni)
    const [newClientHome, setNewClientHome] = useState(clientData.home)
    const [newClientTypeOf, setNewClientTypeOf] = useState(clientData.typeOfClient)
    const [succesChangesClient, setSuccesChangesClient] = useState(false)

    const changeClientData = () => { 
        const newData = ({ 
            client: newClientName,
            telephone: newClientTelephone,
            clientDni: newClientDni,
            home: newClientHome,
            typeOfClient: newClientTypeOf
        })
        axios.put(`http://localhost:4000/clients/changeData/${clientData.id}`, newData)
            .then((res) => { 
                console.log(res.data)
                setSuccesChangesClient(true)
                updateChanges()
                setTimeout(() => { 
                setSuccesChangesClient(false)
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
              <Input type="text" className="mt-2 w-60" label="Cliente" value={newClientName} onChange={(e) => setNewClientName(e.target.value)}/>
              <Input type="text" className="mt-2 w-60" label="Telefono" value={newClientTelephone} onChange={(e) => setNewClientTelephone(e.target.value)}/>
              <Input type="text" className="mt-2 w-60" label="DNI" value={newClientDni} onChange={(e) => setNewClientDni(e.target.value)}/>
              <Input type="text" className="mt-2 w-60" label="Direccion" value={newClientHome} onChange={(e) => setNewClientHome(e.target.value)}/>
              <Select label="Tipo de Cliente" value={newClientTypeOf} variant="underlined" className="w-60 mt-2 rounded-xl">
                      <SelectItem onClick={() => setNewClientTypeOf("Bonificado")}>Bonificado</SelectItem>
                      <SelectItem onClick={() => setNewClientTypeOf("No Bonificado")}>No Bonificado</SelectItem>
                </Select>          
                
              <div className="flex items-center justify-center gap-4 mt-4 mb-4">
                <Button className="font-bold text-white bg-green-800 text-sm w-52" onClick={() => changeClientData()}>Confirmar Cambios</Button>
                <Button className="font-bold text-white bg-green-600 text-sm w-52" onPress={closeModalNow}>Cancelar</Button>
              </div>
             {succesChangesClient ?
              <div className="flex items-center justify-center mb-2 mt-2">
                  <p className="font-bold text-green-800 text-sm">Cambios almacenados con Exito ✔</p>
              </div> : null}
          </div>
</div>
  )
}

export default EditClient
