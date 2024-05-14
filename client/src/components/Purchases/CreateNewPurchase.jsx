// 1 - Al crear la compra, debo almacenar el gasto, directamente en el endpoint, y el gasto debe tener un reference con el ID de la compra guardada

import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { getMonth, getDate, getDay, getYear, getEveryProviders } from "../../functions/gralFunctions";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import { getProductsClients } from "../../functions/gralFunctions";

const CreateNewPurchase = ({updateList, type}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [allProducts, setAllProducts] = useState([])
  const [filteredNames, setFilteredNames] = useState("")
  const [allProviders, setAllProviders] = useState("")
  const [choosenProductName, setChoosenProductName] = useState("")
  const [choosenProviderName, setChoosenProviderName] = useState("")
  const [choosenProviderId, setChoosenProviderId] = useState("")
  const [choosenProductQuantity, setChoosenProductQuantity] = useState("")
  const [choosenProductValue, setChoosenProductValue] = useState("")
  const [choosenProductId, setChoosenProductId] = useState("")
  const [productsSelected, setProductsSelected] = useState([]);
  const [actualDate, setActualDate] = useState(getDate())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualDay, setActualDay] = useState(getDay())
  const [actualYear, setActualYear] = useState(getYear())
  const [succesPurchase, setSuccesPurchase] = useState(false)
  const [errorNumber, setErrorNumber] = useState(false)
  const userCtx = useContext(UserContext)

  //Funciones para obtener proveedores

  const getProviders = async () => { 
    const data = await getEveryProviders()
    setAllProviders(data)
  }

  useEffect(() => { 
    getProviders()
  }, [])

  const selectProvider = (name, id) => { 
    setChoosenProviderName(name)
    setChoosenProviderId(id)
  }

  useEffect(() => { 
    console.log(choosenProviderId)
    console.log(choosenProviderName)
  }, [choosenProviderId, choosenProviderName])


  //Funciones para obtener productos
  const getClientsProductsData = () => { 
    axios.get("http://localhost:4000/products/productsClients")
          .then((res) => { 
            console.log(res.data)
            setAllProducts(res.data);
          })
          .catch((err) => { 
            console.log(err)
          })
  }

  useEffect(() => { 
    getClientsProductsData()
  }, [])

  const handleInputChange = (e) => { 
    setChoosenProductName(e);
    if(e.length === 0) { 
      setFilteredNames([])
      setChoosenProductName("")
      setChoosenProductId("")
    } else { 
      const useInputToFindTheProduct = allProducts.filter((prod) => prod.articulo.toLowerCase().includes(e))
      setFilteredNames(useInputToFindTheProduct)
      console.log(filteredNames)
    }
  }
  
  const chooseProduct = (name, id) => { 
    console.log("recibi como id a", id)
    setChoosenProductName(name)
    setChoosenProductId(id)
    setFilteredNames("")
  }

  const addProductSelected = (productName, productId, quantity, value ) => {
    const newProduct = { productName, productId, quantity, value };
    setProductsSelected([...productsSelected, newProduct]);
    setChoosenProductId("")
    setChoosenProductName("")
    setChoosenProductQuantity("")
    setChoosenProductValue("")
  };

  const handleRemoveProduct = (productIdToDelete) => {
    console.log(productIdToDelete)
    setProductsSelected((prevProducts) =>
      prevProducts.filter((prod) => prod.productId !== productIdToDelete)
    );
  };


  const createNewPurchase = () => { 

    if(productsSelected.length !== 0 && userCtx.userId !== null && userCtx.userName !== null && productsSelected.reduce((acc, el) => acc + el.value, 0) > 0 && errorNumber !== true) {    

        const newPurchase = ({ 
           date: actualDate,
           day: actualDay,
           month: actualMonth,
           year: actualYear,
           creatorPurchase: userCtx.userName,
           total: productsSelected.reduce((acc, el) => acc + el.value, 0),
           purchaseDetail: productsSelected,
           providerName: choosenProviderName,
           providerId: choosenProviderId

        })

        const newExpense = ({ 
          loadedByName: userCtx.userName,
          loadedById: userCtx.userId,
          typeOfExpense: "Compra",
          amount: productsSelected.reduce((acc, el) => acc + el.value, 0),
          date: actualDate,
          day: actualDay,
          month: actualMonth,
          year: actualYear,
          expenseDetail: productsSelected,
          providerName: choosenProviderName,
          providerId: choosenProviderId
        })

        const combinedData = {
          purchase: newPurchase,
          expense: newExpense
        };

        axios.post("http://localhost:4000/purchases/create", combinedData)
             .then((res) => { 
                console.log(res.data)
                setSuccesPurchase(true)
                setProductsSelected([])
                updateList()
                setTimeout(() => { 
                  onClose()
                  setSuccesPurchase(false)
                }, 2000)
             })
             .catch((err) => { 
                console.log(err)
             })

    
    } else { 
        console.log("productsSelected.length", productsSelected.length)
        console.log("userCtx.userId", userCtx.userId)
        console.log("userCtx.userName", userCtx.userName)
        console.log("suma de products selected", productsSelected.reduce((acc, el) => acc + el.value, 0))
        console.log("productsSelected.length", productsSelected.length)
        console.log("errorNumber", errorNumber)
    }
  } 

  
  const preventMinus = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
 };

  
  

  return (
    <>
    {type === "withOut" ? 
      <Button onClick={onOpen} className="text-white bg-green-800 font-medium text-sm cursor-pointer w-72">Crear Inversion</Button> 
      : <p onClick={onOpen} className="text-zinc-600 font-bold text-sm mr-4 cursor-pointer">Crear Inversion</p> }
       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-md text-zinc-600 font-medium gap-1">Crear Inversion</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">

                  <Select label="Proveedor" className="w-64 2xl:w-72" variant="underlined">
                        {allProviders.map((prov) => (
                          <SelectItem key={prov._id} value={prov.name} onClick={() => selectProvider(prov.name, prov._id)}>
                            {prov.name}
                          </SelectItem>
                        ))}
                  </Select> 

                  <Input 
                  type="text" 
                  value={choosenProductName}
                  className="w-64 2xl:w-72" 
                  variant="underlined" 
                  label="Producto" 
                  onChange={(e) => handleInputChange(e.target.value)}/>

                  <div className="">
                        {
                        filteredNames !== "" ? 
                            <div className='absolute  rounded-xl z-10  shadow-xl bg-white  mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                                {filteredNames.map((prod) => (
                                    <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500 ml-2" key={prod._id} 
                                        onClick={() => chooseProduct(prod.articulo, prod._id)}>
                                         {prod.articulo}
                                    </p>
                                ))}
                            </div>
                        : null
                        }
                    </div> 

                 

                    <Input type="number" 
                    value={choosenProductQuantity} 
                    variant="underlined" 
                    label="Cantidad" 
                    className=" w-64 2xl:w-72" 
                    onKeyPress={preventMinus}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (value > 0 && !isNaN(value)) ) {
                        setChoosenProductQuantity(parseInt(value));
                        setErrorNumber(false)
                      } else {
                        setErrorNumber(true)
                      }
                     }} 
                  /> 
                  

                    <Input 
                    type="number" 
                    value={choosenProductValue} 
                    variant="underlined" 
                    label="Valor $" 
                    className="mt-2 w-64 2xl:w-72" 
                    onKeyPress={preventMinus}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (value > 0 && !isNaN(value)) ) {
                        setChoosenProductValue(parseInt(value));
                        setErrorNumber(false)
                      } else {
                        setErrorNumber(true)
                      }
                     }} 
                    /> 
                 
                       {
                        choosenProductName.length !== 0 && choosenProductQuantity > 0  && choosenProductValue > 0?
                        <Button className="mt-6 w-72 font-medium text-white" color="success" 
                         onClick={() => addProductSelected(choosenProductName, choosenProductId, choosenProductQuantity, choosenProductValue )}>Añadir</Button> 
                        : 
                        null
                      } 

                     {productsSelected.length !== 0 ? 
                         <div className="flex flex-col">
                          <div className="flex flex-col mt-6">
                              {productsSelected.map((prod) => ( 
                                <div className="flex justify-between gap-2 items-center mt-1">
                                  <div className="flex gap-2 items-center">
                                    <p className="text-zinc-500 text-xs"><b>Producto: </b> {prod.productName}</p>
                                    <p className="text-zinc-500 text-xs"><b>Cantidad: </b>{prod.quantity}</p>
                                    <p className="text-zinc-500 text-xs"><b>Valor: </b>{prod.value}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs cursor-pointer" onClick={() => handleRemoveProduct(prod.productId)}>X</p>
                                  </div>
                                  
                                </div>
                              ))}
                          </div>
                          <div className="flex flex-col mt-2">
                            <p className="text-zinc-500 text-xs"> <b>Total Compra: </b>{productsSelected.reduce((acc, el) => acc + el.value, 0)} ARS</p> 
                          </div>
                        </div>  
                        :
                        null
                      }
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-2 mb-4">
              <Button  className="font-medium text-white bg-green-800 w-52" onPress={createNewPurchase}>
                  Confirmar
                </Button>
                <Button  className="font-medium text-white bg-green-800 w-52" onPress={onClose}>
                  Cancelar
                </Button>
          
              </ModalFooter>

            {succesPurchase ? 
              <div className="flex items-center justify-center mt-4 mb-4">
                <p className="font-medium text-green-800 text-sm">Compra realizada con Exito ✔</p>
              </div> : null}

              {errorNumber ? 
              <div className="flex items-center justify-center mt-4 mb-4">
                <p className="font-medium text-green-800 text-sm">Debes ingresar un numero mayor a 0</p>
              </div> : null}

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateNewPurchase



/* 


// 1 - Al crear la compra, debo almacenar el gasto, directamente en el endpoint, y el gasto debe tener un reference con el ID de la compra guardada

import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { getMonth, getDate, getDay, getYear, getEveryProviders } from "../../functions/gralFunctions";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import { getProductsClients } from "../../functions/gralFunctions";

const CreateNewPurchase = ({updateList, type}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [allProducts, setAllProducts] = useState([])
  const [filteredNames, setFilteredNames] = useState("")
  const [allProviders, setAllProviders] = useState("")
  const [choosenProductName, setChoosenProductName] = useState("")
  const [choosenProviderName, setChoosenProviderName] = useState("")
  const [choosenProviderId, setChoosenProviderId] = useState("")
  const [choosenProductQuantity, setChoosenProductQuantity] = useState("")
  const [choosenProductValue, setChoosenProductValue] = useState("")
  const [choosenProductId, setChoosenProductId] = useState("")
  const [productsSelected, setProductsSelected] = useState([]);
  const [actualDate, setActualDate] = useState(getDate())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualDay, setActualDay] = useState(getDay())
  const [actualYear, setActualYear] = useState(getYear())
  const [succesPurchase, setSuccesPurchase] = useState(false)
  const [errorNumber, setErrorNumber] = useState(false)
  const userCtx = useContext(UserContext)

  //Funciones para obtener proveedores

  const getProviders = async () => { 
    const data = await getEveryProviders()
    setAllProviders(data)
  }

  useEffect(() => { 
    getProviders()
  }, [])

  const selectProvider = (name, id) => { 
    setChoosenProviderName(name)
    setChoosenProviderId(id)
  }

  useEffect(() => { 
    console.log(choosenProviderId)
    console.log(choosenProviderName)
  }, [choosenProviderId, choosenProviderName])


  //Funciones para obtener productos
  const getClientsProductsData = () => { 
    axios.get("http://localhost:4000/products/productsClients")
          .then((res) => { 
            console.log(res.data)
            setAllProducts(res.data);
          })
          .catch((err) => { 
            console.log(err)
          })
  }

  useEffect(() => { 
    getClientsProductsData()
  }, [])

  const handleInputChange = (e) => { 
    setChoosenProductName(e);
    if(e.length === 0) { 
      setFilteredNames([])
      setChoosenProductName("")
      setChoosenProductId("")
    } else { 
      const useInputToFindTheProduct = allProducts.filter((prod) => prod.articulo.toLowerCase().includes(e))
      setFilteredNames(useInputToFindTheProduct)
      console.log(filteredNames)
    }
  }
  
  const chooseProduct = (name, id) => { 
    console.log("recibi como id a", id)
    setChoosenProductName(name)
    setChoosenProductId(id)
    setFilteredNames("")
  }

  const addProductSelected = (productName, productId, quantity, value ) => {
    const newProduct = { productName, productId, quantity, value };
    setProductsSelected([...productsSelected, newProduct]);
    setChoosenProductId("")
    setChoosenProductName("")
    setChoosenProductQuantity("")
    setChoosenProductValue("")
  };

  const handleRemoveProduct = (productIdToDelete) => {
    console.log(productIdToDelete)
    setProductsSelected((prevProducts) =>
      prevProducts.filter((prod) => prod.productId !== productIdToDelete)
    );
  };


  const createNewPurchase = () => { 
    if(productsSelected.length !== 0 && userCtx.userId !== null && userCtx.userName !== null && productsSelected.reduce((acc, el) => acc + el.value, 0) > 0 && errorNumber !== true) {    
        const newPurchase = ({ 
           date: actualDate,
           day: actualDay,
           month: actualMonth,
           year: actualYear,
           creatorPurchase: userCtx.userName,
           total: productsSelected.reduce((acc, el) => acc + el.value, 0),
           purchaseDetail: productsSelected,
           providerName: choosenProviderName,
           providerId: choosenProviderId

        })

        const newExpense = ({ 
          loadedByName: userCtx.userName,
          loadedById: userCtx.userId,
          typeOfExpense: "Compra",
          amount: productsSelected.reduce((acc, el) => acc + el.value, 0),
          date: actualDate,
          day: actualDay,
          month: actualMonth,
          year: actualYear,
          expenseDetail: productsSelected,
          providerName: choosenProviderName,
          providerId: choosenProviderId
        })

        axios.post("http://localhost:4000/purchases/create", newPurchase)
             .then((res) => { 
                console.log(res.data)
                setSuccesPurchase(true)
                setProductsSelected([])
                updateList()
                setTimeout(() => { 
                  onClose()
                  setSuccesPurchase(false)
                }, 2000)
             })
             .catch((err) => { 
                console.log(err)
             })

        axios.post("http://localhost:4000/expenses/addNewExpense", newExpense)     
            .then((res) => { 
              console.log(res.data)
            })
            .catch((err) => { 
              console.log(err)
            })
    } else { 
        console.log("agrega productos")
    }
  } 

  
  const preventMinus = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
 };

  
  

  return (
    <>
    {type === "withOut" ? 
      <Button onClick={onOpen} className="text-white bg-green-800 font-medium text-sm cursor-pointer w-72">Crear Inversion</Button> 
      : <p onClick={onOpen} className="text-zinc-600 font-bold text-sm mr-4 cursor-pointer">Crear Inversion</p> }
       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-md text-zinc-600 font-medium gap-1">Crear Inversion</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">

                  <Select label="Proveedor" className="w-64 2xl:w-72" variant="underlined">
                        {allProviders.map((prov) => (
                          <SelectItem key={prov._id} value={prov.name} onClick={() => selectProvider(prov.name, prov._id)}>
                            {prov.name}
                          </SelectItem>
                        ))}
                  </Select> 

                  <Input 
                  type="text" 
                  value={choosenProductName}
                  className="w-64 2xl:w-72" 
                  variant="underlined" 
                  label="Producto" 
                  onChange={(e) => handleInputChange(e.target.value)}/>

                  <div className="">
                        {
                        filteredNames !== "" ? 
                            <div className='absolute  rounded-xl z-10  shadow-xl bg-white  mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                                {filteredNames.map((prod) => (
                                    <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500 ml-2" key={prod._id} 
                                        onClick={() => chooseProduct(prod.articulo, prod._id)}>
                                         {prod.articulo}
                                    </p>
                                ))}
                            </div>
                        : null
                        }
                    </div> 

                 

                    <Input type="number" 
                    value={choosenProductQuantity} 
                    variant="underlined" 
                    label="Cantidad" 
                    className=" w-64 2xl:w-72" 
                    onKeyPress={preventMinus}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (value > 0 && !isNaN(value)) ) {
                        setChoosenProductQuantity(parseInt(value));
                        setErrorNumber(false)
                      } else {
                        setErrorNumber(true)
                      }
                     }} 
                  /> 
                  

                    <Input 
                    type="number" 
                    value={choosenProductValue} 
                    variant="underlined" 
                    label="Valor $" 
                    className="mt-2 w-64 2xl:w-72" 
                    onKeyPress={preventMinus}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (value > 0 && !isNaN(value)) ) {
                        setChoosenProductValue(parseInt(value));
                        setErrorNumber(false)
                      } else {
                        setErrorNumber(true)
                      }
                     }} 
                    /> 
                 
                       {
                        choosenProductName.length !== 0 && choosenProductQuantity > 0  && choosenProductValue > 0?
                        <Button className="mt-6 w-72 font-medium text-white" color="success" 
                         onClick={() => addProductSelected(choosenProductName, choosenProductId, choosenProductQuantity, choosenProductValue )}>Añadir</Button> 
                        : 
                        null
                      } 

                     {productsSelected.length !== 0 ? 
                         <div className="flex flex-col">
                          <div className="flex flex-col mt-6">
                              {productsSelected.map((prod) => ( 
                                <div className="flex justify-between gap-2 items-center mt-1">
                                  <div className="flex gap-2 items-center">
                                    <p className="text-zinc-500 text-xs"><b>Producto: </b> {prod.productName}</p>
                                    <p className="text-zinc-500 text-xs"><b>Cantidad: </b>{prod.quantity}</p>
                                    <p className="text-zinc-500 text-xs"><b>Valor: </b>{prod.value}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs cursor-pointer" onClick={() => handleRemoveProduct(prod.productId)}>X</p>
                                  </div>
                                  
                                </div>
                              ))}
                          </div>
                          <div className="flex flex-col mt-2">
                            <p className="text-zinc-500 text-xs"> <b>Total Compra: </b>{productsSelected.reduce((acc, el) => acc + el.value, 0)} ARS</p> 
                          </div>
                        </div>  
                        :
                        null
                      }
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-2 mb-4">
              <Button  className="font-medium text-white bg-green-800 w-52" onPress={createNewPurchase}>
                  Confirmar
                </Button>
                <Button  className="font-medium text-white bg-green-800 w-52" onPress={onClose}>
                  Cancelar
                </Button>
          
              </ModalFooter>

            {succesPurchase ? 
              <div className="flex items-center justify-center mt-4 mb-4">
                <p className="font-medium text-green-800 text-sm">Compra realizada con Exito ✔</p>
              </div> : null}

              {errorNumber ? 
              <div className="flex items-center justify-center mt-4 mb-4">
                <p className="font-medium text-green-800 text-sm">Debes ingresar un numero mayor a 0</p>
              </div> : null}

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateNewPurchase



*/