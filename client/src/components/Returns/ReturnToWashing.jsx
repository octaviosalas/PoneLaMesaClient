import React, { useState, useMemo } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";

export const ReturnToWashing = ({orderData, updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [succesMessage, setSuccesMessage] = useState(false);
  const originalOrderDetailData = useMemo(() => orderData.orderDetail, []);

  const handleOpen = () => { 
    console.log(orderData)
    console.log(originalOrderDetailData)
    onOpen()
    if(orderData.missingArticlesData.length === 0) { //SI NO TIENE ARTICULOS FALTANTES MANDO ESTO A LAVADO
      unifiedArticlesByQuantity(orderData.orderDetail)    
      console.log("No tiene faltantes")
    } else { 
      console.log("Tiene faltantes")
      const getProductMissed = orderData.missingArticlesData.map((or) => or.missedProductsData).map((orig) => orig.productMissed).flat() // SI TIENE ARTICULOS FALTANTES MANDO ESTO
      console.log("Articulos Faltantes", getProductMissed)
      const detectProductsWithMissedQuantitys = originalOrderDetailData.map((original) => { 
        const detectMissed = getProductMissed.filter((prodMissed) => prodMissed.productId === original.productId)
        return  { 
          originalOrderQuantity: original.quantity,
          missedQuantity: detectMissed.map((missed) => missed.missedQuantity)[0],
          difference: original.quantity -  detectMissed.map((missed) => missed.missedQuantity)[0],
          productName:  original.productName,
          productId: original.productId
        }
      })
    //ACA DEBO FILTRAR AL ORIGINAL, DEVOLVER EL QUE NO TIENE EL ID IGUAL A detectProductsWithMissedQuantitys Y SI LO TIENE, DEVOLVER EL NUEVO
    console.log(detectProductsWithMissedQuantitys)
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
             quantityToWash: quantityToWash,
             productId: productId
          };
         });
        console.log(transformDataInArray)
      }  catch (error) {
      console.log(error)
    }
  }

  const returnOrderToWashed = async () => { 
    try {
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
                <div className="flex items-center justify-center mt-4">
                  <p className="text-sm font-medium text-green-800">¿Estas seguro de pasar la orden {orderData.orderNumber} del mes de {orderData.month} a Lavado?</p>
                </div>
              </ModalBody>
              <ModalFooter className="mb-2 flex gap-4 items-center justify-center">
                <Button className="bg-green-800 text-sm text-white font-medium" onClick={() => returnOrderToWashed()}>
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