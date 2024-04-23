import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { BarChart } from '@tremor/react';
import Loading from "../../Loading/Loading";

const ModalGraphicPurchase = ({data}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [graphicData, setGraphicData] = useState([])

    const createGraphic = async () => { 
        try {
          
           const agrupeProduct = data.map((r) => r.purchaseDetail).flat()
           console.log(agrupeProduct)
           const finalAgroup = agrupeProduct.reduce((acc, el) => { 
               const productName = el.productName
               if(acc[productName]) { 
                   acc[productName].push(el)
               } else { 
                   acc[productName] = [el]
               }
               return acc
           }, {})
           console.log(finalAgroup)
           const trnsform = Object.entries(finalAgroup).map(([productName, data]) => { 
               return  { 
                   producto: productName,
                   cantidad: data.length
               }
           })
           setGraphicData(trnsform)
           
        } catch (error) {
            console.log(error)
        }
   }

    const handleOpen = () => { 
        createGraphic()
        onOpen()
    }


 

    const dataFormatte = (number) =>
    Intl.NumberFormat('us').format(number).toString();

  return (
    <>
      <p className="text-xs text-green-800 cursor-pointer font-medium" onClick={handleOpen}>Ver Grafico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Grafico de Articulos Comprados</ModalHeader>
              <ModalBody>
               {graphicData.length === 0 ? 
               <Loading/>
               :
                <BarChart
                    data={graphicData}
                    index="producto"
                    categories={['cantidad']}
                    colors={['green']} 
                    valueFormatter={dataFormatte}
                    yAxisWidth={48}
                    onValueChange={(v) => console.log(v)}
                />}
              </ModalBody>
              <ModalFooter className="flex items-center justify-center mt-4 mb-4">
                <Button className="bg-green-800 text-white font-medium text-sm w-72" onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalGraphicPurchase
