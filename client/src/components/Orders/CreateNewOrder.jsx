import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import { getDate, getMonth, getYear, getDay } from "../../functions/gralFunctions";

const CreateNewOrder = ({updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const userCtx = useContext(UserContext)
  const [actualDate, setActualDate] = useState(getDate())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())
  const [actualDay, setActualDay] = useState(getDay())
  const [firstStep, setFirstStep] = useState(true)
  const [secondStep, setSecondStep] = useState(false)
  const [missedData, setMissedData] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [orderStatus, setOrderStatus] = useState("No entregado")
  const [clientName, setClientName] = useState("")
  const [typeOfClient, setTypeOfClient] = useState("")
  const [placeOfDelivery, setPlaceOfDelivery] = useState("")
  const [dateOfDelivery, setDateOfDelivery] = useState("")
  const [returnPlace, setReturnPlace] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [allProducts, setAllProducts] = useState("")
  const [filteredNames, setFilteredNames] = useState("")
  const [choosenProductName, setChoosenProductName] = useState("")
  const [choosenProductQuantity, setChoosenProductQuantity] = useState("")
  const [choosenProductId, setChoosenProductId] = useState("")
  const [choosenProductPrice, setChoosenProductPrice] = useState("")
  const [choosenProductPriceReplacement, setChoosenProductPriceReplacement] = useState("")
  const [productsSelected, setProductsSelected] = useState([]);


      const typeOfClients = [
        {
          label: "No Bonificado",
          value: "No Bonificado"
        },
        {
          label: "Bonificado",
          value: "Bonificado"
        },
      ]

      const closeModal = () => { 
        onClose()
        setProductsSelected([])
        setSuccesMessage(false)
        setFirstStep(true)
        setSecondStep(false)
        setTypeOfClient("")
        setClientName("")
        setReturnDate("")
        setReturnPlace("")
        setDateOfDelivery("")
        setPlaceOfDelivery("")

      }

      const changeState = (first, second) => { 
        setSecondStep(first)
        setFirstStep(second)
      }

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

    const executeFunctionDependsTypeOfClient = () => { 
        if(orderNumber.length === 0  || clientName.length === 0 || typeOfClient.length === 0 || placeOfDelivery.length === 0 || dateOfDelivery.length === 0 || returnDate.length === 0) { 
          setMissedData(true)
          setTimeout(() => { 
            setMissedData(false)
          }, 2000)
        } else { 
          changeState(true, false)
          getClientsProductsData()
     
        }

    }

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

    const chooseProduct = (name, id, price, replacementPrice) => { 
      console.log("recibi como id a", id, name,)
      setChoosenProductName(name)
      setChoosenProductId(id)
      setChoosenProductPrice(price)
      setChoosenProductPriceReplacement(replacementPrice)
      setFilteredNames("")
    }

    const addProductSelected = (productName, productId, quantity, price, replacementPrice) => {
      const choosenProductTotalPrice = price * quantity
      const newProduct = { productName, productId, quantity, price, replacementPrice, choosenProductTotalPrice };
      setProductsSelected([...productsSelected, newProduct]);
      setChoosenProductId("")
      setChoosenProductName("")
      setChoosenProductQuantity("")
      setChoosenProductPriceReplacement("")
      setChoosenProductPrice("")
    };

    const handleRemoveProduct = (productIdToDelete) => {
      setProductsSelected((prevProducts) =>
        prevProducts.filter((prod) => prod.productId !== productIdToDelete)
      );
    };

    const cancelOrder = () => { 
      closeModal()
      setSecondStep(false)
      setFirstStep(true)
      setProductsSelected([])
      setTypeOfClient("")
      setClientName("")
      setPlaceOfDelivery("")
      setDateOfDelivery("")
      setReturnDate("")
    }

    const sendNewOrder = () => { 
      const orderData = ({ 
        orderCreator: userCtx.userName,
        orderNumber: orderNumber,
        orderStatus: orderStatus,
        client: clientName,
        typeOfClient: typeOfClient,
        placeOfDelivery: placeOfDelivery,
        dateOfDelivery: dateOfDelivery,
        returnDate: returnDate,
        returnPlace: returnPlace,
        orderDetail: productsSelected,
        total: productsSelected.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0),
        date: actualDate,
        month:  actualMonth,
        year: actualYear,
        day: actualDay,
        paid: false
      })
      axios.post("http://localhost:4000/orders/create", orderData)
          .then((res) => { 
            console.log(res.data)
            updateList()
            setSuccesMessage(true)
            setTimeout(() => { 
              closeModal()
            }, 2000)
          })
          .catch((err) => { 
            console.log(err)
          })

    }

  return (
    <>
      <p className="text-sm font-medium text-zinc-600 cursor-pointer" onClick={onOpen}>Crear Pedido</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Pedido</ModalHeader>
              <ModalBody>
              {
              firstStep ? 
              <div className="flex flex-col items-center justify-center">
                 <div className="flex flex-col items-center justify-center"> 
                    <Input type="number" variant="bordered" value={orderNumber} label="Numero de Orden" className="mt-2 w-64 2xl:w-72" onChange={(e) => setOrderNumber(e.target.value)}/>
                    <Input type="text" variant="bordered" value={clientName} label="Cliente" className="mt-2 w-64 2xl:w-72" onChange={(e) => setClientName(e.target.value)}/>
                    <Select  variant="bordered" label="Tipo de Cliente" className="max-w-xs mt-2" onChange={(e) => setTypeOfClient(e.target.value)}>
                      {typeOfClients.map((client) => (
                        <SelectItem key={client.value} value={client.value}>
                          {client.label}
                        </SelectItem>
                      ))}
                  </Select>
                    <Input type="text" variant="bordered" value={placeOfDelivery} label="Lugar Entrega" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setPlaceOfDelivery(e.target.value)}/>
                    <Input type="text" variant="bordered" value={returnPlace} label="Lugar Devolucion" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setReturnPlace(e.target.value)}/>
                    <Input type="date" variant="bordered" value={dateOfDelivery} label="Fecha Entrega" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setDateOfDelivery(e.target.value)}/>
                    <Input  type="date" variant="bordered" value={returnDate} label="Fecha Devolucion" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setReturnDate(e.target.value)}/>

                 </div> 
                 <div className="flex flex-col items-center justify-center mt-6">
                     <Button color="success" className="font-medium text-white" onClick={() => executeFunctionDependsTypeOfClient()}>Armar Pedido</Button>
                     {missedData ? <p className="mt-4 text-sm font-medium text-blacl">Debes completar todos los campos</p> : null}
                 </div>
              </div>
        
                : null}

              </ModalBody>
              {
              secondStep ? 
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <Input value={choosenProductName} type="text" variant="bordered" label="Producto" className="mt-2 w-64 2xl:w-72" onChange={(e) => handleInputChange(e.target.value)}/>
                    <div className="absolute">
                    {
                        filteredNames !== "" ? 
                            <div className='absolute bg-white shadow-xl rounded-lg mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                                {filteredNames.map((prod) => (
                                    <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500" key={prod._id} 
                                        onClick={() => {
                                            if (typeOfClient === "No Bonificado") {
                                                chooseProduct(prod.articulo, prod._id, prod.precioUnitarioAlquiler, prod.precioUnitarioReposicion);
                                            } else if (typeOfClient === "Bonificado") {
                                                chooseProduct(prod.articulo, prod._id, prod.precioUnitarioBonificados, prod.precioUnitarioReposicion);
                                            }
                                        }}
                                    >
                                        {prod.articulo}
                                    </p>
                                ))}
                            </div>
                        : null
                    }
                    </div>  
                  <Input type="number" value={choosenProductQuantity} variant="bordered" label="Cantidad" className="mt-2 w-64 2xl:w-72" onChange={(e) => setChoosenProductQuantity(e.target.value)}/>
                  <div className="mt-6 flex flex-col ">
                      {
                        choosenProductName.length !== 0 && choosenProductQuantity.length !== 0 ?
                        <Button className="mt-6 font-medium text-white" color="success" 
                         onClick={() => addProductSelected(choosenProductName, choosenProductId, choosenProductQuantity, choosenProductPrice, choosenProductPriceReplacement )}>Añadir</Button> 
                        : 
                        null
                      }

                      {productsSelected.length !== 0 ? 
                         <div className="flex flex-col">
                          <div className="flex flex-col mt-6">
                              {productsSelected.map((prod) => ( 
                                <div className="flex justify-between gap-4 items-center mt-1">
                                  <div className="flex gap-2 items-center">
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Producto: </b> {prod.productName}</p>
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Cantidad: </b>{prod.quantity}</p>
                                    <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Precio Unitario Alquiler: </b>{prod.price}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs cursor-pointer" onClick={() => handleRemoveProduct(prod.productId)}>X</p>
                                  </div>
                                  
                                </div>
                              ))}
                          </div>
                          <div className="flex flex-col mt-2">
                            <p className="text-zinc-500 text-xs"> <b>Total: </b>{productsSelected.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0)} ARS</p> 
                          </div>
                        </div>  
                        :
                        null
                      }
                  </div>
                </div>
                <div>
                  <ModalFooter className="flex items-center justify-center mt-6">
                     {succesMessage !== true ?
                     <div className="flex items-center gap-6">
                        <Button className="font-medium text-white"  style={{backgroundColor:"#399319"}} variant="light" onPress={() => sendNewOrder()}>
                          Confirmar Pedido
                        </Button>
                        <Button className="font-medium text-white"  style={{backgroundColor:"#71CB51"}} variant="light" onPress={cancelOrder}>
                          Cancelar Pedido
                        </Button>
                        <Button className="font-medium text-white" style={{backgroundColor:"#87D56C"}} variant="light"  onClick={() => {
                            changeState(false, true);
                            setProductsSelected([]);
                          }}
                        >
                          Volver
                        </Button>
                     </div>
                     : 
                     <p className="text-md font-bold text-zinc-600 mt-4">Orden creada Con exito ✔</p>
                      }
                  </ModalFooter> 
                </div>
                  
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


export default CreateNewOrder