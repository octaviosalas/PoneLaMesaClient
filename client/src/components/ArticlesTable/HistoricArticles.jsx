import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import axios from "axios";
import Loading from "../Loading/Loading"
import { Card} from '@tremor/react';
import { useState, useEffect } from "react";

const HistoricArticles = ({articleData}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [columns, setColumns] = useState([]);
    const [ordersProducts, setOrdersProducts] = useState([])
    const [error, setError] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [size, setSize] = useState("xl")

    const handleOpen = async () => { 
      onOpen();
      await getProductOrders();
    }

    const getProductOrders = async () => { 
      try {
        const res = await axios.get("http://localhost:4000/orders");
        const data = res.data;
        const productOrderDetails = data
          .map((ord) => {
            const productOrderDetail = ord.orderDetail.filter((o) => o.productId === articleData.id);
            return {
              orderId: ord._id,
              orderNumber: ord.orderNumber,
              month: ord.month,
              year: ord.year,
              productOrderDetail: productOrderDetail,
              quantity: productOrderDetail.map((prodOrd) => prodOrd.quantity)[0],
              total: productOrderDetail.map((prodOrd) => prodOrd.choosenProductTotalPrice)[0]
              
            };
          })
          .filter((result) => result.productOrderDetail.length > 0);
        
        console.log(productOrderDetails);
    
        if (productOrderDetails.length !== 0) { 
          setOrdersProducts(productOrderDetails);
        } else { 
          setError(true);
          console.log(productOrderDetails.length);
          console.log("No tiene ordenes este producto")
        }
        setTimeout(() => { 
          setLoadingData(false)
        }, 2000)
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };

    useEffect(() => {
      if (ordersProducts.length > 0) {
        const firstDetail = ordersProducts[0];
        const properties = Object.keys(firstDetail);
        const filteredProperties = properties.filter(property => property !== 'productOrderDetail' && property !== 'orderId');
      
        const columnLabelsMap = {
          month: 'Mes',
          year: 'Año',
          total: 'Facturacion',
          orderNumber: 'Orden',
          quantity: 'Cantidad',
        };
      
        const tableColumns = filteredProperties.map(property => ({
          key: property,
          label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
        }));
      
        setColumns(tableColumns);
        console.log(tableColumns);
      } else { 
        setError(true)
      }
    }, [ordersProducts]);

 

  


  return (
    <>
      <p onClick={handleOpen} className="text-green-700 font-medium text-xs cursor-pointer">Historico</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max bg-white text-black' size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p  className="text-zinc-600 font-bold text-md">Historico de Pedidos</p>
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center">   
             {loadingData ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loading />
                    </div>       
                    ) : (
                      ordersProducts.length > 0 ? (
                        <div className="mt-4 flex flex-col  ">
                            <div className="mt-2 mb-2">
                              <Card className="mx-auto h-auto w-[450px]" decoration="top"  decorationColor="green-800" > 
                                 <div className="flex items-center justify-between">
                                      <div className="flex flex-col items-center">
                                          <p className="text-xs text-green-800 font-medium">MTF: {articleData.articleName}</p>
                                          <p className="text-xl font-medium text-black">{formatePrice(ordersProducts.reduce((acc, el) => acc + el.total, 0))}</p>
                                      </div>
                                      <div className="flex flex-col items-center">
                                          <p className="text-xs text-green-800 font-medium">Cantidad de Alquileres</p>
                                          <p className="text-xl font-bold text-black">{ordersProducts.length}</p>
                                      </div>
                                      <div className="flex flex-col items-center">
                                          <p className="text-xs text-green-800 font-medium">Unidades Alquiladas</p>
                                          <p className="text-xl font-medium text-black">{ordersProducts.reduce((acc, el) => acc + el.quantity, 0)}</p>
                                      </div>
                                 </div>
                              </Card>
                            </div>
                          <Table aria-label="Example table with dynamic content" className="w-[480px] 2xl-w-[950px] flex items-center justify-center mt-2 shadow-2xl overflow-y-auto max-h-[200px] ">
                            <TableHeader columns={columns} >
                              {(column) => (
                                <TableColumn key={column.key} className="text-xs gap-6">
                                  {column.label}
                                </TableColumn>
                              )}
                            </TableHeader>
                            <TableBody items={ordersProducts}>
                              {(item) => (
                                <TableRow key={item.orderId}>
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
                       
                        </div>
                      ) : (
                        <div className="flex flex-col items-cemnter justify-center">
                           <p className="font-medium text-zinc-600 text-sm">Al momento no se han registrado pedidos para este producto</p>
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

export default HistoricArticles


