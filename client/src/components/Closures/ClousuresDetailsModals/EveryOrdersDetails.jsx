import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { formatePrice } from "../../../functions/gralFunctions";
import Loading from "../../Loading/Loading";


const EveryOrdersDetails = ({ordersData, first, second, type}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [columns, setColumns] = useState([]);
  const [size, setSize] = useState("4xl")
  const [withOutData, setWithOutData] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOpen = () => { 
    setLoading(true)
    onOpen()
    if (ordersData &&  Array.isArray(ordersData) && ordersData.length > 0) {
      setWithOutData(false)
      setLoading(false)
      const firstDetail = ordersData[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== '_id' &&  property !== "__v"  &&  property !== "orderDetail"  &&  property !== "subletsDetail"  &&  property !== "downPaymentData"  
      &&  property !== "missingArticlesData"  &&  property !== "orderCreator" &&  property !== "placeOfDelivery" &&  property !== "dateOfDelivery" &&  property !== "clientId"   &&  property !== "month"   &&  property !== "year"  &&  property !== "day" &&  property !== "paid" &&  property !== "returnDate" &&  property !== "returnPlace" &&  property !== "typeOfClient");
  
      const columnLabelsMap = {
        orderStatus: 'Estado',
        orderNumber: 'Numero de Orden',
        client: 'Cliente',
        date: 'Fecha',
      };
  
      const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
      }));
  
      setColumns(tableColumns);
    } else { 
      setWithOutData(true)
      setLoading(false)
    }
  }

 
  

  return (
    <>
      <p className="text-sm font-medium text-green-800 cursor-pointer mt-1" onClick={handleOpen}>Ver Detalle</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
             {type == "all" ? <ModalHeader className="flex flex-col gap-1">Pedidos cargados del {first} al {second}</ModalHeader> : null}
             {type == "noPaid" ? <ModalHeader className="flex flex-col gap-1">Pedidos Pendientes de Cobro del {first} al {second}</ModalHeader> : null}
             {type == "paid" ? <ModalHeader className="flex flex-col gap-1">Pedidos Cobrados del {first} al {second}</ModalHeader> : null}
              <ModalBody className="flex items-center justify-center">
              {withOutData === false && loading === false ? ( 
                    <Table aria-label="Example table with dynamic content" className="w-[600px] 2xl:w-[750px] flex items-center justify-center mt-2 max-h-[400px] overflow-y-auto">
                        <TableHeader columns={columns}>
                          {(column) => (
                            <TableColumn key={column.key} className="text-xs gap-6">
                              {column.label}
                            </TableColumn>
                          )}
                        </TableHeader>
                        <TableBody items={ordersData}>
                        {(item) => (
                          <TableRow key={item._id}>
                            {columns.map(column => (
                            <TableCell key={column.key} className='text-left'>
                            {column.cellRenderer ? (
                              column.cellRenderer({ row: { original: item } })
                            ) : (
                              column.key === "amount" || column.key === "value" ? (
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
                 ) : withOutData === true && loading === false ? (
                    <p className="font-medium text-sm text-zinc-600">No existen Ordenes durante las fechas elegidas</p>
                  ) : <Loading/>}
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button className="text-white font-medium bg-green-800 w-72" onPress={onClose}>
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


export default EveryOrdersDetails
