import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios"

const CreateNewClient = ({type, updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [name, setName] = useState("")
  const [telephone, setTelephone] = useState("")
  const [dni, setDni] = useState("")
  const [home, setHome] = useState("")
  const [zone, setZone] = useState("")
  const [typeOfClient, setTypeOfClient] = useState("")
  const [succesMessage, setSuccesMessage] = useState(false)
  const [missedData, setMissedData] = useState(false)

  const createClient = () => { 
    if(name.length === 0 || telephone.length <= 5 || dni.length <= 5 || typeOfClient.length === 0 || zone.length === 0) { 
      setMissedData(true)
      setTimeout(() => { 
        setMissedData(false)
      }, 1500)
    } else { 
      const clientData = ({ 
        name,
        telephone,
        dni,
        home,
        typeOfClient,
        zone
      })
      axios.post("http://localhost:4000/clients/createClient", clientData)
           .then((res) => { 
            console.log(res.data)
            setSuccesMessage(true)
            updateList()
            setTimeout(() => { 
              setSuccesMessage(false)
              onClose()
              setName("")
              setTelephone("")
              setDni("")
              setHome("")
              setTypeOfClient("")
            }, 1800)
           })
           .catch((err) => { 
            console.log(err)
           })
    }
    
  }

  
  return (
    <div>
     {
       type === "creatingOrder" ?
        <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Crear Cliente</p> 
        :
        <div className="flex justify-end items-end">
         <p onClick={onOpen} className="text-green-zinc-700 font-bold text-sm cursor-pointer">Crear Cliente +</p>
        </div>

        }
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-medium">Crear Cliente</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center"> 
                   <Input type="text" variant="underlined" label="Nombre" value={name} className="w-72" onChange={(e) => setName(e.target.value)}/>
                   <Input type="text" variant="underlined" label="Telefono" value={telephone} className="w-72 mt-2" onChange={(e) => setTelephone(e.target.value)}/>
                   <Input type="text" variant="underlined" label="Dni" value={dni} className="w-72 mt-2" onChange={(e) => setDni(e.target.value)}/>
                   <Input type="text" variant="underlined" label="Direccion" value={home} className="w-72 mt-2" onChange={(e) => setHome(e.target.value)}/>
                   <Input type="text" variant="underlined" label="Zona" value={zone} className="w-72 mt-2" onChange={(e) => setZone(e.target.value)}/>
                   <Select label="Tipo de Cliente"  variant="underlined" value={typeOfClient} className="w-72 mt-2 "  style={{ border: 'none' }}>
                      <SelectItem onClick={() => setTypeOfClient("Bonificado")}>Bonificado</SelectItem>
                      <SelectItem onClick={() => setTypeOfClient("No Bonificado")}>No Bonificado</SelectItem>
                   </Select>
                </div>             
              </ModalBody>
              <ModalFooter className="flex gap-6 items-center justify-center">
                <Button  className="bg-green-600 font-bold text-white text-sm"  onClick={() => createClient()}>
                  Confirmar
                </Button>
                <Button  className="bg-green-600 font-bold text-white text-sm" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>

             {missedData ?
              <div className="flex items-center justify-center mt-4 mb-4">
                <p className="font-bold text-sm text-green-600">Debes completar los datos faltantes</p>
              </div> : null}

              {succesMessage ?
              <div className="flex items-center justify-center mt-4 mb-4">
                <p className="font-bold text-sm text-green-600">Cliente creado con Exito ✔</p>
              </div> : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateNewClient