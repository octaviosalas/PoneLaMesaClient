import React, {useState, useMemo, useEffect} from 'react'
import { Input, Button } from '@nextui-org/react'
import { formatePrice } from '../../../functions/gralFunctions'
import axios from 'axios'

const EditDetailOrderData = ({newOrderDetailArray, orderStatus, orderData, orderId, comeBack, closeModalNow, updateChanges, shippingCost}) => {

    const [productsSelected, setProductsSelected] = useState("")
    const [filteredNames, setFilteredNames] = useState("")
    const [addNewProductToOrder, setAddNewProductToOrder] = useState(false)
    const [choosenProductName, setChoosenProductName] = useState("")
    const [choosenProductQuantity, setChoosenProductQuantity] = useState("")
    const [choosenProductId, setChoosenProductId] = useState("")
    const [choosenProductStock, setChoosenProductStock] = useState("")
    const [choosenProductPrice, setChoosenProductPrice] = useState("")
    const [choosenProductPriceReplacement, setChoosenProductPriceReplacement] = useState("")
    const [allArticles, setAallArticles] = useState([])
    const [insufficientStock, setInsufficientStock] = useState(false)
    const [successAddMessage, setSuccessAddMessage] = useState(false)
    const [errorInQuantity, setErrorInQuantity] = useState(false)
    const [errorInArticle, setErrorInArticle] = useState(false)
    const [showError, setShowError] = useState(false)
    const [newOrderDetailWithChanges, setNewOrderDetailWithChanges] = useState(newOrderDetailArray)
    const [succesMessage, setSuccesMessage] = useState(false)
    const [newTotalOrderAmount, setNewTotalOrderAmount] = useState(0)
    const [newProductsAddedToIncrementStock, setNewProductsAddedToIncrementStock] = useState([])
    const [bonified, setBonified] = useState(false)

    const originalOrderDetailData = useMemo(() => newOrderDetailArray, []);

    const getTypeOfClient = async () => { 
      try {
        const {data, status} = await axios.get(`http://localhost:4000/clients/${orderData.clientId}`)  
        if(status === 200) { 
          const clientType = data.typeOfClient
          if(clientType === "Bonificado") { 
            setBonified(true)
          } else { 
            setBonified(false)
          }
        } 
      } catch (error) {
        console.log(error)
      }
        
    }


    const getClientsProductsData = () => { 
        axios.get("http://localhost:4000/products/productsClients")
              .then((res) => { 
                console.log(res.data)
                setAallArticles(res.data);
              })
              .catch((err) => { 
                console.log(err)
              })
    }

    useEffect(() => { 
        getClientsProductsData()
        getTypeOfClient()
    }, [])

    const handleQuantityChange = (index, newQuantity, productId) => {
      console.log(productId)
      const updateOrderDetail = [...newOrderDetailWithChanges];
      const priceOfItem = updateOrderDetail[index].price;
      updateOrderDetail[index] = {
        ...updateOrderDetail[index],
        quantity: Number(newQuantity),
        choosenProductTotalPrice: Number(newQuantity * priceOfItem)
       
      };
      setNewOrderDetailWithChanges(updateOrderDetail);
      const checkIfProducChangedtIsNew = newProductsAddedToIncrementStock.some((prod) => prod.productId === productId)
      if (checkIfProducChangedtIsNew) {
        console.log("Esta en los nuevos");
    
        const updatedNewProductsAddedToIncrementStock = newProductsAddedToIncrementStock.map((prod) => {
          if (prod.productId === productId) {
            const updatedTotalPrice = prod.price * Number(newQuantity);
            return {
              ...prod,
              quantity: Number(newQuantity),
              choosenProductTotalPrice: updatedTotalPrice,
            };
          }
          return prod;
        });
    
        setNewProductsAddedToIncrementStock(updatedNewProductsAddedToIncrementStock);
     }
   
    };

     useEffect(() => { 
        console.log(newOrderDetailWithChanges)
     }, [newOrderDetailWithChanges])

      useEffect(() => { 
      getClientsProductsData()
      console.log("NEW PPRODUCTS ADDED", newProductsAddedToIncrementStock)
     }, [newProductsAddedToIncrementStock])

    const handleInputChange = (e) => { 
        setChoosenProductName(e);
        if(e.length === 0) { 
          setFilteredNames([])
          setChoosenProductName("")
          setChoosenProductId("")
        } else { 
          const useInputToFindTheProduct = allArticles.filter((prod) => prod.articulo.toLowerCase().includes(e))
          if(useInputToFindTheProduct.length > 0) { 
            setFilteredNames(useInputToFindTheProduct)
            console.log(filteredNames)
            setErrorInArticle(false)
          } else { 
            console.log("Agrega al cliente")
            setErrorInArticle(true)
            setFilteredNames([])
          }
        
        }
    }

    useEffect(() => { 
      console.log("aca pa", choosenProductPrice)
    }, [choosenProductPrice])

    const chooseProduct = (name, id, price, replacementPrice, stock) => { 
        console.log("recibi", id, name, price, replacementPrice, stock)
        setChoosenProductName(name)
        setChoosenProductId(id)
        setChoosenProductPrice(price)
        setChoosenProductPriceReplacement(replacementPrice)
        setChoosenProductStock(stock)
        setFilteredNames("")
    }

    const addProductSelected = (productName, productId, quantity, price, replacementPrice, choosenProductStock, param) => {
      console.log("aca pa 2", price)
        const newProductsAdded = []
        if(errorInArticle === false && errorInQuantity === false) { 
            if(quantity < choosenProductStock) { 
              let choosenProductTotalPrice;
                if(param === "withPrice") {
                  choosenProductTotalPrice = price * quantity;
                  console.log("withPrice")
                } else {
                  choosenProductTotalPrice = 0
                  console.log("withOutPrice")
                }
              const newProduct = { productName, productId, quantity, price, replacementPrice, choosenProductTotalPrice };
              const checkIfProductIsNew = newOrderDetailWithChanges.some((prod) => prod.productId === newProduct.productId)
              console.log(checkIfProductIsNew)
              if(checkIfProductIsNew === false) { 
                setNewProductsAddedToIncrementStock(prevState => [...prevState, newProduct]);
                setNewOrderDetailWithChanges([...newOrderDetailWithChanges, newProduct]);
                setChoosenProductId("")
                setChoosenProductName("")
                setChoosenProductQuantity("")
                setChoosenProductPriceReplacement("")
                setChoosenProductPrice("")
                setChoosenProductStock(0)
                console.log("New Product Added", newProductsAdded)
              } else { 
                const updatedProducts = newOrderDetailWithChanges.map(prod => {
                  if (prod.productId === newProduct.productId) {
                      const updatedQuantity = prod.quantity + newProduct.quantity;
                      const updatedTotalPrice = prod.price * updatedQuantity;

                      return { ...prod, quantity: updatedQuantity, choosenProductTotalPrice: updatedTotalPrice };
                  }
                  return prod; 
              })
              const updatedNewProductsAddedToIncrementStock = newProductsAddedToIncrementStock.map(prod => {
                if (prod.productId === newProduct.productId) {
                   const updatedQuantity = prod.quantity + newProduct.quantity;
                   const updatedTotalPrice = prod.price * updatedQuantity;
                   
                   return { ...prod, quantity: updatedQuantity, choosenProductTotalPrice: updatedTotalPrice };
                }
                return prod;
               });
              setNewOrderDetailWithChanges(updatedProducts);
              setNewProductsAddedToIncrementStock(updatedNewProductsAddedToIncrementStock);
              setChoosenProductId("")
              setChoosenProductName("")
              setChoosenProductQuantity("")
              setChoosenProductPriceReplacement("")
              setChoosenProductPrice("")
              setChoosenProductStock(0)
              }
             
              setTimeout(() => {
                  console.log(productsSelected)
              }, 1500)
            } else { 
              setInsufficientStock(true)
              setTimeout(() => { 
                setInsufficientStock(false)
              }, 1500)
            }
        } else { 
            setShowError(true)
            setTimeout(() => { 
                setShowError(false)
            }, 1400)
        }
      
      
    };

    const handleRemoveProduct = (productIdToDelete) => {
      setNewOrderDetailWithChanges((prevProducts) =>
        prevProducts.filter((prod) => prod.productId !== productIdToDelete)
      );
      const checkIfDeletedIsNewProduct = newProductsAddedToIncrementStock.some((prod) => prod.productId === productIdToDelete)
        if(checkIfDeletedIsNewProduct) { 
          const updatedNewProductsAddedToIncrementStock = newProductsAddedToIncrementStock.filter(prod => prod.productId !== productIdToDelete);
          setNewProductsAddedToIncrementStock(updatedNewProductsAddedToIncrementStock);
        }
    }

    const cancelAddProduct = () => { 
        setAddNewProductToOrder(false)
        setProductsSelected([])
        setChoosenProductName("")
        setChoosenProductPrice("")
        setChoosenProductId("")
        setChoosenProductQuantity("")
        comeBack()
    }

    const changePurchaseDetail = async () => {  
       try {
            const sumarStock = [];
            const disminuirStock = [];
            const newProductToBeAddes = []
            const getDifferences = await newOrderDetailWithChanges.map((newArray) => { 
            const viewOriginal = originalOrderDetailData.filter((original) => original.productId === newArray.productId);
              return { 
              newQuantity: Number(newArray.quantity),
              originalQuantity: Number(viewOriginal.map((o) => o.quantity)[0]),
              quantity: newArray.quantity - viewOriginal.map((o) => o.quantity)[0],
              productId: newArray.productId
            };
            }).map((dif) => { 
              if(dif.quantity > 0) { 
                disminuirStock.push(dif); 
              }  else if (dif.quantity < 0){ 
                dif.quantity = Math.abs(dif.quantity);
                sumarStock.push(dif); 
             }
            });

            console.log("ARRAY ORIGINAL DE COMPRA DETAIL", originalOrderDetailData)
            console.log("NUEVO ARRAY ENTERO DE COMPRA DETAIL", newOrderDetailWithChanges)
            console.log("SUMAR STOCK POR DIFERENCIA POSITIVA", sumarStock)
            console.log("DESCONTAR STOCK POR DIFERENCIA NEGATIVA", disminuirStock) 

            const newTotalOrderAmount = newOrderDetailWithChanges.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0) + shippingCost

            console.log(formatePrice(newTotalOrderAmount))
             

             const newPurchaseDetailData = ({ 
              newTotalAmount: newTotalOrderAmount,
              toDiscountStock: disminuirStock,
              toIncrementStock: sumarStock,
              newProductToDisscountStock: newProductsAddedToIncrementStock,
              completeNewDetail: newOrderDetailWithChanges
            })
            
            
            console.log(newOrderDetailWithChanges) 
            console.log("Nuevos productos agregados al detalle listos para descontar stock", newPurchaseDetailData.newProductToDisscountStock)
            console.log("newTotalAmount enviado", newPurchaseDetailData.newTotalAmount)
            console.log("Nuevo detalle de orden ENTERO", newPurchaseDetailData.completeNewDetail)

           const updateDetail = await axios.put(`http://localhost:4000/orders/updateOrderDetail/${orderId}`, newPurchaseDetailData)
            console.log(updateDetail.data)
            if(updateDetail.status === 200) { 
              setSuccessAddMessage(true)
                setTimeout(() => { 
                  closeModalNow()
                  updateChanges("everyOrders")
                  setSuccessAddMessage(false)
                }, 2000)
            }

            } catch (error) {
              console.log(error) 
            }

    };
    



  return (

    <>
     {orderStatus === "A Confirmar" || orderStatus === "Armado"  || orderStatus === "Confirmado" || orderStatus === "Entregado"? 
      <div className="flex flex-col justify-center items-center">
              {newOrderDetailWithChanges.map((ord, index) => (
                  <div key={index} className="flex flex-col">
                  <div className="flex items-center justify-start w-72 gap-4 mt-2">
                      <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                      <Input type="number"
                          variant="underlined"
                          label="Cantidad" 
                          className="max-w-md min-w-sm" 
                          labelPlacement="outside-right"
                          style={{ textAlign: 'right' }} 
                          value={ord.quantity} 
                          onChange={(e) => handleQuantityChange(index, e.target.value, ord.productId)} />
                      <p className="cursor-pointer text-xs" onClick={() => handleRemoveProduct(ord.productId)}>X</p>
                  </div>
                  </div>
              ))}

            

              <div className="flex items-center justify-center mt-2">
              {newOrderDetailWithChanges.length > 0 ? (
                  <p className="font-bold text-zinc-600">       
                      Total: {formatePrice(
                      newOrderDetailWithChanges.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0)
                      )}
                  </p>
                  ) : (
                  <p className='text-zinc-600 font-medium text-sm'>Total: {formatePrice(newOrderDetailWithChanges.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0))}</p>
                  )}
              </div>

              {addNewProductToOrder ? 
                  <div className="flex flex-col items-center justify-center">

                      <Input type="text" label="Articulo" value={choosenProductName} variant="underlined" className="w-52" onChange={(e) => handleInputChange(e.target.value)}/>

                      {errorInArticle ? <p className="text-zinc-600 text-xs">Debes seleccionar un articulo Existente</p> : null}

                      <div className="">
                      {filteredNames !== "" ? 
                              <div className='absolute  rounded-xl z-10  shadow-xl bg-white  mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' 
                              style={{ backdropFilter: 'brightness(100%)' }}>
                                  {filteredNames.map((prod) => (
                                    <p
                                    className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500"
                                    key={prod._id}
                                    onClick={() =>
                                      chooseProduct(
                                        prod.articulo,
                                        prod._id,
                                        bonified ? prod.precioUnitarioBonificados : prod.precioUnitarioAlquiler,
                                        prod.precioUnitarioReposicion,
                                        prod.stock
                                      )
                                    }
                                  >
                                    {prod.articulo}
                                  </p>
                                  ))}
                              </div>
                          : null
                      }
                      </div> 

                      <Input  type="number"  label="Cantidad"  value={choosenProductQuantity}   variant="underlined"  className="w-52"  
                              onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || (value > 0 && !isNaN(value))) {
                                setChoosenProductQuantity(Number(e.target.value));
                                setErrorInQuantity(false)
                              } else {
                                setErrorInQuantity(true)
                              }
                          }} 
                          />

                          {errorInQuantity ?  <p className="text-zinc-600 text-xs"> Debes ingresar una cantidad mayor a 0</p> : null}
  
                
                      {showError ? <p className='text-zinc-600 font-medium text-sm'>La cantidad Ingresado o el Articulo Ingresado no es valido</p> : null}

                      {choosenProductName.length !== 0 && choosenProductQuantity.length !== 0 ?
                        <div className='flex gap-4 items-center'>
                          <Button className="mt-6 w-44 font-medium text-white bg-green-800"  
                                  onClick={() => addProductSelected(choosenProductName, choosenProductId, choosenProductQuantity, choosenProductPrice, choosenProductPriceReplacement, choosenProductStock, "withPrice" )}>
                              Añadir
                          </Button> 
                          <Button className="mt-6 w-44 font-medium text-white bg-green-800"  
                                  onClick={() => addProductSelected(choosenProductName, choosenProductId, choosenProductQuantity, choosenProductPrice, choosenProductPriceReplacement, choosenProductStock, "withOutPrice" )}>
                              Añadir sin Cargo
                          </Button> 
                        </div>
                          : 
                          null
                      }

                      {insufficientStock ?
                          <div className="flex items-center justify-center mt-4">
                              <p className="font-medium text-sm text-green-600 underline">Stock Insuficiente</p>
                          </div> : null }  
                  </div>
                  :
                  null
              }

              <div className="flex items-center gap-6 mt-6">
              <Button className="bg-green-800 font-bold text-white w-56" onClick={() => changePurchaseDetail()}>Confirmar</Button>

              {!addNewProductToOrder ? <Button className="bg-green-800 font-bold text-white  w-56" onClick={() => setAddNewProductToOrder(true)}>Agregar Nuevo Producto</Button>
              :null}
              
              {addNewProductToOrder ?
               <Button className="bg-green-800 font-bold text-white  w-56" onClick={() => cancelAddProduct()}>Cancelar Agregados</Button>
                :
              <Button className="bg-green-800 font-bold text-white  w-56" onClick={() => cancelAddProduct()}>Cancelar</Button>}
              
              </div>
              {successAddMessage ? 
              <div className="mt-6">
                  <p className="font-bold mt-6 text-green-800 text-sm">Añadido Correctamente</p> 
              </div> : null }
      </div>  : 
      <div className='flex flex-col items-center justify-center'>
          <p className=' text-sm text-black'>No hes posible modificar los articulos de un alquiler ya entregado</p>
          <Button className="bg-green-800 font-bold text-white w-56 mt-4 mb-2" onClick={() => cancelAddProduct()}>Cancelar</Button>
      </div>
      } 
    </>
  
  )
}

export default EditDetailOrderData
