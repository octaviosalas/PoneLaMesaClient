import React, {useState, useEffect} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { BarChart } from '@tremor/react';
import { useScroll } from 'framer-motion';

const ModalGraphicAllExpenses = ({data}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [expensesData, setExpensesData] = useState([])

    const createTheGraphic = () => { 
        const agroupData = data.reduce((acc, el) => { 
          const typeOfExpense = el.typeOfExpense
          if(acc[typeOfExpense]) { 
             acc[typeOfExpense].push(el)
          } else { 
             acc[typeOfExpense] = [el]
          }
          return acc
        }, {}) 
        console.log(agroupData)
        const transformData = Object.entries(agroupData).map(([typeOfExpense, data]) => { 
           return { 
             TipoDeGasto: typeOfExpense,
             CantidadDeGastos: typeOfExpense.length,
           }
        })
        setExpensesData(transformData)
        console.log(transformData)
     }

    const handleOpen = () => { 
        console.log(data)
        createTheGraphic()
        onOpen()
    }


    const dataFormatte = (number) =>
    Intl.NumberFormat('us').format(number).toString();
 


  return (
    <div>
       <>
      <p className="text-xs text-green-800 cursor-pointer font-medium" onClick={handleOpen}>Ver Grafico</p>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Grafico de Gastos</ModalHeader>
                    <ModalBody>
                    {expensesData.length === 0 ? 
                        <Loading/>
                        :
                            <BarChart
                                data={expensesData}
                                index="TipoDeGasto"
                                categories={['CantidadDeGastos']}
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
    </div>
  )
}

export default ModalGraphicAllExpenses
