import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from "axios";

import { useState, useEffect } from "react";

const HistoricArticles = ({articleData}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
    const [ordersProducts, setOrdersProducts] = useState([])

    useEffect(() => { 
      axios.get("http://localhost:4000/orders")
           .then((res) => { 
            const data = res.data
            const getOrdersOfThisProduct = data.map((d) => d.orderDetail.filter((ord) => ord.productId === articleData.id))
            console.log(`Ordenes de: ${articleData.articleName}`, getOrdersOfThisProduct)
            setOrdersProducts(getOrdersOfThisProduct)
            console.log("Todas las ordenes", res.data)
           })
           .catch((err) => { 
            console.log(err)
           })
    }, [articleData.id])



  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Historico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">Detalle del Pedido</ModalHeader>
              <ModalBody className="flex flex-col">
             <p>Id:  {articleData.id}   </p> 
             <b>Cantidad de pedidos: {ordersProducts.length} </b>   
              <p>{articleData.articleName}</p>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-2">
                <Button  className="font-bold text-white text-sm bg-green-600 w-56" variant="light" onPress={onClose}> Cerrar </Button>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default HistoricArticles


