import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, SelectItem, Select} from "@nextui-org/react";
import axios from "axios";
import { productCategorys } from "../../functions/gralFunctions";

 const CreateNewArticle = ({updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [bonusClientsPrice, setBonusClientsPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("")
  const [replacementPrice, setReplacementPrice] = useState("")
  const [missedData, setMissedData] = useState(false)
  const [errorInNumberText, setErrorInNumberText] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)
  const [errorNumber, setErrorNumber] = useState(false)
  const [categoryError, setCategoryError] = useState(false)


  const createArtcile = () => { 
    if(name.length > 0 && price.length > 0 && bonusClientsPrice.length > 0 && stock.length > 0 && replacementPrice.length > 0 && errorInNumberText === false && category.length > 0) { 
      const newArticle = ({ 
        articulo: name,
        precioUnitarioAlquiler: price,
        precioUnitarioReposicion: replacementPrice,
        precioUnitarioBonificados: bonusClientsPrice,
        stock: stock,
        Categoria: category
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
    } else if (errorInNumberText === true){ 
      setErrorInNumberText(true)
      setTimeout(() => {
        setMissedData(false)
      }, 1800)
    } else { 
      setMissedData(true)
      setTimeout(() => {
        setMissedData(false)
      }, 1800)
    }
    
  }

  const preventMinus = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
 };

 useEffect(() => { 
  console.log(category)
 }, [category])

 useEffect(() => { 
  console.log(category)
 }, [])


 

  return (
    <>
      <p onClick={onOpen} className="text-black font-medium text-sm 2xl:text-md cursor-pointer">Crear Nuevo Articulo</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Articulo</ModalHeader>
              <ModalBody>
               <div className="flex flex-col items-center justify-center">
                 <Input label="Nombre Articulo" variant="underlined" className="w-72" onChange={(e) => setName(e.target.value)}/>

                 <Input label="Precio Alquiler" type="number" variant="underlined" className="w-72 mt-2"   
                   onKeyPress={preventMinus}
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

                 <Input label="Precio Alquiler Bonificados" type="number" variant="underlined" className="w-72 mt-2"
                  onKeyPress={preventMinus}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (value > 0 && !isNaN(value)) ) {
                      setBonusClientsPrice(value);
                      setErrorNumber(false)
                    } else {
                      setErrorNumber(true)
                    }
                   }} 
                />     
                 <Input label="Precio Reposicion" type="number" variant="underlined" className="w-72 mt-2"  
                    onKeyPress={preventMinus}
                   onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (value > 0 && !isNaN(value)) ) {
                      setReplacementPrice(value);
                      setErrorNumber(false)
                    } else {
                      setErrorNumber(true)
                    }
                   }} 
                />     
                 <Input label="Cantidad a Agregar" type="number" variant="underlined" className="w-72 mt-2"
                  onKeyPress={preventMinus}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (value > 0 && !isNaN(value)) ) {
                      setStock(value);
                      setErrorNumber(false)
                    } else {
                      setErrorNumber(true)
                    }
                   }} 
                />    

               <Select label="Categoria" variant="underlined" className="w-72 mt-2" >
                    {productCategorys.map((prod) => (
                      <SelectItem key={prod.value} value={prod.value} onClick={() => setCategory(prod.value)}>
                        {prod.value}
                      </SelectItem>
                    ))}
              </Select>  

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
              {categoryError ? 
                <div className="mt-4 mb-4 flex items-center justify-center">
                  <p className="font-medium text-green-700 text-sm">La categoria del articulo debe ser "deposito" o "local"</p>
                </div>
                :
                null
              }

              {errorInNumberText ? 
                  <div className="mt-4 mb-4 flex items-center justify-center">
                    <p className="font-medium text-green-700 text-sm">Debes ingresar un numero mayor a 0</p>
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