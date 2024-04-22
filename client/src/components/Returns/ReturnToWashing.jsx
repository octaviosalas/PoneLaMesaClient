import React, { useState, useMemo, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

export const ReturnToWashing = ({orderData, updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [succesMessage, setSuccesMessage] = useState(false);
  const originalOrderDetailData = useMemo(() => orderData.orderDetail, []);
  const [withOutMissedArticles, setWithOutMissedArticles] = useState(false)
  const [withMissedArticles, setWithMissedArticles] = useState(false)
  const [dataToSendToWash, setDataToSendToWash] = useState([])
  const [dataToSendToDeposit, setDataToSendToDeposit] = useState([])
  const [orderHasDepositArticles, setOrderHasDepositArticles] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState(0)

 
  const handleOpen = () => { 
    console.log(orderData)
    console.log("Array original del pedido: ", originalOrderDetailData)
    onOpen()

    if(orderData.missingArticlesData.length === 0) { 
      console.log("Esta orden no tiene faltantes")
      setWithOutMissedArticles(true)
      setWithMissedArticles(false)
      const dataToWash = orderData.orderDetail.filter((prod) => prod.choosenProductCategory === "local") //productos de local
      console.log("jejeje", dataToWash)
      unifiedLocalArticlesByQuantity(dataToWash)    
      const findDeposit = orderData.orderDetail.some((ord) => ord.choosenProductCategory === "deposito")  //verifico si hay productos de deposito
          if(findDeposit) { 
              setOrderHasDepositArticles(true)
              const getDepositArticles = orderData.orderDetail.filter((ord) => ord.choosenProductCategory === "deposito") // en caso de haber, creo la data y seteo el estado para backend
              unifiedDepositArticlesByQuantity(getDepositArticles)  
              console.log(orderHasDepositArticles)
          } else { 
              setOrderHasDepositArticles(false)
              console.log(orderHasDepositArticles)
          }

    } else { 
      console.log("Esta orden tiene faltantes")
      setWithMissedArticles(true)
      setWithOutMissedArticles(false)

      const getProductMissed = orderData.missingArticlesData.map((or) => or.missedProductsData).map((orig) => orig.productMissed).flat() 

      const detectProductsWithMissedQuantitys = originalOrderDetailData.map((original) => { 
        const detectMissed = getProductMissed.filter((prodMissed) => prodMissed.productId === original.productId)
        return  { 
          originalOrderQuantity: original.quantity,
          missedQuantity: detectMissed.map((missed) => missed.missedQuantity)[0],
          quantityToWash: original.quantity -  detectMissed.map((missed) => missed.missedQuantity)[0],
          productName:  original.productName,
          productId: original.productId,
          productPrice: original.price,
          productCategory: original.choosenProductCategory
        }
      })
      
    const theFinalArrayData = detectProductsWithMissedQuantitys.map((prod) => { 
      return { 
        productName: prod.productName,
        productId: prod.productId,
        quantity: prod.missedQuantity !== undefined ? prod.quantityToWash : prod.originalOrderQuantity,
        productCategory: prod.productCategory,
        productPrice: prod.productPrice
      }
    })

    const justWashProducts = theFinalArrayData.filter((ord) =>  ord.productCategory === "local")
    const transformDataLocalArticles = justWashProducts.map((dep) => { 
      return { 
        productName: dep.productName,
        quantity: dep.quantity,
        productId: dep.productId,
        productPrice: dep.productPrice,
      }
    })
    console.log("Array para enviar al backend de LAVADO", transformDataLocalArticles)
    setDataToSendToWash(transformDataLocalArticles)

    const depositArticles = theFinalArrayData.filter((ord) => ord.productCategory === "deposito")
    const transformDataDepositArticles = depositArticles.map((dep) => { 
      return { 
        productName: dep.productName,
        quantity: dep.quantity,
        productId: dep.productId
      }
    })
    console.log("Array para enviar al backend de DEPOSITO", transformDataDepositArticles)
      setDataToSendToDeposit(transformDataDepositArticles)
      if(transformDataDepositArticles.length > 0) { 
        setOrderHasDepositArticles(true)
      } else { 
        console.log("ESTA ORDEN NO POSEE ARTICULOS PARA DEPOSITO")
        setOrderHasDepositArticles(false)
      }

    }
  }

  

  const unifiedLocalArticlesByQuantity = async (item) => { 
    console.log("ITEMMM", item)
    try {
        const agroupArticlesByName = await item.reduce((acc, el) => { 
          const articleName = el.productName
          if(acc[articleName]) { 
            acc[articleName].push({quantity: el.quantity, productId: el.productId, productPrice: el.price});
          } else { 
            acc[articleName] = [{quantity: el.quantity, productId: el.productId, productPrice: el.price}];
          }
        return acc
        }, {})
        const transformDataInArray = Object.entries(agroupArticlesByName).map(([productName, items]) => {
          const quantityToWash = items.reduce((acc, item) => acc + item.quantity, 0);
          const productId = items[0].productId;
          const productPrice = items[0].productPrice;
          return {
             productName: productName,
             quantity: quantityToWash,
             productId: productId,
             productPrice: productPrice
          };
         });
         console.log("RESPUESTA DE unifiedLocalArticlesByQuantity", transformDataInArray)
         setDataToSendToWash(transformDataInArray)
      }  catch (error) {
      console.log(error)
    }
  }

  
  const unifiedDepositArticlesByQuantity = async (item) => { 
    try {
        const agroupArticlesByName = await item.reduce((acc, el) => { 
          const articleName = el.productName
          if(acc[articleName]) { 
            acc[articleName].push({quantity: el.quantity, productId: el.productId});
          } else { 
            acc[articleName] = [{quantity: el.quantity, productId: el.productId}];
          }
        return acc
        }, {})
        const transformDataInArray = Object.entries(agroupArticlesByName).map(([productName, items]) => {
          const quantityToWash = items.reduce((acc, item) => acc + item.quantity, 0);
          const productId = items[0].productId;
          return {
             productName: productName,
             quantity: quantityToWash,
             productId: productId
          };
         });
        console.log("RESPUESTA DE unifiedDepositArticlesByQuantity", transformDataInArray)
        setDataToSendToDeposit(transformDataInArray)
      }  catch (error) {
      console.log(error)
    }
  }


  const sendDataToWashs =  async () => { 
    if(orderHasDepositArticles === true) { 
      console.log("enviando articulos a lavado")
        const sendNewArticlesToWashModel = await axios.post("http://localhost:4000/cleaning/addNewArticles", dataToSendToWash)
          console.log(sendNewArticlesToWashModel.data)
            if(sendNewArticlesToWashModel.status === 200) { 
              console.log("enviando articulos a deposito")
                const sendNewArticlesToDepositModel = await axios.post(`http://localhost:4000/deposit/addNewArticles`, dataToSendToDeposit)
                 console.log(sendNewArticlesToDepositModel.data)
                  if(sendNewArticlesToDepositModel.status === 200) { 
                    console.log("envie deposito + lavado, ahora paso orden a lavado")
                     const newStatus = "Lavado"
                      const changeOrderStatus = await axios.put(`http://localhost:4000/orders/changeOrderState/${orderData.id}`, {newStatus})
                       console.log(changeOrderStatus.data)
                        if(changeOrderStatus.status === 200) { 
                          setSuccesMessage(true)
                            updateList()
                           setTimeout(() => { 
                           setSuccesMessage(false)
                           onClose()
                        }, 1800)
                      }
                   }
                }
    } else { 
        const sendNewArticlesToWashModel = await axios.post("http://localhost:4000/cleaning/addNewArticles", dataToSendToWash)
         console.log(sendNewArticlesToWashModel.data)
          if(sendNewArticlesToWashModel.status === 200) { 
            const newStatus = "Lavado"
             const changeOrderStatus = await axios.put(`http://localhost:4000/orders/changeOrderState/${orderData.id}`, {newStatus})
              console.log(changeOrderStatus.data)
               if(changeOrderStatus.status === 200) { 
                 setSuccesMessage(true)
                  updateList()
                  setTimeout(() => { 
                    setSuccesMessage(false)
                    onClose()
                 }, 1800)
              }
           }
        }
    }

  return (
    <>
      <p className="text-xs font-medium text-green-800 cursor-pointer" onClick={handleOpen}>Pasar a Lavado</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Pasar a Lavado</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center mt-4">
                  <p className="text-sm font-medium text-green-800">¿Estas seguro de pasar la orden a Lavado?</p>
                  {withMissedArticles ? <p className="text-xs font-medium text-zinc-600 mt-2">Los articulos se pasaran a lavado descontando los faltantes del pedido</p> :
                   <p className="text-xs font-medium text-zinc-600 mt-2">Esta orden no posee faltantes</p>}
                </div>
              </ModalBody>
              <ModalFooter className="mb-2 flex gap-4 items-center justify-center">
                <Button className="bg-green-800 text-sm text-white font-medium" onClick={() => sendDataToWashs()}>
                  Confirmar
                </Button>
                <Button className="bg-green-800 text-sm text-white font-medium" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
              {succesMessage ? 
                <div className="mt-4 mb-4 flex items-center justify-center">
                   <p className="font-medium text-green-800 text-sm">Orden pasada a Lavado con Exito ✔</p>
                </div> : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ReturnToWashing


