import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import axios from "axios";

 const CreateNewArticle = ({updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [bonusClientsPrice, setBonusClientsPrice] = useState("")
  const [stock, setStock] = useState("")
  const [replacementPrice, setReplacementPrice] = useState("")
  const [missedData, setMissedData] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)
  const [errorNumber, setErrorNumber] = useState(false)


  const createArtcile = () => { 
    if(name.length > 0 && price.length > 0 && bonusClientsPrice.length > 0 && stock.length > 0 && replacementPrice.length > 0) { 
      const newArticle = ({ 
        articulo: name,
        precioUnitarioAlquiler: price,
        precioUnitarioReposicion: replacementPrice,
        precioUnitarioBonificados: bonusClientsPrice,
        stock: stock
       })
      axios.post("http://localhost:4000/products/create", newArticle)
           .then((res) => { 
            console.log(res.data)
            setSuccesMessage(true)
            updateList()
            setTimeout(() => { 
              onClose()
              setSuccesMessage(false)
            }, 1800)
           })
           .catch((err) => { 
            console.log(err)
           })
    } else { 
      setMissedData(true)
      setTimeout(() => {
        setMissedData(false)
      }, 1800)
    }
    
  }

  return (
    <>
      <p onClick={onOpen} className="text-zinc-600 font-medium text-sm 2xl:text-md cursor-pointer">Crear Nuevo Articulo</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Articulo</ModalHeader>
              <ModalBody>
               <div className="flex flex-col items-center justify-center">
                 <Input label="Nombre Articulo" variant="underlined" className="w-72" onChange={(e) => setName(e.target.value)}/>

                 <Input label="Precio Alquiler" variant="underlined" className="w-72 mt-2"
                   onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (value > 0 && !isNaN(value)) ) {
                      setPrice(value);
                      setErrorNumber(false)
                    } else {
                      setErrorNumber(true)
                    }
                   }} 
                />      

                 <Input label="Precio Alquiler Bonificados" variant="underlined" className="w-72 mt-2" onChange={(e) => setBonusClientsPrice(e.target.value)}/>
                 <Input label="Precio Reposicion" variant="underlined" className="w-72 mt-2" onChange={(e) => setStock(e.target.value)}/>
                 <Input label="Cantidad a Agregar" variant="underlined" className="w-72 mt-2" onChange={(e) => setReplacementPrice(e.target.value)}/>        
               </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-6">
                <Button className="bg-green-700 font-bold text-white text-sm"  variant="light" onClick={() => createArtcile()}>
                  Crear Articulo
                </Button>
                <Button  className="bg-green-700 font-bold text-white text-sm" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
              {errorNumber ?
              <div className="flex items-center justify-center mt-4 mb-2">
                  <p className="text-sm font-medium text-green-800">Debes ingresar un numero mayor a 0</p>
              </div>  : null}
              {missedData ? 
                <div className="mt-4 mb-4 flex items-center justify-center">
                  <p className="font-medium text-green-700 text-sm">Debes completar todos los campos</p>
                </div>
                :
                null
              }
               {succesMessage ? 
                <div className="mt-4 mb-4 flex items-center justify-center">
                  <p className="font-medium text-green-700 text-sm">Articulo Creado con exito ✔</p>
                </div>
                :
                null
              }
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateNewArticle