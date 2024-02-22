import React, { useState, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { getProductsClients } from "../../functions/gralFunctions";
import EditArticle from "./EditArticle";

const EditOrderData = ({orderData, orderStatus, updateList, closeModalNow}) => {

    const [step, setStep] = useState(0)
    const [status, setStatus] = useState("Selecciona un Estado ↓")
    const [successMessage, setSuccesMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [newOrderDeliveryDate, setNewOrderDeliveryDate] = useState(orderData.dateOfDelivery)
    const [newOrderReturnDate, setNewOrderReturnDate] = useState(orderData.returnDate)
    const [newOrderClient, setNewOrderClient] = useState(orderData.client)
    const [newOrderReturnPlace, setNewOrderReturnPlace] = useState(orderData.returnPlace)
    const [newOrderDeliveryPlace, setNewOrderDeliveryPlace] = useState(orderData.placeOfDelivery)
    const [newOrderDetailArray, setNewOrderDetailArray] = useState(orderData.orderDetail)
    const [modifyData, setModifyData] = useState(false)
    const [modifyOrderDetailData, setModifyOrderDetailData] = useState(false)


      const changeOrderState = () => { 
        if(status === "Selecciona un Estado ↓") { 
          setErrorMessage(true)
          setTimeout(() => { 
            setErrorMessage(false)
          }, 1500)
        } else { 
          const newStatus = status
          axios.put(`http://localhost:4000/orders/changeOrderState/${orderData.id}`,  { newStatus })
               .then((res) => { 
                console.log(res.data)
                updateList()
                setSuccesMessage(true)
                setTimeout(() => { 
                  setSuccesMessage(false)
                  closeModalNow()
                  setStep(0)
                  setStatus("Selecciona un Estado ↓")
                }, 2500)
               })
               .catch((err) => { 
                console.log(err)
               })
        }
      }

      const changeOrderData = () => { 
        const newOrderData = ({ 
          newOrderDeliveryDate: newOrderDeliveryDate,
          newOrderReturnDate: newOrderReturnDate,
          newOrderClient: newOrderClient,
          newOrderReturnPlace: newOrderReturnPlace,
          newOrderDeliveryPlace: newOrderDeliveryPlace
        })
        axios.put(`http://localhost:4000/orders/updateOrderData/${orderData.id}`, newOrderData)
             .then((res) => { 
              console.log(res.data)
              setSuccesMessage(true)
              updateList()
              setTimeout(() => { 
                closeModalNow()
                setSuccesMessage(false)
                setModifyData(false)
              }, 1500)
             })
             .catch((err) => console.log(err))
      }

      const changeOrderDetail = () => { 
     
        const newOrderDetailData = ({
          total: newOrderDetailArray.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0),
          orderDetail: newOrderDetailArray
        })   
        console.log(newOrderDetailData)
        axios.put(`http://localhost:4000/orders/updateOrderDetail/${orderData.id}`, {newOrderDetailData})    
             .then((res) => { 
              console.log(res.data)
              setSuccesMessage(true)
              updateList()
              setTimeout(() => { 
                closeModalNow()
                setSuccesMessage(false)
              }, 1500)
             })
             .catch((err) => console.log(err))
      }
    
      const comeBackToFirstStep = () => { 
        setStep(0)
      }

      const handleQuantityChange = (index, newQuantity) => {
        const updatedOrderDetailArray = [...newOrderDetailArray];
        const oldQuantity = updatedOrderDetailArray[index].quantity;
        updatedOrderDetailArray[index] = {
          ...updatedOrderDetailArray[index],
          quantity: newQuantity,
          choosenProductTotalPrice: newQuantity * updatedOrderDetailArray[index].price
        };
        setNewOrderDetailArray(updatedOrderDetailArray);
        console.log('Cantidad anterior:', oldQuantity);

      };

      useEffect(() => { 
       console.log(newOrderDetailArray)
      }, [newOrderDetailArray])
    


  return (
    <div>
       <div className="flex flex-col items-center justify-center w-full border">
            <p className="font-bold text-md">Editar Pedido </p>
                  {orderStatus}
                  {step === 0 ? 
                    <div>
                      <p className="text-xs font-medium mt-2">Pedido numero: {orderData.order}</p>
                      <p className="text-xs font-medium ">Mes: {orderData.month}</p>
                      <p className="text-xs font-medium ">Cliente: {orderData.client}</p>
                    </div>
                  : null}
                           
                <div className="mt-4 mb-4">
                  {step === 0 ?
                  <div className="flex gap-4 items-center justify-center">
                      <Button className="font-bold text-white text-xs bg-green-600 w-52"  onClick={() => setStep(2)}>Modificar Datos</Button>
                      <Button className="font-bold text-white text-xs bg-green-600 w-52" onClick={() => setStep(1)}>Cambiar Estado</Button>
                      <Button className="font-bold text-white text-xs bg-green-600 w-52">Adjuntar Articulos a Reponer</Button>
                  </div>
                  : null}

                    {step === 1 ? 
                      <div className="flex flex-col items-center justify-center mb-4">
                        <div>
                        <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">     
                              <SelectItem key={"armado"} value={"Armado"} onClick={() => setStatus("Armado")} >Armado</SelectItem>          
                              <SelectItem key={"Reparto"} value={"Reparto"} onClick={() => setStatus("Reparto")} >Reparto</SelectItem>        
                              <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setStatus("Entregado")} >Entregado</SelectItem>    
                              <SelectItem key={"Devolucion"} value={"Devolucion"} onClick={() => setStatus("Devuelto")} >Devolucion</SelectItem>   
                              <SelectItem key={"Lavado"} value={"Lavado"} onClick={() => setStatus("Lavado")} >Lavado</SelectItem>     
                              <SelectItem key={"Repuesto"} value={"Repuesto"} onClick={() => setStatus("Repuesto")}>Repuesto</SelectItem>                                          
                        </Select>                    
                        </div>
                        <div className="flex gap-6 items-center mt-6">
                          <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => changeOrderState()}>Confirmar</Button>
                          <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => closeModalNow()}>Cancelar</Button>
                          <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() =>  setStep(0)}>Volver</Button>
                        </div>
                      {successMessage ?
                        <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-4">
                          <p className="font-medium text-sm text-green-600">Estado de orden Modificado con Exito ✔</p>
                        </div> :
                        null}

                      {errorMessage ?
                        <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-4">
                          <p className="font-medium text-sm text-green-600">Debes seleccionar un estado</p>
                        </div> :
                        null} 
                      
                      </div>
                      :
                    null}

                      {step === 2 && modifyData !== true && modifyOrderDetailData !== true ? (
                        <>
                          <div className="h-7 bg-green-600 w-[500px] cursor-pointer" onClick={() => setModifyData(true)}>
                            <p className="font-bold text-white text-md">Modificar datos del Cliente</p>
                          </div>
                          <div className="h-7 bg-green-800 w-[500px] cursor-pointer mt-1" onClick={() => setModifyOrderDetailData(true)}>
                            <p className="font-bold text-white text-md">Modificar detalle de Orden</p>
                          </div>
                        </>
                      ) : step === 2 && modifyData === true && modifyOrderDetailData !== true ? (
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col items-center justify-center">
                            <Input type="text" variant="underlined" label="Cliente" value={newOrderClient} className="w-56 mt-2" onChange={(e) => setNewOrderClient(e.target.value)} />
                            <Input type="text" variant="underlined" label="Fecha de Entrega" value={newOrderDeliveryDate} className="w-56 mt-2" onChange={(e) => setNewOrderDeliveryDate(e.target.value)} />
                            <Input type="text" variant="underlined" label="Lugar Entrega" value={newOrderDeliveryPlace} className="w-56 mt-2" onChange={(e) => setNewOrderDeliveryPlace(e.target.value)} />
                            <Input type="text" variant="underlined" label="Fecha de Devolucion" value={newOrderReturnDate} className="w-56 mt-2" onChange={(e) => setNewOrderReturnDate(e.target.value)} />
                            <Input type="text" variant="underlined" label="Lugar Devolucion" value={newOrderReturnPlace} className="w-56 mt-2" onChange={(e) => setNewOrderReturnPlace(e.target.value)} />
                         
                            <div className="mt-4 mb-4 flex items-center gap-6">
                              <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => setModifyData(false)}>Cancelar</Button>
                              <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => changeOrderData()}>Editar</Button>
                            </div>
                            {successMessage ? (
                              <div className="mt-4 mb-4 flex items-center">
                                <p className="font-medium text-green-500 text-sm">Datos de Orden editados con Éxito ✔</p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : step === 2 && modifyData !== true && modifyOrderDetailData === true ? 
                          <div>
                            {newOrderDetailArray.map((ord, index) => (
                                <div key={index} className="flex flex-col">
                                  <div className="flex items-center justify-start w-72 gap-4 mt-2">
                                    <p className="font-medium text-zinc-500 text-sm">{ord.productName}</p>
                                    <Input type="number" variant="underlined" label="Cantidad" className="max-w-md min-w-sm" value={ord.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                                  </div>
                                </div>
                              ))}
                              <div className="flex items-center justify-center">
                                <p>Total: {newOrderDetailArray.reduce((acc, el) => acc + el.choosenProductTotalPrice, 0)}</p>
                              </div>
                            <div className="flex items-center gap-6 mt-6 mb-2">
                               <Button className="bg-green-800 font-bold text-white" onClick={() => changeOrderDetail()}>Confirmar</Button>
                               <Button className="bg-green-800 font-bold text-white">Cancelar</Button>
                            </div>
                          </div>
                       : null}
                     

                   
                </div>           
              </div>
    </div>
  )
}

export default EditOrderData
