import React, { useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import Loading from "../Loading/Loading";
import { formatePrice } from "../../functions/gralFunctions";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import PostPayment from "../Orders/PostPayment";
import ViewDebtReplacementsArticles from "./ViewDebtReplacementsArticles";
import MarkDebtAsPaid from "../Modals/MarkDebtAsPaid";

const AccountState = ({clientData, updateClientData}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [clientHasReplacementsDebt, setClientHasReplacementsDebt] = useState(false)
  const [clientHasOrdersDebt, setClientHasOrdersDebt] = useState(false)
  const [load, setLoad] = useState(true)
  const [clientReplacementsDebtDetail, setClientReplacementsDebtDetail] = useState([])
  const [clientOrdersDebtDetail, setClientOrdersDebtDetail] = useState([])
  const [columns, setColumns] = useState([])
  const [ordersColumns, setOrdersColumns] = useState([])
  const [showOrderTable, setShowOrderTable] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [errorTable, setErrorTable] = useState(false)
  const [size, setSize] = useState("3xl")
  const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");

  const handleOpen = () => { 
    getClientData()
    onOpen()
  }

    const getClientData = async () => {  
    console.log("getclientdata")
     try {
        const queryClient = await axios.get(`http://localhost:4000/orders/getByClient/${clientData.id}`)
        const response = queryClient.data
        const filterOrdersByStatus = response.filter((ord) => ord.orderStatus === "Entregado" || ord.orderStatus === "Devuelto" || ord.orderStatus === "Lavado")
        const withOutPaid = filterOrdersByStatus.filter((ord) => ord.paid === false)
          if(withOutPaid.length > 0) { 
            setClientHasOrdersDebt(true)
            createOrderDebtsTable(withOutPaid)
            console.log("detalle de deuda de alquileres", withOutPaid)
          } else { 
            setClientHasOrdersDebt(false)
            console.log("no tiene deuda de alquileres")
          }

        const queryDebt = await axios.get(`http://localhost:4000/clients/${clientData.id}`)
        const responseDebt =  queryDebt.data
        const verifyDebt = responseDebt.clientDebt.some((s) => s.paid === false)
        if(verifyDebt === true) { 
            setClientHasReplacementsDebt(true)
            const filterUnpaidDebts = responseDebt.clientDebt.filter((debt) => debt.paid === false)
            createReplacementsTable(filterUnpaidDebts)
            console.log("detalles de deuda de reposiciones", filterUnpaidDebts)
          } else { 
            setClientHasReplacementsDebt(false)
            console.log("no tiene deuda de reposiciones")
          }
      
     } catch (error) {
         console.log(error)
     }
    }

    const createReplacementsTable = (items) => {
    console.log("Vamos a trabajar aca", items)

    const data = items.map((it) => { 
        const orderNumber = it.orderCompletedData.map((ord) => ord.orderNumber).shift()
        const orderMonth = it.orderCompletedData.map((ord) => ord.month).shift()
        const orderYear = it.orderCompletedData.map((ord) => ord.year).shift()
        const replacementData = it.productsMissed
        const totalAmountDebt = it.amountToPay
        const debtId = it.debtId
        const completeDebtData = it
        
        return { 
            orderNumber: orderNumber,
            mes: orderMonth,
            año: orderYear,
            replacementData: replacementData,
            totalAmountDebt: totalAmountDebt,
            debtId: debtId,
            completeDebtData: completeDebtData
        }
    })

    console.log("data", data)
    setClientReplacementsDebtDetail(data)
    const properties = Object.keys(data[0]);
    console.log("Propiedad", properties)
    if(data.length > 0 ) { 
        console.log(data)
        const firstDetail = data[0];
        const properties = Object.keys(firstDetail);
        const filteredProperties = properties.filter(property => property !== "replacementData"  && property !== "debtId"  && property !== "completeDebtData");
    
        const columnLabelsMap = {
            orderNumber: 'Orden',
            totalAmountDebt: "Total"
        };

        // Crear un array para almacenar las columnas de la tabla
        const tableColumns = filteredProperties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
        }));

        // Agregar las columnas adicionales al array
        tableColumns.push({
            key: 'Ver',
            label: 'Ver',
            cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const replacementData = filaActual.original.replacementData;
                const totalAmountDebt = filaActual.original.totalAmountDebt
                const item = {replacementData, totalAmountDebt};
                return (
                    <ViewDebtReplacementsArticles replacementData={item}/>
                );
            },
        });

        tableColumns.push({
            key: 'Pagar',
            label: 'Pagar',
            cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const id = filaActual.original.debtId;
                const completeDebtData = filaActual.original.completeDebtData;
                const totalAmountDebt = filaActual.original.totalAmountDebt


                const item = {id};
                return (
                    <MarkDebtAsPaid debtId={item.id} clientData={clientData} completeDebtData={completeDebtData} debtAmount={totalAmountDebt} updateClientData={getClientData} closeModal={onClose}/>
                );
            },
        });

        console.log("Table columns", tableColumns)
        setColumns(tableColumns);
        setShowTable(true)  
    } else { 
        console.log("First table length 0!")
        setErrorTable(true)
    }          
    }

    const createOrderDebtsTable = (items) => { 
        console.log(items)
        const data = items.map((it) => { 
            const orderNumber = it.orderNumber
            const month = it.month
            const year = it.year
            const total = it.total
            const id = it._id;
            const detail = it.orderDetail;
            const paid = it.paid;
            const creator = it.orderCreator;
            const client = it.client;
            const clientId = it.clientId;
            const day = it.day;
            const downPaymentData = it.downPaymentData
           
            return { 
                numeroOrden: orderNumber,
                month: month,
                year: year,
                total: total,
                id: id,
                detail: detail,
                paid: paid,
                creator: creator,
                client: client,
                clientId: clientId,
                day: day,
                downPaymentData: downPaymentData
                
            }
        })
        setClientOrdersDebtDetail(data)
        const properties = Object.keys(data[0]);
        console.log("Propiedad", properties)
        console.log(data)
        if(data.length > 0 ) { 

        console.log(data)
        const firstDetail = data[0];
        const properties = Object.keys(firstDetail);

        const filteredProperties = properties.filter(property => property !== "id" && property !== "detail" && property !== "paid" 
        && property !== "creator" && property !== "client" && property !== "clientId" && property !== "day" && property !== "downPaymentData");

        const columnLabelsMap = {
            numeroOrden: 'Orden',
            year: 'Año',
            month: 'Mes',
            total: 'Total',
        };

       
    
        const tableOrdersColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
        }));
       
        tableOrdersColumns.push({
            key: 'Pago',
            label: 'Pago',
            cellRenderer: (cell) => { 
              const filaActual = cell.row;
              const id = filaActual.original.id;
              const detail = filaActual.original.detail;
              const paid = filaActual.original.paid;
              const creator = filaActual.original.creator;
              const client = filaActual.original.client;
              const clientId = filaActual.original.clientId;
              const day = filaActual.original.day;
              const month = filaActual.original.month;
              const year = filaActual.original.year;
              const total = filaActual.original.total;
              const downPaymentData = filaActual.original.downPaymentData
              const item = {  id, detail,  paid,  creator, day, month,year, total,client, clientId, downPaymentData};
              return (
                 <PostPayment orderData={item} usedIn="ClientAccountState" updateList={getClientData}/>
                );
          },
            }) 
            
        console.log(tableOrdersColumns)
        setOrdersColumns(tableOrdersColumns);
        setShowOrderTable(true)  
        } else { 
        console.log("First table length 0!")
        setErrorTable(true)
        }    
    }




  return (
    <>
      <p className="text-xs text-green-700 font-medium cursor-pointer" onClick={handleOpen}>Ver Estado</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} className={clientHasOrdersDebt || clientHasReplacementsDebt ? "border-2 border-red-600" : "border-2 border-green-800"} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Estado de cuenta: {clientData.name}</ModalHeader>
              <ModalBody>
                  <div className="w-full flex flex-col items-center justify-center">
                      {showTable && clientHasReplacementsDebt ? 
                      <> 
                      <div className="flex justify-start items-start mt-2  w-full">
                        <p className="text-sm text-zinc-600 font-medium">Reposiciones Pendientes de Cobro:</p>
                      </div>
                          <Table                          
                          columnAutoWidth={true} 
                          columnSpacing={10}  
                          aria-label="Selection behavior table example with dynamic content"   
                          selectionBehavior={selectionBehavior} 
                          className=" flex items-center justify-center shadow-lg overflow-y-auto w-full rounded-xl">
                              <TableHeader columns={columns}>
                      {(column) => (
                      <TableColumn key={column.key} className="text-xs gap-6">
                          {column.label}
                      </TableColumn>
                          )}
                      </TableHeader>
                            <TableBody items={clientReplacementsDebtDetail}>
                                      {(item) => (
                                  <TableRow key={item.orderNumber}>
                                      {columns.map(column => (
                                      <TableCell key={column.key}  className='text-left' >
                                          {column.cellRenderer ? (
                                          column.cellRenderer({ row: { original: item } })
                                          ) : (
                                          (column.key === "totalAmountDebt") ? (
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
                      </> : 
                      null}

                     {showOrderTable && clientHasOrdersDebt ? 
                     <>
                      <div className="flex justify-start items-start mt-4 w-full">
                          <p className="text-sm text-zinc-600 font-medium">Alquileres Entregados pendientes de Cobro:</p>
                      </div>
                        <Table                          
                        columnAutoWidth={true} 
                        columnSpacing={10}  
                        aria-label="Selection behavior table example with dynamic content"   
                        selectionBehavior={selectionBehavior} 
                        className=" flex items-center justify-center shadow-lg overflow-y-auto w-full rounded-xl">
                            <TableHeader columns={ordersColumns}>
                                {(column) => (
                                <TableColumn key={column.key} className="text-xs gap-12">
                                    {column.label}
                                </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={clientOrdersDebtDetail}>
                                        {(item) => (
                                            <TableRow key={item.numeroOrden}>
                                                {ordersColumns.map(column => (
                                                    <TableCell key={column.key} className='text-left'>
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
                                </> : 
                                null
                                }

                                {clientHasOrdersDebt === false && clientHasReplacementsDebt === false ? <p className="text-md font-medium text-green-800">Este cliente no posee deudas</p> : null}

                  </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button className="bg-green-800 font-medium text-white cursor-pointer w-60" onPress={onClose}> Cerrar</Button> 
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AccountState