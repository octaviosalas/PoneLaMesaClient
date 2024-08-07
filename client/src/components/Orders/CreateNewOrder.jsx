import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import { getDate, getMonth, getYear, getDay, formatePrice } from "../../functions/gralFunctions";
import CreateNewClient from "../Clientes/CreateNewClient";
import getBackendData from '../../Hooks/GetBackendData';
import OrderNeedsSublet from "./OrderNeedsSublet";
import moment from 'moment';
import AddShippingCost from "./AddShippingCost";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell} from "@nextui-org/react";
import ApplyDiscount from "./ApplyDiscount";
import Multiply from "./Multiply";

const CreateNewOrder = ({updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const userCtx = useContext(UserContext)
 // const [actualDate, setActualDate] = useState(getDate())
  const [actualMonth, setActualMonth] = useState(getMonth())
  //const [actualYear, setActualYear] = useState(getYear())
  //const [actualDay, setActualDay] = useState(getDay())
  const [firstStep, setFirstStep] = useState(true)
  const [secondStep, setSecondStep] = useState(false)
  const [thirdStep, setThirdStep] = useState(false)
  const [missedData, setMissedData] = useState(false)
  const [missedProducts, setMissedProducts] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [orderStatus, setOrderStatus] = useState("Armado")
  const [typeOfClient, setTypeOfClient] = useState("")
  const [placeOfDelivery, setPlaceOfDelivery] = useState("")
  const [dateOfDelivery, setDateOfDelivery] = useState("")
  const [returnPlace, setReturnPlace] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [allProducts, setAllProducts] = useState("")
  const [allClients, setAllClients] = useState("")
  const [filteredNames, setFilteredNames] = useState("")
  const [choosenClientName, setChoosenClientName] = useState("")
  const [choosenClientId, setChoosenClientId] = useState("")
  const [choosenClientZone, setChoosenClientZone] = useState("")
  const [filteredClientsNames, setFilteredClientsNames] = useState([])
  const [choosenProductName, setChoosenProductName] = useState("")
  const [choosenProductQuantity, setChoosenProductQuantity] = useState("")
  const [choosenProductId, setChoosenProductId] = useState("")
  const [choosenProductPrice, setChoosenProductPrice] = useState("")
  const [choosenProductCategory, setChoosenProductCategory] = useState("")
  const [insufficientStock, setInsufficientStock] = useState(false)
  const [choosenProductStock, setChoosenProductStock] = useState(0)
  const [choosenProductPriceReplacement, setChoosenProductPriceReplacement] = useState("")
  const [productsSelected, setProductsSelected] = useState([]);
  const [clientHasDebt, setClientHasDebt] = useState(false);
  const [clientHasntDebt, setClientHasntDebt] = useState(false);
  const [nameClientDoesNotExist, setNameClientDoesNotExist] = useState(false)
  const [alertMessageClientError, setAlertMessageClientError] = useState(false)
  const [deliveryDateError, setDeliveryDateError] = useState(false)
  const [returnDateError, setReturnDateError] = useState(false)
  const [productDoesNotExist, setProductDoesNotExist] = useState(false)
  const [errorInQuantity, setErrorInQuantity] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [missingShippingCost, setMissingShippingCost] = useState(false)
  const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
  const [columns, setColumns] = useState([])
  const [showTable, setShowTable] = useState(false)
  const [size, setSize] = useState("5xl")
  const [discount, setDiscount] = useState(0)
  const [hasDiscount, setHasDiscount] = useState(false)
  const [multiplyTo, setMultiplyTo] = useState(1)
  const [dateSelected, setDateSelected] = useState('');
  const [daySelected, setDaySelected] = useState('');
  const [monthSelected, setMonthSelected] = useState('');
  const [yearSelected, setYearSelected] = useState('');

  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const handleChange = (e) => {
    const selectedDate = e.target.value;
    setDateSelected(selectedDate);

    const [year, month, day] = selectedDate.split('-');
    setDaySelected(parseInt(day, 10));
    setMonthSelected(monthNames[parseInt(month, 10) - 1]);
    setYearSelected(parseInt(year, 10));
  };

  useEffect(() => { 
    console.log(dateSelected)
    console.log(daySelected)
    console.log(monthSelected)
    console.log(yearSelected)
  }, [dateSelected])

 


      const knowWichNumerOfOrder = () => { 
        axios.get(`http://localhost:4000/orders/getByMonth/${actualMonth}`)
            .then((res) => { 
              console.log(res.data)
              const data = res.data
              const getLastOrderMonth = data.sort((a, b) => b.orderNumber - a.orderNumber).map((num) => num.orderNumber)[0]
              if(data.length === 0) { 
                setOrderNumber(1)
              } else { 
                const newOrderNumber = getLastOrderMonth + 1
                console.log(newOrderNumber)
                setOrderNumber(newOrderNumber)
              }
            
            })
            .catch((err) => console.log(err))
      }
       
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

      const handleOpen = () => { 
        onOpen()
        getClientsData()
        knowWichNumerOfOrder()
      }

      const closeModal = () => { 
        onClose()
        setProductsSelected([])
        setSuccesMessage(false)
        setFirstStep(true)
        setSecondStep(false)
        setTypeOfClient("")
        setChoosenClientName("")
        setChoosenClientId("")
        setReturnDate("")
        setReturnPlace("")
        setDateOfDelivery("")
        setPlaceOfDelivery("")
        setDiscount(0)
        setHasDiscount(false)
      }

      const getClientsData = () => { 
        axios.get("http://localhost:4000/clients")
             .then((res) => { 
                console.log(res.data)
                setAllClients(res.data);
             })
             .catch((err) => { 
               console.log(err)
             })
       }

       const handleInputClientsChange = (e) => { 
        setChoosenClientName(e);
        if(e.length === 0) { 
          setFilteredClientsNames([])
          setChoosenClientName("")
          setChoosenClientId("")
        } else { 
          const useInputToFindTheClient = allClients.filter((cc) => cc.name.toLowerCase().includes(e))
          if(useInputToFindTheClient.length > 0 ) { 
            setFilteredClientsNames(useInputToFindTheClient)
            console.log(useInputToFindTheClient)
            setNameClientDoesNotExist(false)

          } else { 
            console.log("Agrega al cliente")
            setNameClientDoesNotExist(true)
            setFilteredClientsNames([])
          }
          
        }
       }

       const chooseClient = async (name, id, home, typeOfClient, zone) => { 
         setPlaceOfDelivery(home)
         setReturnPlace(home)
         setChoosenClientId(id)
         setChoosenClientName(name)
         setChoosenClientZone(zone)
         setTypeOfClient(typeOfClient)
         setFilteredClientsNames([])
         const response = axios.get(`http://localhost:4000/clients/${id}`)
         const data = await response
         const finalClientData = data.data
         const verifyDebt = finalClientData.clientDebt.some((s) => s.paid === false)
         if(verifyDebt === true) { 
          setClientHasDebt(true)
          setTimeout(() => { 
            setClientHasDebt(false)
          }, 2300)
         } else { 
          setClientHasntDebt(true)
          setTimeout(() => { 
            setClientHasntDebt(false)
          }, 2300)
         }
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
     
          if(orderNumber.length === 0  || choosenClientName.length === 0 || typeOfClient.length === 0 || placeOfDelivery.length === 0 || 
             dateOfDelivery.length === 0 || returnDate.length === 0  ) { 
            setMissedData(true)
            setTimeout(() => { 
              setMissedData(false)
            }, 2000)
          } else if (nameClientDoesNotExist === true) { 
            setAlertMessageClientError(true)
            setTimeout(() => { 
              setAlertMessageClientError(false)
              setChoosenClientName("")
              setNameClientDoesNotExist(false)
              setMissingShippingCost(false)
            }, 2000)
          } else if (shippingCost < 0 && returnPlace !== "Local") { 
            setMissingShippingCost(true)
            setTimeout(() => { 
              setMissingShippingCost(false)
            }, 2000)
          } else { 
            changeState(true, false)
            setMissingShippingCost(false)
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
          if(useInputToFindTheProduct.length > 0) { 
            setFilteredNames(useInputToFindTheProduct)
            console.log(filteredNames)
            setProductDoesNotExist(false)
          } else { 
            console.log("Agrega al producto")
            setProductDoesNotExist(true)
            setFilteredNames([])
          }         
        }
      }

      const chooseProduct = (name, id, price, replacementPrice, stock, category) => { 
        console.log("recibi", id, name, price, replacementPrice, stock, category)
        setChoosenProductName(name)
        setChoosenProductId(id)
        setChoosenProductPrice(price)
        setChoosenProductPriceReplacement(replacementPrice)
        setChoosenProductStock(stock)
        setChoosenProductStock(stock)
        setChoosenProductCategory(category)
        setFilteredNames("")
      }

      const addProductSelected = (productName, productId, quantity, price, replacementPrice, choosenProductStock, choosenProductCategory) => {
        const existingProductIndex = productsSelected.findIndex(product => product.productId === productId);
    
        if (existingProductIndex !== -1) {
            const updatedProduct = {
                ...productsSelected[existingProductIndex],
                quantity: productsSelected[existingProductIndex].quantity + quantity,
                choosenProductTotalPrice: productsSelected[existingProductIndex].choosenProductTotalPrice + (price * quantity),
            };
    
            setProductsSelected(prevProductsSelected => {
                const updatedProducts = prevProductsSelected.map((product, index) => index === existingProductIndex ? updatedProduct : product);
                createTableProductsSelected(updatedProducts);
                return updatedProducts;
            });
    
            setChoosenProductId("");
            setChoosenProductName("");
            setChoosenProductQuantity("");
            setChoosenProductPriceReplacement("");
            setChoosenProductPrice("");
            setChoosenProductCategory("");
            setChoosenProductStock(0);
    
        } else if (quantity <= choosenProductStock && productDoesNotExist === false) {
            const choosenProductTotalPrice = price * quantity;
            const newProduct = { productName, productId, quantity, price, replacementPrice, choosenProductTotalPrice, choosenProductCategory };
    
            setProductsSelected(prevProductsSelected => {
                const updatedProducts = [...prevProductsSelected, newProduct];
                // Llamada a createTableProductsSelected con el estado actualizado
                createTableProductsSelected(updatedProducts);
                return updatedProducts;
            });
    
            // Limpiar campos
            setChoosenProductId("");
            setChoosenProductName("");
            setChoosenProductQuantity("");
            setChoosenProductPriceReplacement("");
            setChoosenProductPrice("");
            setChoosenProductCategory("");
            setChoosenProductStock(0);
    
        } else if (quantity > choosenProductStock && productDoesNotExist === false) {
          setInsufficientStock(true);
          setTimeout(() => { 
            const choosenProductTotalPrice = price * quantity;
            const newProduct = { productName, productId, quantity, price, replacementPrice, choosenProductTotalPrice, choosenProductCategory };
    
            setProductsSelected(prevProductsSelected => {
                const updatedProducts = [...prevProductsSelected, newProduct];
                // Llamada a createTableProductsSelected con el estado actualizado
                createTableProductsSelected(updatedProducts);
                return updatedProducts;
            });
    
            // Limpiar campos
            setChoosenProductId("");
            setChoosenProductName("");
            setChoosenProductQuantity("");
            setChoosenProductPriceReplacement("");
            setChoosenProductPrice("");
            setChoosenProductCategory("");
            setChoosenProductStock(0);
            setInsufficientStock(false)
          }, 1800)


        } else if (quantity < choosenProductStock && productDoesNotExist === true) {
            setProductDoesNotExist(true);
        }
      };

      const handleRemoveProduct = (productIdToDelete) => {
        setProductsSelected((prevProducts) =>
          prevProducts.filter((prod) => prod.productId !== productIdToDelete)
        );
      };

      const setOrderToBeConfirmed = () => { 
         setThirdStep(true)
         setSecondStep(false)
         setFirstStep(false)
      }

      const comeBackToSecondStep = () => { 
        setSecondStep(true)
        setThirdStep(false)
        setFirstStep(false)
      }

      const sendNewOrder = (statusOfTheOrder) => { 
        if(productsSelected.length === 0) { 
          setMissedProducts(true)
          setTimeout(() => {
            setMissedProducts(false)
          }, 1500);
        } else { 

          let totalProductPrice = productsSelected.reduce((acc, el) => acc + parseFloat(el.choosenProductTotalPrice), 0);
          let totalWithDiscountWithOutShippingCost = totalProductPrice - (totalProductPrice * (discount / 100));
          let totalWithDiscount = totalWithDiscountWithOutShippingCost + parseFloat(shippingCost);         
          let final = totalWithDiscountWithOutShippingCost * multiplyTo;        
          let finalTotal = final + parseFloat(shippingCost);
          
          const orderData = ({
            orderCreator: userCtx.userName,
            orderNumber: orderNumber,
            orderStatus: statusOfTheOrder,
            client: choosenClientName,
            clientId: choosenClientId,
            typeOfClient: typeOfClient,
            placeOfDelivery: placeOfDelivery,
            dateOfDelivery: dateOfDelivery,
            returnDate: returnDate,
            returnPlace: returnPlace,
            orderDetail: productsSelected,
            total: finalTotal,
            date: dateSelected,
            month: monthSelected,
            year: yearSelected,
            day: daySelected,
            paid: false,
            clientZone: choosenClientZone,
           ...(Number(shippingCost) >= 0 ? { shippingCost: Number(shippingCost) } : {})
          });
      
          axios.post("http://localhost:4000/orders/create", orderData)
           .then((res) => { 
              console.log(res.data);
              updateList("everyOrders");
              setSuccesMessage(true);
              setDiscount(0)
              setTimeout(() => { 
                closeModal();
                knowWichNumerOfOrder();
           
                setShippingCost(0);
              }, 2000);
            })
           .catch((err) => { 
              console.log(err);
            });
        }
      }

      const setCostOfTheShipping = (value) => { 
        setShippingCost(value)
      }


      const createTableProductsSelected = (productsSelected) => { 
        console.log("me llego!!! products selected", productsSelected)
         if(productsSelected.length > 0 ) { 
          const firstDetail = productsSelected[0];
          const properties = Object.keys(firstDetail);
          const filteredProperties = properties.filter(property => property !== 'choosenProductCategory' && property !== 'replacementPrice' && 
          property !== 'productId' && property !== 'productId' && property !== 'price');
          
          console.log(properties)

          const columnLabelsMap = {
            productName: 'Articulo',
            quantity: 'Cantidad',
            choosenProductTotalPrice: 'Monto Total',
            };
        
          const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));

          tableColumns.push({
            key: 'Eliminar',
            label: 'Eliminar',
            cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const productId = filaActual.original.productId;
                return (
                    <p className="cursor-pointer text-green-800 text-sm" onClick={() => handleRemoveProduct(productId)}>Eliminar</p>
                );
            },
        });

        
          setColumns(tableColumns);
          setShowTable(true)  
         } else { 
          console.log("First table length 0!")
         }
      }

   
      const chooseDiscount = (value) => { 
        setHasDiscount(true)
        setDiscount(value)
     }

      const multiplyValue = (number) => { 
        setMultiplyTo(number)
      }

      
     

  return (
    <>
      <p className="text-sm font-medium text-black cursor-pointer" onClick={handleOpen}>Crear Pedido</p>
      <Modal isOpen={isOpen} autoClose={false} isDismissable={false} onOpenChange={onOpenChange} size={secondStep !== true ? "xl" : size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                Crear Pedido
              {firstStep ?  <CreateNewClient updateList={getClientsData} type="creatingOrder"/> : null}
              </ModalHeader>
              <ModalBody>
              {
              firstStep ? 
              <div className="flex flex-col items-center justify-center">
                 <div className="flex flex-col items-center justify-center"> 
  
                    <Input type="date" classNames={{label: "-mt-5"}} variant="underlined" label="Fecha" className="mt-2 w-64 2xl:w-72" onChange={handleChange}/>
                    <Input type="number" variant="underlined" value={orderNumber} label="Numero de Orden" className="mt-2 w-64 2xl:w-72" readonly />
                    <Input type="text" variant="underlined" value={choosenClientName} label="Cliente" className="mt-2 w-64 2xl:w-72" onChange={(e) => handleInputClientsChange(e.target.value)}/>
                    <div className="">
                        {
                        filteredClientsNames !== "" ? 
                            <div className='absolute  rounded-xl z-10  shadow-xl bg-white  mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                                {filteredClientsNames.map((cc) => (
                                    <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500 ml-2" key={cc._id} 
                                        onClick={() => chooseClient(cc.name, cc._id, cc.home, cc.typeOfClient, cc.zone)}>
                                        {cc.name}
                                    </p>
                                ))}
                            </div>
                        : null
                        }
                    </div>  
                    {nameClientDoesNotExist ? <p className="text-xs font-medium text-zinc-600 mt-1">El cliente debe estar registrado</p> : null}


                    <Select style={{ border: 'none' }} selectedKeys={[typeOfClient]} variant="underlined"  label="Tipo de Cliente" className="max-w-xs border border-none mt-2" onChange={(e) => setTypeOfClient(e.target.value)}>
                      {typeOfClients.map((client) => (
                        <SelectItem key={client.value} value={client.value}>
                          {client.label}
                        </SelectItem>
                      ))}
                  </Select>

                    <div className="flex flex-col justify-start text-start  mt-2 ">
                      <Input type="text" variant="underlined"   value={placeOfDelivery} label="Lugar Entrega" className="w-64 2xl:w-72"  onChange={(e) => setPlaceOfDelivery(e.target.value)}/>
                      <p className="text-xs underline text-green-800 cursor-pointer ml-1 flex justify-start" onClick={() => setPlaceOfDelivery("Local")}>Si la entrega es en el Local, click aqui</p>
                    </div>

                    <div className="flex flex-col justify-start text-start  mt-2 ">
                      <Input type="text" variant="underlined"   value={returnPlace} label="Lugar Devolucion" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setReturnPlace(e.target.value)}/>
                      <p className="text-xs underline text-green-800 cursor-pointer ml-1 flex justify-start"  onClick={() => setReturnPlace("Local")}>Si la Devolucion es en el Local, click aqui</p>
                    </div>
                  


                    <Input
                      type="date"
                      variant="underlined"
                      classNames={{label: "-mt-5"}}
                      value={dateOfDelivery}
                      label="Fecha Entrega"
                      className="mt-2 w-64 2xl:w-72"
                      onChange={(e) => {
                        const selectedDate = moment(e.target.value, 'YYYY-MM-DD');
                        const currentDate = moment().startOf('day'); // Asegurarse de que la fecha actual sea al inicio del día

                        if (selectedDate.isSameOrAfter(currentDate)) {
                          setDateOfDelivery(e.target.value);
                        } else {
                          setDeliveryDateError(true);
                          setTimeout(() => {
                            setDeliveryDateError(false);
                          }, 2000);
                        }
                      }}
                    />




                              {deliveryDateError ? <p className="text-zinc-600 text-xs font-medium mt-1">La fecha ingresada es anterior a la actual</p> : null}

                            <Input  
                            type="date" 
                            variant="underlined"  
                            classNames={{label: "-mt-5"}} 
                            value={returnDate} 
                            label="Fecha Devolucion" 
                            className="mt-2 w-64 2xl:w-72"  
                            onChange={(e) => {
                              const selectedDate = moment(e.target.value, 'YYYY-MM-DD');
                              const currentDate = moment().startOf('day');
                              if (selectedDate.isSameOrAfter(currentDate)) { 
                                setReturnDate(e.target.value);
                              } else {
                                setReturnDateError(true)
                                setTimeout(() => { 
                                  setReturnDateError(false)
                                }, 2000)
                              }
                          }}/>
                          

                   {returnDateError ? <p className="text-zinc-600 text-xs font-medium mt-1">La fecha ingresada es anterior a la actual</p> : null}

                 </div> 
                 <div className="flex flex-col items-center justify-center mt-6">
                      
                      <div className="flex items-center justify-center gap-4">
                        <Button className="font-medium text-white text-sm bg-green-800 w-44" onClick={() => executeFunctionDependsTypeOfClient()}>Armar Pedido</Button>
                        {placeOfDelivery === "Local" && returnPlace === "Local" || placeOfDelivery.length === 0 ? null : <AddShippingCost addCost={setCostOfTheShipping}/>}
                      </div>
                     


                     {clientHasDebt ? <p className="mt-4 text-sm font-medium text-white bg-red-600">Este cliente posee una deuda pendiente de Pago</p> : null}
                     {clientHasntDebt ? <p className="mt-4 text-sm font-medium text-green-600">Este cliente no posee una deuda pendiente de Pago ✔</p> : null}
                     {missedData ? <p className="mt-4 text-sm font-medium text-green-800">Debes completar todos los campos</p> : null}
                     {alertMessageClientError ? <p className="mt-4 text-sm font-medium text-green-800">Debes seleccionar un cliente existente</p> : null}
                     {missingShippingCost ? <p className="mt-4 text-sm font-medium text-green-800">Debes indicar el costo de Envio</p> : null}

                 </div>
              </div>       
                : null}
              </ModalBody>



              {secondStep ? 
               <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <Input value={choosenProductName} type="text" variant="bordered" label="Producto" className="mt-2 w-64 2xl:w-72" onChange={(e) => handleInputChange(e.target.value)}/>
                    <div className="absolute">
                    {
                        filteredNames !== "" ? 
                            <div className='absolute z-10  bg-white shadow-xl rounded-lg mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                                {filteredNames.map((prod) => (
                                    <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500" key={prod._id} 
                                        onClick={() => {
                                            if (typeOfClient === "No Bonificado") {
                                                chooseProduct(prod.articulo, prod._id, prod.precioUnitarioAlquiler, prod.precioUnitarioReposicion, prod.stock, prod.Categoria);
                                            } else if (typeOfClient === "Bonificado") {
                                                chooseProduct(prod.articulo, prod._id, prod.precioUnitarioBonificados, prod.precioUnitarioReposicion, prod.stock, prod.Categoria);
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

                    
                      
                     <Input 
                        type="number"
                        value={choosenProductQuantity} 
                        variant="underlined" 
                        label="Cantidad" 
                        className="mt-2 w-64 2xl:w-72"  
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (value > 0 && !isNaN(value))) {
                              setChoosenProductQuantity(parseInt(e.target.value, 10));
                              setErrorInQuantity(false)
                            } else {
                              setErrorInQuantity(true)
                            }
                        }} 
                        />

                        {errorInQuantity ? <p className="text-xs text-zinc-700 font-medium">Debes ingresar un numero mayor a 0</p> : null}
                      
              
                  
                  {productDoesNotExist ? <p className="text-xs font-medium text-zinc-600">El producto no esta almacenado en tus articulos</p> : null}

                  <div className="mt-6 flex flex-col items-center justify-center">
                      {
                        choosenProductName.length !== 0 && choosenProductQuantity.length !== 0 && productDoesNotExist === false ?
                        <Button 
                         className="bg-green-800 text-sm font-medium text-white w-72"  
                         onClick={() => addProductSelected(choosenProductName, choosenProductId, choosenProductQuantity, choosenProductPrice, 
                                        choosenProductPriceReplacement, choosenProductStock, choosenProductCategory)}>
                          Añadir
                        </Button> 
                        : 
                        null
                      }

                       {
                       insufficientStock ?
                       <div className="flex flex-col items-center justify-center mt-4">
                            <p className="font-medium text-sm text-white w-full bg-red-600">No dispones de stock suficiente. La cantidad del stock quedara en negativo</p>
                       </div>
                        : 
                        null
                      }  

                      {
                       missedProducts ?
                       <div className="flex items-center justify-center mt-4">
                            <p className="font-medium text-sm text-green-600 underline">No hay articulos Agregados</p>
                       </div>
                        : 
                        null
                      }  

                      {showTable  && productsSelected.length > 0 ? 
                      <> 
                       <Table                          
                       columnAutoWidth={true} 
                       columnSpacing={10}  
                       aria-label="Selection behavior table example with dynamic content"   
                       selectionBehavior={selectionBehavior} 
                       className=" flex items-center justify-center shadow-lg max-h-[250px] overflow-y-auto rounded-xl w-[600px]">
                           <TableHeader columns={columns}>
                               {(column) => (
                               <TableColumn key={column.key} className="text-xs gap-12">
                                   {column.label}
                               </TableColumn>
                                   )}
                               </TableHeader>
                               <TableBody items={productsSelected}>
                                       {(item) => (
                                           <TableRow key={item.productId}>
                                               {columns.map(column => (
                                                   <TableCell key={column.key} className='text-left'>
                                                       {column.cellRenderer ? (
                                                           column.cellRenderer({ row: { original: item } })
                                                       ) : (
                                                           (column.key === "choosenProductTotalPrice") ? (
                                                               formatePrice(item[column.key])
                                                           ) : (
                                                               item[column.key]
                                                           )
                                                       )}
                                                   </TableCell>
                                               ))}
                                           </TableRow>
                                       )}
                                   </TableBody>
                               </Table> 
                               
                               <div className="flex gap-8 items-start justify-start mt-4 mb-4"> 
                   
                                     {shippingCost === 0 ?
                                        <div className="flex flex-col items-center justify-center">
                                              <p className="font-medium text-md text-zinc-600"> 
                                                  Monto:    {formatePrice(
                                                        (productsSelected.reduce((acc, el) => acc + parseFloat(el.choosenProductTotalPrice), 0) - 
                                                        ((productsSelected.reduce((acc, el) => acc + parseFloat(el.choosenProductTotalPrice), 0)) * (discount / 100))) * multiplyTo
                                                    )}
                                              </p> 
                                              {hasDiscount === true ? <p className="text-white bg-red-600 text-center w-72 text-sm mt-2">Incluye el {discount}% de descuento</p> : null}                            
                                        </div>
                                      : 
                                    <div className="flex flex-col justify-center items-center">
                                       <div className="flex gap-8 items-start justify-start">
                                          <p className="font-medium text-md text-zinc-600">
                                            Monto Envio: {formatePrice(parseFloat(shippingCost))}
                                          </p>                        
                                          <p className="font-medium text-md text-zinc-600">
                                            Monto Total:
                                                    {formatePrice(
                                                        (productsSelected.reduce((acc, el) => acc + parseFloat(el.choosenProductTotalPrice), 0) - 
                                                        ((productsSelected.reduce((acc, el) => acc + parseFloat(el.choosenProductTotalPrice), 0)) * (discount / 100))) * multiplyTo
                                                    )}
                                           </p>                                                                                 
                                       </div>
                                        <div>
                                            {hasDiscount === true ? <p className="text-white bg-red-600 text-center w-72 text-sm mt-2">Incluye el {discount}% de descuento</p> : null}
                                        </div>
                                      </div>
                                      }                                                           
                                 </div>
                                 <div>
                                     <ApplyDiscount apply={chooseDiscount}/>
                                  </div>
                             </>
                               : null             
                      }

                  </div>
                </div>
                <div>
                  <ModalFooter className="flex items-center justify-center mt-6">
                     {succesMessage !== true ?
                     <div className="flex items-center gap-6">
                        <Button className="font-medium text-white bg-green-800  w-52" variant="light" onPress={() => sendNewOrder(orderStatus)}>
                          Confirmar Pedido
                        </Button>
                        <Button className="font-medium text-white bg-green-800  w-52" variant="light" onPress={setOrderToBeConfirmed}>
                          A Confirmar
                        </Button>
                        <Multiply changeTotal={multiplyValue} />
                        <Button className="font-medium text-white bg-green-800  w-52" variant="light"  onClick={() => {
                            changeState(false, true);
                            setProductsSelected([]);
                            setChoosenClientId("");
                            setChoosenClientName("");                          
                            setDateOfDelivery("")
                            setPlaceOfDelivery("")
                            setReturnPlace("")
                            setMultiplyTo(1)
                            setDiscount(0)
                            setD
                          }}
                        >
                          Volver
                        </Button>
                     </div>
                     : 
                     <p className="text-sm font-bold text-green-800 mt-4">Orden creada Con exito ✔</p>
                      }
                  </ModalFooter> 
                </div>
                  
              </div>         
              :
              null
              }

              {thirdStep ? 
              <div className="flex text-center items-center justify-center w-full ">
                    <OrderNeedsSublet comeBack={comeBackToSecondStep} sendOrderToBeConfirmed={sendNewOrder}/>
              </div>
              :
              null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default CreateNewOrder