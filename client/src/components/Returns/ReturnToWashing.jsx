import React, { useState, useMemo } from "react";
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


  const handleOpen = () => { 
    console.log(orderData)
    console.log("Array original del pedido: ", originalOrderDetailData)
    onOpen()
    if(orderData.missingArticlesData.length === 0) { 
      console.log("Esta orden no tiene faltantes")
      setWithOutMissedArticles(true)
      setWithMissedArticles(false)
      unifiedArticlesByQuantity(orderData.orderDetail)    

      const findDeposit = orderData.orderDetail.some((ord) => ord.choosenProductCategory === "deposito") //Aca arranco a corroborar deposito    
      if(findDeposit) { 
        const getDepositArticles = orderData.orderDetail.filter((ord) => ord.choosenProductCategory === "deposito")
        console.log("ORDEN SIN FALTANTES, ARTICULOS A DEPOSITO:", getDepositArticles)
        setDataToSendToDeposit(getDepositArticles)
        setOrderHasDepositArticles(true)
      }

    } else { 

      setWithMissedArticles(true)
      setWithOutMissedArticles(false)
      console.log("Esta orden tiene faltantes")
      const getProductMissed = orderData.missingArticlesData.map((or) => or.missedProductsData).map((orig) => orig.productMissed).flat() 
      console.log("Articulos Faltantes", getProductMissed)

      const detectProductsWithMissedQuantitys = originalOrderDetailData.map((original) => { 
        const detectMissed = getProductMissed.filter((prodMissed) => prodMissed.productId === original.productId)
        return  { 
          originalOrderQuantity: original.quantity,
          missedQuantity: detectMissed.map((missed) => missed.missedQuantity)[0],
          quantityToWash: original.quantity -  detectMissed.map((missed) => missed.missedQuantity)[0],
          productName:  original.productName,
          productId: original.productId,
          productCategory: original.choosenProductCategory
        }
      })
      
    console.log("Los faltantes del pedido", detectProductsWithMissedQuantitys)
    const theFinalArrayData = detectProductsWithMissedQuantitys.map((prod) => { 
      return { 
        productName: prod.productName,
        productId: prod.productId,
        quantityToPassToWash: prod.missedQuantity !== undefined ? prod.quantityToWash : prod.originalOrderQuantity,
        productCategory: prod.productCategory
      }
    })

    const justWashProducts = theFinalArrayData.filter((ord) =>  ord.productCategory === "local")
    console.log("Array para enviar al backend de LAVADO", justWashProducts)
    const depositArticles = theFinalArrayData.filter((ord) => ord.productCategory === "deposito")
    console.log("ORDEN CON FALTANTES, ARTICULOS CON CANTIDAD CORRECTA PARA DEPOSITO", depositArticles)
      if(depositArticles.length > 0) { 
        setOrderHasDepositArticles(true)
        setDataToSendToDeposit(depositArticles)
      } else { 
        console.log("ESTA ORDEN NO POSEE ARTICULOS PARA DEPOSITO")
      }
    setDataToSendToWash(justWashProducts)
    }
  }

  const unifiedArticlesByQuantity = async (item) => { 
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
             quantityToPassToWash: quantityToWash,
             productId: productId
          };
         });
        console.log(transformDataInArray)
        setDataToSendToWash(transformDataInArray)
      }  catch (error) {
      console.log(error)
    }
  }

  
  const sendDataToWash =  async () => { 
    console.log(dataToSendToWash)
     try {
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
     } catch (error) {
         console.log(error)
     }
  }


  return (
    <>
      <p className="text-xs font-medium text-green-800 cursor-pointer" onClick={handleOpen}>Pasar a Lavado</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Modal Title</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center mt-4">
                  <p className="text-sm font-medium text-green-800">¿Estas seguro de pasar la orden a Lavado?</p>
                  {withMissedArticles ? <p className="text-xs font-medium text-zinc-600 mt-2">Los articulos se pasaran a lavado descontando los faltantes del pedido</p> :
                   <p className="text-xs font-medium text-zinc-600 mt-2">Esta orden no posee faltantes</p>}
                </div>
              </ModalBody>
              <ModalFooter className="mb-2 flex gap-4 items-center justify-center">
                <Button className="bg-green-800 text-sm text-white font-medium" onClick={() => sendDataToWash()}>
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