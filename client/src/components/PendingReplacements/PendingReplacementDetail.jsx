import React, {useState, useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import MarkDebtAsPaid from "../Modals/MarkDebtAsPaid";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import ClientTelephoneData from "./ClientTelephoneData";

const PendingReplacementDetail = ({data, updateList}) => { 

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [size, setSize] = useState("2xl")
  const [columns, setColumns] = useState([])

  const handleOpen = () => { 
    onOpen()
    console.log("ACA", data)
    if (data && data.detail && Array.isArray(data.detail) && data.detail.length > 0) {
      const firstDetail = data.detail[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== 'productId' &&  property !== 'choosenProductCategory' &&  property !== "choosenProductEstimativeWashedTime"
       && property !== 'price' &&  property !== "productId" && property !== "choosenProductTotalPrice"  && property !== "quantity"
      );
  
      const columnLabelsMap = {
        productName: 'Articulo',
        missing: 'Cantidad',
        replacementPrice: 'Precio unitario Reposicion',
      };
  
      const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
      }));
  
      setColumns(tableColumns);
    }
  }



  return (
    <>
      <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={handleOpen}>Detalle</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reposicion Pendiente de Cobro
                <div>
                    <p className="text-zinc-600 text-sm font-medium">Cliente: {data.clientData.name}</p>
                    <p className="text-red-600 text-sm font-medium">Deuda: {formatePrice(data.amountToPay)}</p>
                    <p className="text-zinc-600 text-sm font-medium">Orden Correspondiente: Numero {data.orderCompletedData.map((ord) => ord.orderNumber)[0]} del mes de {data.orderCompletedData.map((ord) => ord.month)[0]} del {data.orderCompletedData.map((ord) => ord.year)[0]}</p>
                </div>
                </ModalHeader>
              <ModalBody>
                  <div className="flex flex-col items-start justify-start">
                      <div className="flex justify-start items-start text-start">
                          <h5 className="font-medium text-sm text-green-800">Articulos a Reponer:</h5>
                      </div>
                        <Table aria-label="Example table with dynamic content" className="w-full shadow-xl flex items-center justify-center mt-4">
                                  <TableHeader columns={columns} className="">
                                    {(column) => (
                                      <TableColumn key={column.key} className="text-xs gap-6">
                                        {column.label}
                                      </TableColumn>
                                    )}
                                  </TableHeader>
                                  <TableBody items={data.detail}>
                                  {(item) => (
                                    <TableRow key={item.productName}>
                                      {columns.map(column => (
                                      <TableCell key={column.key} className="text-start items-start">
                                      {column.cellRenderer ? (
                                          column.cellRenderer({ row: { original: item } })
                                        ) : (
                                          ( column.key === "replacementPrice" ) ? (
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
                    </div>
                  
              </ModalBody>
                <ModalFooter className="flex items-center justify-center gap-6">
                <MarkDebtAsPaid type={"pendingReplacements"} debtId={data.debtId} debtAmount={data.amountToPay} completeDebtData={data} clientData={data.clientData} updateClientData={updateList} closeModal={onClose}/>
                <ClientTelephoneData clientId={data.clientData.id}  clientName={data.clientData.name}/>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default PendingReplacementDetail


