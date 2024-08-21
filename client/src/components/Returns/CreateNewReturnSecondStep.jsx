import React, { useEffect, useState } from 'react'
import { formatePrice } from '../../functions/gralFunctions'
import { Button } from '@nextui-org/react'
import PostPayment from '../Orders/PostPayment'
import RegisterMissingItems from './RegisterMissingItems'
import MarkOrderLikeReturnedWithOutMissedArticles from './MarkOrderLikeReturnedWithOutMissedArticles'
import VaucherModal from '../Collections/VaucherModal'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

const CreateNewReturnSecondStep = ({orderData, orderDataStatus, updateList, comeBack, closeModalNow}) => {

    const [orderHasBrokenArticles, setOrderHasBrokenArticles] = useState(false)
    const [orderId, setOrderId] = useState(false)
    const [orderPaid, setOrderPaid] = useState(false)
    const [orderIsReturned, setOrderIsReturned] = useState(false)
    const [markAsReturnedWithOutProductsMissed, setMarkAsReturnedWithOutProductsMissed] = useState(false)
    const [orderHasDownPayment, setOrderHasDownPayment] = useState(false)
    const [downPaymentAmount, setDownPaymentAmount] = useState(0)
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [showTable, setShowTable] = useState(false)
    const [error, setError] = useState(false)
    const [parcialPayment, setParcialPayment] = useState(0)


    useEffect(() => { 
        console.log(orderData)
        console.log(orderDataStatus)
        setOrderPaid(orderData.map((ord) => ord.paid)[0])
        setOrderId(orderData.map((ord) => ord._id)[0])
        const findIfTheOrderHasDownPayment = orderData.some(ord => ord.downPaymentData.length > 0);
        const theValueOfTheDownPayment = orderData.find(ord => ord.downPaymentData.length > 0)?.downPaymentData.find(ord => ord.amount)?.amount;
        if(orderData.map((ord) => ord.parcialPayment)[0].length > 0) { 
            const parcialPaymentsData = orderData.map((ord) => ord.parcialPayment)[0]
            const totalParcial = parcialPaymentsData.reduce((acc, el) => acc + el.amount, 0)
            console.log("HAY PAGOS PARCIALESSSSS", totalParcial)
            setParcialPayment(totalParcial)
        }
        if(findIfTheOrderHasDownPayment === true) { 
            setOrderHasDownPayment(true)
            setDownPaymentAmount(theValueOfTheDownPayment)
       } else { 
        setOrderHasDownPayment(false)
       }
    },[])

    useEffect(() => { 
       console.log(orderHasDownPayment)
    }, [orderHasDownPayment])


    const comeBackFirstStep = () => { 
        setOrderHasBrokenArticles(true)
    }

    const changeOrderPaid = (value) => { 
        setOrderPaid(value)
    }

    const advanceToSecondStep = () => { 
        if(orderDataStatus === "Devuelto") { 
            setOrderIsReturned(true)
            setTimeout(() => { 
                setOrderIsReturned(false)
            }, 2300)
        } else { 
            setMarkAsReturnedWithOutProductsMissed(true)
        }
    }

    const cancelUpdateOrderState = () => { 
        setMarkAsReturnedWithOutProductsMissed(false)       
    }

    const cancelarMarkMissedArticles = () => { 
        setOrderHasBrokenArticles(false)       
    }

    useEffect(() => {      
             if(orderData.length > 0) { 
                console.log("me ejecuto")
                const firstDetail = orderData.map((ord) => ord.orderDetail).flat()[0];
                console.log(firstDetail)
                const properties = Object.keys(firstDetail);
                console.log(properties)
                const filteredProperties = properties.filter(property => property !== 'choosenProductCategory' && property !== 'productId' && property !== 'price' && property !== 'replacementPrice' 
                && property !== "choosenProductEstimativeWashedTime");
              
                const columnLabelsMap = {
                  quantity: 'Cantidad',
                  productName: 'Articulo',
                  choosenProductTotalPrice: 'Monto Total',
                  price: "Precio"
                };
              
                const tableColumns = filteredProperties.map(property => ({
                  key: property,
                  label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
                }));
              
                setColumns(tableColumns);
                console.log(tableColumns);
                setShowTable(true)
              } else { 
              setError(true)
            }
    }, [orderData])


  return (
    <div>
  {orderHasBrokenArticles === false ?
  <>
     <div className='flex flex-col justify-start items-start w-full'>
         <div>
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Cliente:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.client)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Fecha de Entrega:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.dateOfDelivery)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Lugar de Entrega:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.placeOfDelivery)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                        <h5 className='font-bold text-green-800 text-sm'>Estado actual del Pedido:</h5>
                        <p className='text-sm font-medium text-zinc-600'>{orderData.map((ord) => ord.orderStatus)}</p>
                  </div>

                    <div className='mt-2'>
                      <h5 className='font-bold text-green-800'>Detalle de la orden:</h5>
                      {showTable ?
                                <Table                          
                                    columnAutoWidth={true} 
                                    columnSpacing={10}  
                                    aria-label="Selection behavior table example with dynamic content"   
                                    selectionBehavior={selectionBehavior} 
                                    className="w-[400px] 2xl:w-[600px] flex items-center justify-center mt-2 shadow-2xl overflow-y-auto xl:max-h-[150px] 2xl:max-h-[250px] border rounded-xl">
                                        <TableHeader columns={columns}>
                                        {(column) => (
                                        <TableColumn key={column.key} className="text-xs gap-6">
                                        {column.label}
                                        </TableColumn>
                                            )}
                                        </TableHeader>
                                        <TableBody items={orderData.map((ord) => ord.orderDetail).flat()}>
                                                    {(item) => (
                                        <TableRow key={item.productName}>
                                            {columns.map(column => (
                                            <TableCell key={column.key}  className='text-left' >
                                                {column.cellRenderer ? (
                                                column.cellRenderer({ row: { original: item } })
                                                ) : (
                                                (column.key === "choosenProductTotalPrice") ? (
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
                                </Table> : <p>Aguardando datos...</p>}
                    </div>
                    
                    {orderData.some((ord) => ord.subletsDetail.length > 0) ?
                     <div className='mt-2'>
                       <h5 className='font-bold text-green-800'>SubAlquileres añadidos</h5>
                        <div className='flex flex-col items-start justify-start '>
                            {orderData.map((ord) => ord.subletsDetail.map((c) => ( 
                                <div className='flex items-center justify-center gap-2' key={c.productId}>
                                    <p className='text-sm font-medium text-zinc-600'>Articulo: {c.productName}</p>
                                    <p className='text-sm font-medium text-zinc-600'>Cantidad: {c.quantity}</p>
                                </div>
                            )))}
                        </div>
                    </div> : null}

                    <div className='flex flex-col items-start justify-start mt-4'>
                            {orderHasDownPayment && orderPaid !== true ? 
                              <div className='flex flex-col items-start justify-start'>
                                <p className='font-bold text-green-800 text-sm underline'>Esta orden fue señada con:</p> 
                                <p className='font-medium text-zinc-600 text-sm'>{formatePrice(downPaymentAmount)}</p>
                             </div> 
                            
                            : null}
 
                       {parcialPayment > 0 && orderPaid !== true ? 
                              <div className='flex flex-col items-start justify-start'>
                                <p className='font-bold text-green-800 text-sm underline'>Esta orden tuvo pagos parciales de :</p> 
                                <p className='font-medium text-zinc-600 text-sm'>{formatePrice(parcialPayment)}</p>
                             </div> 
                            
                            : null}

                            {orderHasDownPayment && orderPaid !== true ? (
                                <div className='flex flex-col'>
                                    <h5 className='font-bold text-green-800  text-sm underline mt-2'>Monto Restante a cobrar: </h5>
                                    <p className='text-sm font-medium text-zinc-600'>{formatePrice(orderData.map((ord) => ord.total - downPaymentAmount - parcialPayment))}</p> 
                                </div>    
                             
                            ) : (
                                orderHasDownPayment !== true && orderPaid !== true ? (
                                    <div className='flex items-center justify-center gap-1'>
                                       <h5 className='font-bold text-green-800  text-sm underline'>Monto total del pedido: </h5>
                                       <p className='text-sm font-medium text-zinc-600'> {formatePrice(orderData.map((ord) => ord.total))}</p> 
                                </div>    
                            ) : null
                            )}

                          
                    </div>
     </div>
        </div>
           <div className='flex flex-col items-center justify-center mt-2'>
                  {orderPaid ? 
                   <VaucherModal orderId={orderId}/>
                    :
                <div className='flex flex-col items-center justify-center'>
                <p className='text-sm font-medium text-white bg-red-600'>Este pedido se encuentra pendiente de pago</p>
                   {orderHasDownPayment ? 
                     <PostPayment usedIn="CreateNewReturn" withDownPayment={true} valueToPay={formatePrice(orderData.map((ord) => ord.total - downPaymentAmount - parcialPayment))} orderData={orderData} changeOrderPaid={changeOrderPaid}/>     
                   : <PostPayment usedIn="CreateNewReturn" withDownPayment={false} valueToPay={formatePrice(orderData.map((ord) => ord.total))} orderData={orderData} changeOrderPaid={changeOrderPaid}/>        
                   }
           
                </div>
                }
           </div>

          {markAsReturnedWithOutProductsMissed === false ? 

             <div className='flex mt-4 gap-4 items-center justify-center'>
                <Button className="text-white bg-green-700 font-medium text-sm" onClick={() => advanceToSecondStep()}>Asentar Devolucion Sin Faltantes</Button>
                <Button className="text-white bg-green-700 font-medium text-sm" onClick={() => setOrderHasBrokenArticles(true)}>Registrar Faltantes</Button>
             </div> :
             <div className='flex text-center items-center justify-center mt-4'>
                <MarkOrderLikeReturnedWithOutMissedArticles updateList={updateList} cancel={cancelUpdateOrderState} orderId={orderId} closeNow={closeModalNow}/>
             </div>
          
          
          }
          
                {orderIsReturned ?
                 <div className="flex items-center justify-center mt-4 mb-4">
                    <p className='text-green-800 font-medium text-sm'>La orden ya fue marcada como Devuelta</p>
                 </div> : null}
       </>
        :
         <RegisterMissingItems returnFirstStep={comeBackFirstStep} updateList={updateList} orderData={orderData} cancel={cancelarMarkMissedArticles} closeModalNow={closeModalNow}/> 
        }

    </div>
   
  )
}

export default CreateNewReturnSecondStep
