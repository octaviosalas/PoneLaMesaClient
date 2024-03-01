import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { formatePrice, getEveryProviders, getProductsClients, getDate, getDay, getMonth, getYear } from "../../functions/gralFunctions";

const CreateSublet = () => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [everyArticles, setEveryArticles] = useState([])
  const [productsChoosen, setProductsChoosen] = useState([])
  const [productChoosenName, setProductChoosenName] = useState("")
  const [productChoosenQuantity, setProductChoosenQuantity] = useState("")
  const [productChoosenId, setProductChoosenId] = useState("")
  const [productChoosenValue, setProductChoosenValue] = useState(null)
  const [providerChoosen, setProviderChoosen] = useState(null)
  const [providerChoosenId, setProviderChoosenId] = useState(null)
  const [filteredNames, setFilteredNames] = useState([])
  const [allProviders, setAllProviders] = useState([])
  const [actualDate, setActualDate] = useState(getDate())
  const [actualDay, setActualDay] = useState(getDay())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())

    const getProviders = async () => { 
      const data = await getEveryProviders()
      setAllProviders(data)
    }

    useEffect(() => { 
      getProviders()
    }, [])

    const selectProvider = (name, id) => { 
      setProviderChoosen(name)
      setProviderChoosenId(id)
    }

    const handleOpen = async () => { 
      onOpen();
      const articulos = await getProductsClients()
      setEveryArticles(articulos)
    }

    useEffect(() => { 
      console.log(everyArticles)
    }, [everyArticles])

    const handleProductChange = (e) => { 
      setProductChoosenName(e)
      if(e.length === 0) { 
        filteredNames([])
        setProductChoosenName("")
        setProductChoosenId("")
      } else { 
        const useInputToFindTheArticle = everyArticles.filter((cc) => cc.articulo.toLowerCase().includes(e))
        setFilteredNames(useInputToFindTheArticle)
        console.log(useInputToFindTheArticle)
      }
    }

    const chooseArticle = (name, id) => { 
      console.log("Elegiste", name, id)
      setProductChoosenName(name)
      setProductChoosenId(id)
      setFilteredNames([])
    }
    
    const addProductSelected = (productName, productId, quantity, price) => {
        const numericPrice = parseFloat(price); 
        const numericQuantity = parseFloat(quantity); 
        console.log(typeof numericPrice)
        console.log(typeof numericQuantity)
        const newProduct = { productName, productId, quantity: numericQuantity, price: numericPrice };
        setProductsChoosen([...productsChoosen, newProduct]);
        setProductChoosenId("")
        setProductChoosenValue(0)
        setProductChoosenQuantity("")
        setProductChoosenName("")
    };
    
    const handleRemoveProduct = (productIdToDelete) => {
      setProductsChoosen((prevProducts) =>
        prevProducts.filter((prod) => prod.productId !== productIdToDelete)
      );
    };

    const addNewSublet = () => { 
      const newSubletData = ({ 
        productsDetail: productsChoosen,
        amount: productsChoosen.reduce((acc, el) => acc + el.price, 0),
        provider: providerChoosen,
        providerId: providerChoosenId,
        day: actualDay,
        month: actualMonth,
        year: actualYear,
        date: actualDate,
      })
      axios.post("http://localhost:4000/sublets")
          .then((res) => { 
            console.log(res.data)
          })
          .catch((err) => console.log(err))  
    }

  return (
    <>
      <p className="text-sm font-medium text-zinc-600 cursor-pointer" onClick={handleOpen}>Sub Alquilar Articulos</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">SubAlquilar Articulos</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">      
                <Select label="Proveedor" className="max-w-full" variant="underlined">
                    {allProviders.map((prov) => (
                      <SelectItem key={prov._id} value={prov.name} onClick={() => selectProvider(prov.name, prov._id)}>
                        {prov.name}
                      </SelectItem>
                    ))}
              </Select>   
                 <Input label="Producto" type="text" variant="underlined" value={productChoosenName} onChange={(e) => handleProductChange(e.target.value)}/>  
                  <div className="">
                      {
                        filteredNames !== "" ? 
                            <div className='absolute  rounded-xl z-10  shadow-xl bg-white  mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                                {filteredNames.map((cc) => (
                                    <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500 ml-2" key={cc._id} 
                                        onClick={() => chooseArticle(cc.articulo, cc._id)}>
                                        {cc.articulo}
                                    </p>
                                ))}
                            </div>
                        : null
                        }
                    </div>  
                   <Input label="Cantidad" type="number" className="mt-2" value={productChoosenQuantity} variant="underlined" onChange={(e) => setProductChoosenQuantity(e.target.value)}/>  
                   <Input label="Precio Total" type="number" className="mt-2" value={productChoosenValue} variant="underlined" onChange={(e) => setProductChoosenValue(e.target.value)}/>  
                     {
                        productChoosenName.length !== 0 && productChoosenQuantity.length !== 0  && productChoosenValue !== null?
                        <Button className="mt-6 w-52 font-medium text-white" color="success" 
                         onClick={() => addProductSelected(productChoosenName, productChoosenId, productChoosenQuantity, productChoosenValue )}>Añadir</Button> 
                        : 
                        null
                      }
                      {productsChoosen.length !== 0 ? 
                         <div className="flex flex-col">
                          <div className="flex flex-col mt-6">
                              {productsChoosen.map((prod) => ( 
                                <div className="flex justify-between gap-4 items-center mt-1" key={prod._id}>
                                  <div className="flex gap-2 items-center">
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Producto: </b> {prod.productName}</p>
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Cantidad: </b>{prod.quantity}</p>
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Precio Total Alquiler: </b>{prod.price}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs cursor-pointer" onClick={() => handleRemoveProduct(prod.productId)}>X</p>
                                  </div>
                                  
                                </div>
                              ))}
                          </div>
                          <div className="flex flex-col mt-2">
                            <p className="text-zinc-500 text-xs"> <b>Total: </b>{formatePrice(productsChoosen.reduce((acc, el) => acc + el.price, 0))} ARS</p> 
                          </div>
                        </div>  
                        :
                        null
                      }
              </ModalBody>
              <ModalFooter className="mt-4 flex items-center justify-center">
                <Button className="bg-green-800 w-52 text-white font-medium text-sm"   onClick={() => console.log(productsChoosen)}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 w-52 text-white font-medium text-sm"  onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateSublet
