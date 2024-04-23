import React from "react";
import { useState  } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../../functions/gralFunctions";
import { BarChart } from '@tremor/react';


const OrdersByClientGraphic = ({ordersData}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [graphicData, setGraphicsData] = useState([])
    const [size, setSize] = useState("4xl")

    const agroupOrdersByClient = (ordersData) => { 
        const getData = ordersData.reduce((acc, el) => { 
            const client = el.client
            if(acc[client]) { 
                acc[client].push(el)
            } else { 
                acc[client] = [el]
            }
            return acc
        }, {})
        const transformData = Object.entries(getData).map(([client, data]) => { 
            return { 
                client: client,
                ordersQuantity: data.length,
                totalAmount: formatePrice(data.reduce((acc, el) => acc + el.total, 0))
            }
        })
        console.log(transformData)
        setGraphicsData(transformData)
        return transformData 
    }

    const handleOpen = () => { 
       agroupOrdersByClient(ordersData)
       onOpen()
    }

  
    const dataFormatte = (number) =>
    Intl.NumberFormat('us').format(number).toString();


  return (
    <>
      <p className="text-green-800 font-medium text-sm cursor-pointer" onClick={handleOpen}>Ver Grafico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Grafico de Alquileres por Clientes</ModalHeader>
              <ModalBody>
              {graphicData.length === 0 ? 
               <Loading/>
               :
                <BarChart
                    data={graphicData}
                    index="client"
                    categories={['ordersQuantity']}
                    colors={['green']} 
                    valueFormatter={dataFormatte}
                    yAxisWidth={60}
                    onValueChange={(v) => console.log(v)}
                />}
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button className="w-72 font-medium text-white text-sm bg-green-800" onPress={onClose}>
                  Cerrar
                </Button>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default OrdersByClientGraphic
