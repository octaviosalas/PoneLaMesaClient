import React, {useState, useMemo, useEffect} from 'react'
import { Input, Button } from '@nextui-org/react'
import { formatePrice } from '../../../functions/gralFunctions'
import axios from 'axios'

const EditDetailOrderData = ({newOrderDetailArray, comeBack}) => {

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

    const originalOrderDetailData = useMemo(() => newOrderDetailArray, []);


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
        console.log(originalOrderDetailData)
    }, [])

    const handleQuantityChange = (index, newQuantity) => {
      const updateOrderDetail = [...newOrderDetailWithChanges];
      updateOrderDetail[index] = {
        ...updateOrderDetail[index],
        quantity: Number(newQuantity),
      };
      setNewOrderDetailWithChanges(updateOrderDetail);
    };

    useEffect(() => { 
      getClientsProductsData()
      console.log(newOrderDetailWithChanges)
  }, [newOrderDetailWithChanges])

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

    const chooseProduct = (name, id, price, replacementPrice, stock) => { 
        console.log("recibi", id, name, price, replacementPrice, stock)
        setChoosenProductName(name)
        setChoosenProductId(id)
        setChoosenProductPrice(price)
        setChoosenProductPriceReplacement(replacementPrice)
        setChoosenProductStock(stock)
        setFilteredNames("")
    }

    const addProductSelected = (productName, productId, quantity, price, replacementPrice, choosenProductStock) => {
        if(errorInArticle === false && errorInQuantity === false) { 
            console.log("STOCK DEL PRODUCTO", choosenProductStock)
            console.log("CANTIDAD ELEGIDA", quantity)
            if(quantity < choosenProductStock) { 
              const choosenProductTotalPrice = price * quantity
              const newProduct = { productName, productId, quantity, price, replacementPrice, choosenProductTotalPrice };
              setNewOrderDetailWithChanges([...newOrderDetailWithChanges, newProduct]);
              setChoosenProductId("")
              setChoosenProductName("")
              setChoosenProductQuantity("")
              setChoosenProductPriceReplacement("")
              setChoosenProductPrice("")
              setChoosenProductStock(0)
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
        setProductsSelected((prevProducts) =>
          prevProducts.filter((prod) => prod.productId !== productIdToDelete)
        );
    };

  
   /* const addNewArticlesToOrder = () => { //ESTA FUNCION ENVIA EL DETALLE NUEVO SIN VERIFICAR NADA
        axios.put(`http://localhost:4000/orders/addNewOrderDetail/${orderData.id}`, productsSelected)
             .then((res) => { 
              console.log(res.data)
              updateList()
              setSuccessAddMessage(true)
              setTimeout(() => { 
                closeModalNow()
                setSuccessAddMessage(false)
              }, 1500)
             })
             .catch((err) => { 
              console.log(err)
             })
    }*/

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
                sumarStock.push(dif); 
              }  else if (dif.quantity < 0){ 
                dif.quantity = Math.abs(dif.quantity);
                disminuirStock.push(dif); 
             }
            });
            console.log("ARRAY ORIGINAL DE COMPRA DETAIL", originalOrderDetailData)
            console.log("NUEVO ARRAY ENTERO DE COMPRA DETAIL", newOrderDetailWithChanges)
            console.log("SUMAR STOCK POR DIFERENCIA POSITIVA", sumarStock)
            console.log("DESCONTAR STOCK POR DIFERENCIA NEGATIVA", disminuirStock) 
            const newTotalPurchaseAmount = newOrderDetailWithChanges.reduce((acc, el) => acc + el.price * el.quantity, 0);
            console.log(formatePrice(newTotalPurchaseAmount))

            const newPurchaseDetailData = ({ 
              newTotalAmount: newTotalPurchaseAmount,
              toDiscountStock: disminuirStock,
              toIncrementStock: sumarStock,
              completeNewDetail: newOrderDetailArray
            })
            
            console.log(newOrderDetailWithChanges) //ACA ESTAN LOS DATOS ENTEROS PARA ENVIAR AL BACKEND, ESTE ARRAY DEBE RECIBIR EL UPDATE ORDER

          /* const updateDetail = await axios.put(`http://localhost:4000/purchases/updatePurchaseDetail/${purchaseData.id}`, newPurchaseDetailData)
            console.log(updateDetail.data)
            if(updateDetail.status === 200) { 
                setSuccesMessage(true)
                setTimeout(() => { 
                  closeModalNow()
                  updateChanges()
                  setSuccesMessage(false)
                  setModifyData(false)
                  setModifyOrderDetailData(false)
                }, 2000)
            }
*/
            } catch (error) {
              console.log(error) 
            }

       };
    



  return (
    <div className="flex flex-col justify-center items-center">
            {newOrderDetailWithChanges.map((ord, index) => (
                <div key={index} className="flex flex-col">
                <div className="flex items-center justify-start w-72 gap-4 mt-2">
                    <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                    <Input type="number" variant="underlined" label="Cantidad" className="max-w-md min-w-sm" value={ord.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                </div>
                </div>
            ))}

               {
                productsSelected.length > 0 ? (
                  productsSelected.map((ord, index) => (
                    <>
                      <div key={index} className="flex flex-col">
                        <div className="flex items-center justify-start w-72 gap-4 mt-2">
                          <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                          <Input type="number" variant="underlined" label="Cantidad" className="max-w-md min-w-sm" value={ord.quantity}/>
                          <p className="text-xs cursor-pointer" onClick={() => handleRemoveProduct(ord.productId)}>X</p>
                        </div>                      
                      </div>
                    </>
                  ))
                ) : null
               }

            <div className="flex items-center justify-center mt-2">
            {productsSelected.length > 0 ? (
                <p className="font-bold text-zinc-600">       
                    Total: {formatePrice(
                    newOrderDetailWithChanges.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0) +
                    productsSelected.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0)
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
                                    <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500" key={prod._id} 
                                        onClick={() =>  chooseProduct(prod.articulo, prod._id, prod.precioUnitarioAlquiler, prod.precioUnitarioReposicion, prod.stock)} >
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
                        <Button className="mt-6 w-60 font-medium text-white bg-green-800"  
                                onClick={() => addProductSelected(choosenProductName, choosenProductId, choosenProductQuantity, choosenProductPrice, choosenProductPriceReplacement, choosenProductStock )}>
                            Añadir
                        </Button> 
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
            
            {addNewProductToOrder ? <Button className="bg-green-800 font-bold text-white  w-56" onClick={() => cancelAddProduct()}>Cancelar Agregados</Button> :
            <Button className="bg-green-800 font-bold text-white  w-56" onClick={() => cancelAddProduct()}>Cancelar</Button>}
            
            </div>
            {successAddMessage ? 
            <div className="mt-6">
                <p className="font-bold mt-6 text-green-800 text-sm">Añadido Correctamente</p> 
            </div> : null }
  </div>
  )
}

export default EditDetailOrderData
