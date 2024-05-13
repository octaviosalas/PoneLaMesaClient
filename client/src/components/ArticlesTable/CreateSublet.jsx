import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem, User, Textarea} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { formatePrice, getEveryProviders, getProductsClients, getDate, getDay, getMonth, getYear } from "../../functions/gralFunctions";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";

const CreateSublet = ({usedIn, updateTable, closeBothModals}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure()
  const userCtx = useContext(UserContext)
  const [everyArticles, setEveryArticles] = useState([])
  const [productsChoosen, setProductsChoosen] = useState([])
  const [productChoosenName, setProductChoosenName] = useState("")
  const [productChoosenReplacementPrice, setProductChoosenReplacementPrice] = useState("")
  const [productChoosenQuantity, setProductChoosenQuantity] = useState("")
  const [productChoosenId, setProductChoosenId] = useState("")
  const [productChoosenPrice, setProductChoosenPrice] = useState(0)
  const [productChoosenValue, setProductChoosenValue] = useState(null)
  const [providerChoosen, setProviderChoosen] = useState(null)
  const [providerChoosenId, setProviderChoosenId] = useState(null)
  const [filteredNames, setFilteredNames] = useState([])
  const [allProviders, setAllProviders] = useState([])
  const [actualDate, setActualDate] = useState(getDate())
  const [actualDay, setActualDay] = useState(getDay())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())
  const [missedData, setMissedData] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [succesMessage, setSuccesMessage] = useState(false)
  const [showObservation, setShowObservation] = useState(false)
  const [observation, setObservation] = useState("")
  const [productDoesNotExist, setProductDoesNotExist] = useState(false)
  const [missedProductExisted, setMissedProductExisted] = useState(false)
  const [errorInQuantity, setErrorInQuantity] = useState(false)
  const [errorInProductChoosenValue, setErrorInProductChoosenValue] = useState(false)

    //Funciones para obtener proveedores
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
        setFilteredNames([])
        setProductChoosenName("")
        setProductChoosenId("")
      } else { 
        const useInputToFindTheArticle = everyArticles.filter((cc) => cc.articulo.toLowerCase().includes(e))
        if(useInputToFindTheArticle.length > 0) { 
          setFilteredNames(useInputToFindTheArticle)
          console.log(useInputToFindTheArticle)
          setProductDoesNotExist(false)
        } else { 
          console.log("Agrega al producto")
          setProductDoesNotExist(true)
          setFilteredNames([])
        }
       
      } 
    }


    const chooseArticle = (name, id, price, replacementPrice) => { 
      const roundedPrice = Math.round(parseFloat(price));
      console.log("Elegiste", name, id, price)
      console.log(roundedPrice)
      setProductChoosenName(name)
      setProductChoosenId(id)
      setFilteredNames([])
      setProductChoosenPrice(price)
      setProductChoosenReplacementPrice(replacementPrice)
    }
    
    const addProductSelected = (productName, productId, quantity, price, value, replacementPrice) => {
        if(productDoesNotExist) { 
          setMissedProductExisted(true)
          setTimeout(() => { 
            setMissedProductExisted(false)
            setProductChoosenId("")
            setProductChoosenName("")
            setProductChoosenQuantity("")
            setProductChoosenValue("")
            setProductDoesNotExist(false)
          }, 1600)
        } else { 
          const rentalPrice = Math.round(parseFloat(price));
          console.log("tipo de dato", typeof rentalPrice)
          const numericPrice = parseFloat(value); 
          console.log("numeric price", numericPrice)
          const numericQuantity = parseFloat(quantity); 
          const numericReplacement = parseFloat(replacementPrice); 
          const newProduct = { productName, productId, quantity: numericQuantity, rentalPrice, value: numericPrice, replacementPrice: numericReplacement };
          setProductsChoosen([...productsChoosen, newProduct]);
          setProductChoosenId("")
          setProductChoosenValue("")
          setProductChoosenPrice(0)
          setProductChoosenQuantity("")
          setProductChoosenName("")
          setProductChoosenReplacementPrice("")
          console.log(productsChoosen)
        }
     
    };
    
    const handleRemoveProduct = (productIdToDelete) => {
      setProductsChoosen((prevProducts) =>
        prevProducts.filter((prod) => prod.productId !== productIdToDelete)
      );
    };


    const addNewSublet = async () => { 
      const newSubletData = ({ 
        productsDetail: productsChoosen,
        amount: productsChoosen.reduce((acc, el) => acc + el.value, 0),
        provider: providerChoosen,
        providerId: providerChoosenId,
        day: actualDay,
        month: actualMonth,
        year: actualYear,
        date: actualDate,
        used: false,
        observation: observation,
            expenseData: {
              loadedByName: userCtx.userName,
              loadedById: userCtx.userId,
              typeOfExpense: "Sub Alquiler",
              amount: productsChoosen.reduce((acc, el) => acc + el.value, 0),
              date: actualDate,
              day: actualDay,
              month: actualMonth,
              year: actualYear,
              expenseDetail: productsChoosen,
              providerName: providerChoosen,
              providerId: providerChoosenId,
          }
      })

      if(userCtx.userId.length <= 0) { 
        setMissedData(true)
        setErrorText("Debes iniciar Sesion para almacenar un SubAlquiler")
        setTimeout(() => { 
          setMissedData(false)
        }, 1500)
      } else if (providerChoosen === null  || providerChoosenId === null || productsChoosen.reduce((acc, el) => acc + el.price, 0) <= 0  || productsChoosen.length === 0) { 
        setMissedData(true)
        setErrorText("Faltan datos para completar el proceso")
        setTimeout(() => { 
          setMissedData(false)
        }, 1500)
      } else if (productDoesNotExist) { 
        setMissedProductExisted(true)
        setTimeout(() => { 
          setMissedProductExisted(false)
        }, 1800)
      } 
      else  { 
        axios.post("http://localhost:4000/sublets", newSubletData)
        .then((res) => { 
          console.log(res.data)
          setSuccesMessage(true)
              if(usedIn === "withOutSubletsToUse") { 
                closeBothModals()
                updateTable()
              }
              setTimeout(() => { 
                setSuccesMessage(false)
                onClose()
              }, 1500)
            })
        .catch((err) =>
          console.log(err)
        )  
      }   
      
    }

    useEffect(() => { 
      console.log(productsChoosen)
    }, [productsChoosen])

  return (
    <>
      <p className="text-sm font-medium text-black cursor-pointer" onClick={handleOpen}>Sub Alquilar Articulos</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-max">
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
                                        onClick={() => chooseArticle(cc.articulo, cc._id, cc.precioUnitarioAlquiler, cc.precioUnitarioReposicion)}>
                                        {cc.articulo}
                                    </p>
                                ))}
                            </div>
                        : null
                        }
                    </div>  
                   
                     {productDoesNotExist ?
                     <div className="flex justify-start text-start">
                        <p className="text-zinc-600 text-xs font-medium">Debes agregar el producto</p>
                     </div>  : null}


                     <Input 
                        label="Cantidad" 
                        type="number" 
                        className="mt-2" 
                        value={productChoosenQuantity} 
                        variant="underlined" 
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (value > 0 && !isNaN(value))) {
                              setProductChoosenQuantity(value);
                              setErrorInQuantity(false)
                            } else {
                              setErrorInQuantity(true)
                            }
                        }} 
                        />

                        {errorInQuantity ? <p className="text-xs text-zinc-700 font-medium">Debes ingresar un numero mayor a 0</p> : null}

                        <Input 
                        label="Monto total Gastado" 
                        type="number" 
                        className="mt-2" 
                        value={productChoosenValue} 
                        variant="underlined" 
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (value > 0 && !isNaN(value))) {
                            setProductChoosenValue(value);
                            setErrorInProductChoosenValue(false)
                          } else {
                            setErrorInProductChoosenValue(true)
                          }
                      }} 
                      />
                        

                        {errorInProductChoosenValue ? <p className="text-xs text-zinc-700 font-medium">Debes ingresar un numero mayor a 0</p> : null}

                     {
                        productChoosenName.length !== 0 && productChoosenQuantity.length !== 0  && productChoosenValue > 0?
                        <Button className="mt-6 w-52 font-medium text-white" color="success" 
                         onClick={() => addProductSelected(productChoosenName, productChoosenId, productChoosenQuantity, productChoosenPrice, productChoosenValue, productChoosenReplacementPrice )}>Añadir</Button> 
                        : 
                        null
                      }
                      {productsChoosen.length !== 0 ? 
                         <div className="flex flex-col w-full">
                          <div className="flex flex-col mt-6">
                              {productsChoosen.map((prod) => ( 
                                <div className="flex justify-between gap-4 items-center mt-1" key={prod._id}>
                                  <div className="flex gap-2 items-center">
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Producto: </b> {prod.productName}</p>
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Cantidad: </b>{prod.quantity}</p>
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Total: </b>{prod.value}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs cursor-pointer" onClick={() => handleRemoveProduct(prod.productId)}>X</p>
                                  </div>                               
                                </div>
                              ))}
                          </div>
                            <div className="flex flex-col mt-2">
                              <p className="text-zinc-500 text-xs"> <b>Total: </b>{formatePrice(productsChoosen.reduce((acc, el) => acc + el.value, 0))} ARS</p> 
                               {showObservation ? 
                                <p className="mt-2 font-medium text-green-800 cursor-pointer text-sm underline" onClick={() => setShowObservation(false)}>
                                 Cancelar Observaciones
                                </p>
                                 : 
                                 <p className="mt-2 font-medium text-green-800 cursor-pointer text-sm underline" onClick={() => setShowObservation(true)}>Asentar Observacion</p>}
                            </div>
                          {showObservation ?
                            <div>
                                  <Textarea
                                    isRequired
                                    label="Observacion"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    className="max-w-full"
                                    onChange={(e) => setObservation(e.target.value)}
                                  />
                            </div> : null}
                        </div>  
                        :
                        null
                      }
              </ModalBody>
                  <ModalFooter className="mt-2 flex items-center justify-center">
                    <Button className="bg-green-800 w-52 text-white font-medium text-sm"   onClick={() => addNewSublet()}>
                      Confirmar
                    </Button>
                    <Button className="bg-green-800 w-52 text-white font-medium text-sm"  onPress={onClose}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                  
                  <div className="mt-2 mb-4 flex items-center justify-center">
                     {missedData ? <p className="text-green-800 font-medium text-sm mt-6">{errorText}</p> : null}
                     {missedProductExisted ? <p className="text-green-800 font-medium text-sm mt-6">Debes ingresar un Articulo existente</p> : null}
                     {succesMessage ? <p className="text-green-800 font-medium text-sm mt-6"> SubAlquiler Creado con exito</p> : null}
                  </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateSublet

