import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios"

const CreateProvider = ({updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [name, setName] = useState("")
  const [telephone, setTelephone] = useState("")
  const [email, setEmail] = useState("")
  const [succesMessage, setSuccesMessage] = useState(false)
  const [missedData, setMissedData] = useState(false)

  const createProvider = () => { 
    if(name.length === 0 || telephone.length <= 5 || email.length === 0) { 
      setMissedData(true)
      setTimeout(() => { 
        setMissedData(false)
      }, 1500)
    } else { 
      const providerData = ({ 
        name,
        telephone,
        email,
      })
      axios.post("http://localhost:4000/providers/createProvider", providerData)
           .then((res) => { 
            console.log(res.data)
            setSuccesMessage(true)
            updateList()
            setTimeout(() => { 
              setSuccesMessage(false)
              onClose()
              setName("")
              setTelephone("")
              setEmail("")           
            }, 1800)
           })
           .catch((err) => { 
            console.log(err)
           })
    }
    
  }

  return (
    <div>
        <div className="flex  justify-end items-end">
         <p onClick={onOpen} className="text-zinc-600 font-bold text-sm cursor-pointer">Crear Proveedor +</p>
        </div>       
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-medium">Crear Proveedor</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center"> 
                   <Input type="text" label="Nombre" value={name} variant="bordered" className="w-72" onChange={(e) => setName(e.target.value)}/>
                   <Input type="text" label="Telefono" value={telephone} variant="bordered" className="w-72 mt-2" onChange={(e) => setTelephone(e.target.value)}/>
                   <Input type="text" label="Email" value={email} variant="bordered" className="w-72 mt-2" onChange={(e) => setEmail(e.target.value)}/>                 
                </div>             
              </ModalBody>
              <ModalFooter className="flex gap-6 items-center justify-center">
                <Button  className="bg-green-600 font-bold text-white text-sm"  onClick={() => createProvider()}>
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
                <p className="font-bold text-sm text-green-600">Proveedor creado con Exito ✔</p>
              </div> : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateProvider