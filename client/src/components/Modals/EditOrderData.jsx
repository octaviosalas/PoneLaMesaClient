import React, { useState, useEffect } from "react";
import { Button} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import EditClientOrderData from "./editOrder/EditClientOrderData";
import EditDetailOrderData from "./editOrder/EditDetailOrderData";
import { useNavigate } from "react-router-dom";

const EditOrderData = ({orderData, orderStatus, updateList, closeModalNow}) => {

    const [step, setStep] = useState(0)
    const [status, setStatus] = useState("Selecciona un Estado ↓")
    const [successMessage, setSuccesMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [modifyData, setModifyData] = useState(false)
    const [modifyOrderDetailData, setModifyOrderDetailData] = useState(false)
    const [allArticles, setAallArticles] = useState([])
    const navigate = useNavigate()
    
      const changeOrderState = () => { 
        if(status === "Selecciona un Estado ↓") { 
          setErrorMessage(true)
          setTimeout(() => { c
            setErrorMessage(false)
          }, 1500)
        } else { 
          const newStatus = status
          axios.put(`http://localhost:4000/orders/changeOrderState/${orderData.id}`,  { newStatus })
               .then((res) => { 
                updateList("everyOrders");   
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
 
    


  return (
    <div>
       <div className="flex flex-col">
              <div className="flex flex-col items-start justify-start mt-2 ml-4">
                <p className="font-bold text-md text-zinc-600">Editar Pedido </p>
              </div>

                
                           
                <div className="mt-4 mb-4 w-full">
                  {step === 0 ?
                  <div className="flex flex-col items-center justify-center ml-2 mr-2">
                      <div className="bg-green-800 w-full h-11 flex items-center cursor-pointer"  onClick={() => setStep(2)}>
                         <p className="font-medium ml-4 text-white text-sm">Modificar Datos</p>
                      </div>
                      <div className="bg-green-700 w-full h-11 flex items-center cursor-pointer mt-1" onClick={() => setStep(1)}>
                         <p className="font-medium ml-4 text-white text-sm">Cambiar Estado</p>
                      </div>                            
                  </div>
                  
                  : null}



                    {step === 1 ? 
                      <div className="flex flex-col items-center justify-center mb-4">
                        <div>
                         {orderStatus === "Armado" ? 
                              <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">      
                                  <SelectItem key={"A Confirmar"} value={"A Confirmar"} onClick={() => setStatus("A Confirmar")} >A Confirmar</SelectItem>                                       
                                  <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setStatus("Entregado")} >Entregado</SelectItem>         
                                  <SelectItem key={"Reparto"} value={"Reparto"} onClick={() => setStatus("Reparto")} >Reparto</SelectItem>        
                                  <SelectItem key={"Retiro en Local"} value={"Retiro en Local"} onClick={() => setStatus("Retiro en Local")} >Retiro en Local</SelectItem>                                       
                              </Select> 
                            : orderStatus === "Entregado" ? (
                              <div className="flex flex-col items-center justify-center mt-3">                            
                                <div className="flex mt-2">
                                  <p className="text-md font-medium text-white bg-red-600 w-full text-center cursor-pointer" onClick={() => navigate("/Devoluciones")}>Si deseas asentar la devolucion dirigite al modulo Devoluciones haciendo Click aqui</p>
                                </div> 
                              </div> 
                            ) : orderStatus === "A Confirmar" ? (
                              <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">    
                                <SelectItem key={"confirmado"} value={"Confirmado"} onClick={() => setStatus("Confirmado")}> Confirmado </SelectItem>               
                                <SelectItem key={"armado"} value={"Armado"} onClick={() => setStatus("Armado")}> Armado </SelectItem>               
                              </Select>
                            ): ( 
                              <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">    
                                <SelectItem key={"armado"} value={"Armado"} onClick={() => setStatus("Armado")} >Armado</SelectItem>             
                                <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setStatus("Entregado")} >Entregado</SelectItem>    
                                <SelectItem key={"Devuelto"} value={"Devuelto"} onClick={() => setStatus("Devuelto")} >Devuelto</SelectItem>  
                             </Select>
                            )
                           
                           }               
                        </div>
                        {orderStatus !== "Entregado" ?
                        <div className="flex gap-6 items-center mt-6">
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() => changeOrderState()}>Confirmar</Button>
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() => closeModalNow()}>Cancelar</Button>
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() =>  setStep(0)}>Volver</Button>
                        </div> : 
                         <div className="flex gap-6 items-center mt-6">
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() => closeModalNow()}>Cancelar</Button>
                          <Button className="font-medium text-white text-xs bg-green-800 w-52"onClick={() =>  setStep(0)}>Volver</Button>
                        </div>
                        }

                      {successMessage ?
                        <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-6">
                          <p className="font-medium text-md text-white text-center w-full bg-green-800">Estado de orden Modificado con Exito ✔</p>
                        </div> :
                        null}

                      {errorMessage ?
                        <div className="font-medium text-sm text-zinc-600 cursor-pointer mt-4">
                          <p className="font-medium text-sm text-green-800">Debes seleccionar un estado</p>
                        </div> :
                        null}                      
                      </div>
                      :
                    null}

                      {step === 2 && modifyData !== true && modifyOrderDetailData !== true ? (
                          <div className="flex flex-col items-center justify-center ml-2 mr-2">
                          <div className="h-11 bg-green-600 w-full cursor-pointer flex  items-center " onClick={() => setModifyData(true)}>
                            <p className="font-bold text-white text-sm">Modificar datos del Cliente</p>
                          </div>
                          <div className="h-11 bg-green-800 w-full cursor-pointer flex  items-center  mt-1" onClick={() => setModifyOrderDetailData(true)}>
                            <p className="font-bold text-white text-sm">Modificar detalle de Orden</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium underline cursor-pointer flex  items-center  mt-4 text-zinc-500" onClick={() => setStep(0)}>Volver</p>
                          </div>
                        </div>
                      ) : step === 2 && modifyData === true && modifyOrderDetailData !== true ? (

                        <div className="flex flex-col w-full">
                           <EditClientOrderData comeBack={()=> setModifyData(false)} clientName={orderData.client} clientId={orderData.clientId} orderId={orderData.id} updateClientData={updateList} closeModal={closeModalNow}/>
                        </div>

                      ) : step === 2 && modifyData !== true && modifyOrderDetailData === true ? 
                            <EditDetailOrderData
                              orderData={orderData}
                              closeModalNow={closeModalNow}
                              orderStatus={orderData.status}
                              updateChanges={updateList}
                              newOrderDetailArray={orderData.orderDetail}
                              shippingCost={orderData.shippingCost || 0} 
                              orderId={orderData.id}
                              comeBack={() => setModifyOrderDetailData(false)}
                          />                       : null}
                                      
                </div>           
              </div>
    </div>
  )
}

export default EditOrderData
