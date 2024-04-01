import React from "react";
import { useEffect, useState, useRef } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import Loading from "../Loading/Loading";
import axios from "axios";
import { formatePrice } from "../../functions/gralFunctions";
import AreYouSure from "../Modals/AreYouSure";
import CreateSublet from "../ArticlesTable/CreateSublet";
import ViewSubletObservation from "./ViewSubletObservation";



const FindSublet = ({orderData, updateListOfToBeConfirmedOrders}) =>  {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const tableRef = useRef(null);
  const [load, setLoad] = useState(false)
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
  const [inputValue, setInputValue] = useState("")
  const [withOutSubletsAvailables, setWithOutSubletsAvailables] = useState(false)


      const handleOpen =  () => { 
        onOpen()
        console.log(orderData)
        getDataAndCreateTable()()
      }

      useEffect(() => { 
        console.log(data)
        getDataAndCreateTable()
      }, [])

      const closeModalNow = () => { 
        onClose()
      }

     const getDataAndCreateTable =  async () => { 
      console.log("buscando sublets en false")
        try {
            const response = await axios.get("http://localhost:4000/sublets")
            const allSublets = await response.data
            console.log(allSublets)
            const filteredSublets = allSublets.filter((sub) => sub.used === false)
            console.log(filteredSublets)
            if(filteredSublets.length > 0) { 
            setData(filteredSublets)
            const propiedades = Object.keys(filteredSublets[0]).filter(propiedad =>  propiedad !== '_id' && propiedad !== '__v'
            && propiedad !== 'productsDetail'  && propiedad !== 'providerId' &&  propiedad !== 'day' &&
            propiedad !== 'month' && propiedad !== 'year' && propiedad !== 'day' && propiedad !== 'used'  && propiedad !== 'observation');

            const columnObjects = propiedades.map(propiedad => ({
            key: propiedad,
            label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
            allowsSorting: true
            }));

            const modifiedColumnObjects = columnObjects.map(column => {
                if (column.key === 'date') {
                    return { ...column, label: 'Fecha' };
                } else if (column.key === 'amount') {
                    return { ...column, label: 'Total' };
                } else if (column.key === 'provider') {
                    return { ...column, label: 'Proveedor' };
                }else {
                    return column;
                }
            });

            modifiedColumnObjects.push({
                key: 'Utilizar',
                label: 'Utilizar',
                cellRenderer: (cell) => { 
                  const filaActual = cell.row;
                  const id = filaActual.original._id;       
                  const subletDetail = filaActual.original.productsDetail;
                  const orderDetail = filaActual.original.orderDetail;
                  const amountToBeAdd = filaActual.original.productsDetail.map((it) => it.rentalPrice * it.quantity).reduce((acc, el) => acc + el, 0)
                  const item = {
                  id: id,              
                  amountToBeAdded: amountToBeAdd,
                  subletProductsDetail: subletDetail
                  };
                  return (
                      <AreYouSure subletData={item} dataOrder={orderData} closeModal={closeModalNow} updateListOfSublets={getDataAndCreateTable} updateOrderList={updateListOfToBeConfirmedOrders}/>
                    );
                 },
                }) 

                modifiedColumnObjects.push({
                  key: 'Observation',
                  label: 'Observation',
                  cellRenderer: (cell) => { 
                    const filaActual = cell.row;
                    const observation = filaActual.original.observation;       
                    const item = {
                     observation: observation,              
                    };
                    return (
                        <ViewSubletObservation subletObservation={item}/>
                      );
                   },
                  }) 
        
        
            setColumns(modifiedColumnObjects);
            console.log(modifiedColumnObjects)
            if (tableRef.current) {
                tableRef.current.updateColumns(modifiedColumnObjects);
                }            
            }else { 
              setWithOutSubletsAvailables(true)
              setLoad(false)
            }
            } catch (error) {
                console.log(error)
            }
    
    }

    const filteredData = data.filter((item) => {
      return Object.values(item).some((value) => {
         if (value === null) return false;
         return value.toString().toLowerCase().includes(inputValue.toLowerCase());
      });
     });

    useEffect(() => { 
        console.log("cambio columnas y data")
        setTimeout(() => { 
        setLoad(false)
        }, 1500)
    }, [columns, data])

  return (
    <>
   <p onClick={handleOpen} className="font-medium text-xs text-green-800 cursor-pointer">Anexar Sub Alquiler</p>
<Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-max min-w-96">
 <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">Sub Alquileres Disponibles</ModalHeader>  
        {load ? 
          <Loading/> 
          :
          (withOutSubletsAvailables ? 
            <div className="flex flex-col items-center justify-center mt-6 mb-6">
               <p className="font-medium text-green-800 text-md">No hay SubAlquileres Disponibles</p>
               <div className="mt-6 mb-4">
                  <CreateSublet usedIn={"withOutSubletsToUse"} updateTable={getDataAndCreateTable} closeBothModals={closeModalNow}/>
               </div>
            </div>
           : 
            <ModalBody className="mb-6">
               <div className="flex items-center jsutify-center">
                 <p className="font-medium text-zinc-600 text-sm">Sub Alquileres disponibles para utilizar: {data.length}</p>
               </div>    
              <Table
                columnAutoWidth={true}
                columnSpacing={10}
                aria-label="Selection behavior table example with dynamic content"
                selectionBehavior={selectionBehavior}
                className="w-full lg:w-[500px] xl:w-[700px] 2xl:w-[700px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
              >
                <TableHeader columns={columns}>
                 {(column) => (
                    <TableColumn key={column.key} className="text-left">
                      {column.label}
                    </TableColumn>
                 )}
                </TableHeader>

                <TableBody items={filteredData}>
                 {(item) => (
                    <TableRow key={item._id}>
                      {columns.map((column) => (
                        <TableCell key={column.key} className='text-left'>
                          {column.cellRenderer ? (
                            column.cellRenderer({ row: { original: item } })
                          ) : (
                            column.key === "amount" ? (
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
            </ModalBody>
          )
        }
      </>
    )}
 </ModalContent>
</Modal>
    </>
  );
}

export default FindSublet