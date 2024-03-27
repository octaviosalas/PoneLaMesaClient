import React, {useState, useEffect} from 'react'
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
    }, [])

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
              setProductsSelected([...productsSelected, newProduct]);
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

    const changeOrderDetail = () => {   //ESTA FUNCION SE ENCARGA DE SABER QUE RESTAR AL STOCK Y QUE SUMAR AL STOCK 
        const newOrderDetailData = ({
          total: newOrderDetailArray.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0),
          orderDetail: newOrderDetailArray
        })   

        const productsToIncrease = [];
        const productsToDecrease = [];
        for (let i = 0; i < newOrderDetailData.orderDetail.length; i++) {
        const newOrderItem = newOrderDetailData.orderDetail[i];
        const realDataItem = theRealDataOfOrderDetail.find(item => item.productId === newOrderItem.productId);

        if (realDataItem) {
            const productId = newOrderItem.productId;
            const quantityInNewOrder = parseInt(newOrderItem.quantity, 10);
            const quantityInRealData = parseInt(realDataItem.quantity, 10);

            if (quantityInNewOrder > quantityInRealData) {
                const difference = quantityInNewOrder - quantityInRealData;
                productsToIncrease.push({ productId, quantity: difference });
            } else if (quantityInNewOrder < quantityInRealData) {
                const difference = quantityInRealData - quantityInNewOrder;
                productsToDecrease.push({ productId, quantity: difference });
              }
            }
           }
          console.log("Productos a aumentar:", productsToIncrease);
          console.log("Productos a disminuir:", productsToDecrease); 

            const dataToSend = {
                productData: productsToDecrease.map(product => ({
                    productId: product.productId,
                    quantity: product.quantity
                }))
              };

              axios.put('http://localhost:4000/products/returnQuantityToStock', dataToSend)
              .then((res) => { 
                console.log(res.data)                             
              })
              .catch((err) => {
                console.log(err)
              })

               axios.put(`http://localhost:4000/orders/updateOrderDetail/${orderData.id}`, {newOrderDetailData})    
                .then((res) => { 
                  console.log(res.data)
                  setSuccesMessage(true)
                  updateList()
                  setTimeout(() => { 
                    closeModalNow()
                    setSuccesMessage(false)
                  }, 2500)
                })
                .catch((err) => console.log(err))
    }

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



  return (
    <div className="flex flex-col justify-center items-center">
            {newOrderDetailArray.map((ord, index) => (
                <div key={index} className="flex flex-col">
                <div className="flex items-center justify-start w-72 gap-4 mt-2">
                    <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                    <Input type="number" variant="underlined" label="Cantidad" className="max-w-md min-w-sm" value={ord.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                </div>
                </div>
            ))}
            <div className="flex items-center justify-center mt-2">
            {productsSelected.length > 0 ? (
                <p className="font-bold text-zinc-600">       
                    Total: {formatePrice(
                    newOrderDetailArray.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0) +
                    productsSelected.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0)
                    )}
                </p>
                ) : (
                <p className='text-zinc-600 font-medium text-sm'>Total: {formatePrice(newOrderDetailArray.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0))}</p>
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
                              setChoosenProductQuantity(e.target.value);
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

                   

                {productsSelected.length !== 0 ? 
                    <div className="flex flex-col">
                    <div className="flex flex-col mt-6">
                        {productsSelected.map((prod) => ( 
                            <div className="flex justify-between gap-4 items-center mt-1" key={prod._id}>
                            <div className="flex gap-2 items-center">
                                <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Producto: </b> {prod.productName}</p>
                                <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Cantidad: </b>{prod.quantity}</p>
                                <p className="text-zinc-500 text-xs"><b className="text-zinc-600 text-xs font-bold">Precio Unitario Alquiler: </b>{formatePrice(prod.price)}</p>
                            </div>
                            <div>
                                <p className="text-xs cursor-pointer" onClick={() => handleRemoveProduct(prod.productId)}>X</p>
                            </div>
                            
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col mt-2">
                        <p className="text-zinc-700 text-sm"> <b>Total:</b>{formatePrice(productsSelected.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0))} ARS</p> 
                    </div>
                    </div>  
                    :
                    null
                } 

                {
                insufficientStock ?
                <div className="flex items-center justify-center mt-4">
                        <p className="font-medium text-sm text-green-600 underline">Stock Insuficiente</p>
                </div>
                    : 
                    null
                }  
                </div>
                :
                null
            }

            <div className="flex items-center gap-6 mt-6">
            <Button className="bg-green-800 font-bold text-white w-56" onClick={() => changeOrderDetail()}>Confirmar</Button>

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
