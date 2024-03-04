import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from "axios";
import Loading from "../Loading/Loading"

import { useState, useEffect } from "react";

const HistoricProviders = ({providerData, updateList}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
    const [providerExpenses, setProviderExpenses] = useState([]);
    const [withOutExpenses, setWithOutExpenses] = useState(false);
    const [loadingData, setLoadingData] = useState(true)

  
    const handleOpen = async () => { 
      onOpen();
      await getHistoricOfEachProviders();
    }

    const getHistoricOfEachProviders = async () => { 
      try {
         const response = await axios.get("http://localhost:4000/expenses")
         const data = response.data
         const expenses = data
         const providersDetail = expenses.filter((prov) => providerData.id === prov.providerId)
         const resultsOfThisProvider = providersDetail.map((prov) => { 
           return {
              total: prov.amount,
              mes: prov.month,
              razon: prov.typeOfExpense,
              año: prov.year,     
              detalle: prov.expenseDetail   
           }
         })
         console.log(resultsOfThisProvider)
         if(resultsOfThisProvider.length > 0) { 
          setProviderExpenses(resultsOfThisProvider)
         } else { 
          setWithOutExpenses(true);
          console.log("No tiene gastos este proveedor")
         }
         setTimeout(() => { 
          setLoadingData(false)
        }, 2000)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    useEffect(() => {
      if (providerExpenses.length > 0) {
        console.log("me ejecuto")
        const firstDetail = providerExpenses[0];
        const properties = Object.keys(firstDetail);
        const filteredProperties = properties.filter(property => property !== 'detalle');
      
        const columnLabelsMap = {
          total: 'Total Gastado',
          mes: 'Mes',
          razon: 'Razon',
          año: 'Año',
        };
      
        const tableColumns = filteredProperties.map(property => ({
          key: property,
          label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
        }));
      
        setColumns(tableColumns);
        console.log(tableColumns);
      } else { 
        setWithOutExpenses(true)
      }
    }, [providerExpenses]);

  return (
    <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Historico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-xl bg-white text-black'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p  className="text-zinc-600 font-bold text-md">Historico de Proveedor</p>
                <p  className="text-zinc-600 font-medium text-sm">{providerData.name}</p>
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center">   
             {loadingData ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loading />
                    </div>       
                    ) : (
                      providerExpenses.length > 0 ? (
                        <div className="mt-4 flex flex-col  ">
                          <Table aria-label="Example table with dynamic content" className="w-[480px] 2xl-w-[550px] flex items-center justify-center mt-2 shadow-2xl overflow-y-auto max-h-[400px] ">
                            <TableHeader columns={columns} >
                              {(column) => (
                                <TableColumn key={column.key} className="text-xs gap-6">
                                  {column.label}
                                </TableColumn>
                              )}
                            </TableHeader>
                            <TableBody items={providerExpenses}>
                              {(item) => (
                                <TableRow key={item.total}>
                                  {columns.map(column => (
                                    <TableCell key={column.key} className="text-start items-start">
                                      {column.cellRenderer ? (
                                        column.cellRenderer({ row: { original: item } })
                                      ) : (
                                        (column.key === "total") ? (
                                          formatePrice(item[column.key])
                                        ) : (
                                          item[column.key]
                                        )
                                      )}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        <div className="flex flex-col justify-end items-end  mt-4">
                            <p className="text-zinc-600 font-medium text-xs">Total Gastado en "{providerData.name}":  {formatePrice(providerExpenses.reduce((acc, el) => acc + el.total, 0))}</p>
                            <p className="text-zinc-600 font-medium text-xs">Cantidad de Gastos: {providerExpenses.length}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-cemnter justify-center">
                           <p className="font-medium text-zinc-600 text-sm">Al momento no se han registrado gastos para este proveedor</p>
                        </div>

                      )
                    )}
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

export default HistoricProviders


