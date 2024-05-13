import React, { useState, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { formatePrice, everyClients } from "../../functions/gralFunctions";
import EditArticle from "./EditArticle";
import EditClientOrderData from "./editOrder/EditClientOrderData";
import EditDetailOrderData from "./editOrder/EditDetailOrderData";

const EditOrderData = ({orderData, orderStatus, updateList, closeModalNow}) => {

    const [step, setStep] = useState(0)
    const [status, setStatus] = useState("Selecciona un Estado ↓")
    const [successMessage, setSuccesMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [modifyData, setModifyData] = useState(false)
    const [modifyOrderDetailData, setModifyOrderDetailData] = useState(false)
    const [allArticles, setAallArticles] = useState([])
    

    //Funciones para agregar nuevos articulos a la Orden 
      const getClientsProductsData = () => { 
      axios.get("http://localhost:4000/products/productsClients")
            .then((res) => { 
              console.log(res.data)
              setAallArticles(res.data);
            })
            .catch((err) => { 
              console.log(err)
            })
      }

      useEffect(() => { 
        getClientsProductsData()
      }, [])

      

     //Funciones para editar datos de la orden - Cantidad de cada Producto Elegido
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
 
    


  return (
    <div>
       <div className="flex flex-col">
              <div className="flex flex-col items-start justify-start mt-2 ml-4">
                <p className="font-bold text-md text-zinc-600">Editar Pedido </p>
              </div>

                  {step === 0 ? 
                    <div className="flex flex-col justify-start items-start ml-4">
                      <p className="text-sm font-medium mt-2">Numero de Orden: {orderData.order}</p>
                      <p className="text-sm font-medium ">Mes: {orderData.month}</p>
                      <p className="text-sm font-medium ">Cliente: {orderData.client}</p>
                    </div>
                  : null}
                           
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
                            : 
                            <Select variant={"faded"} label="Selecciona un nuevo Estado" className="w-72">    
                              <SelectItem key={"armado"} value={"Armado"} onClick={() => setStatus("Armado")} >Armado</SelectItem>             
                              <SelectItem key={"Entregado"} value={"Entregado"} onClick={() => setStatus("Entregado")} >Entregado</SelectItem>    
                              <SelectItem key={"Devuelto"} value={"Devuelto"} onClick={() => setStatus("Devuelto")} >Devuelto</SelectItem>  
                              <SelectItem key={"Lavado"} value={"Lavado"} onClick={() => setStatus("Lavado")} >Lavado</SelectItem>                                           
                            </Select>
                           }               
                        </div>
                        <div className="flex gap-6 items-center mt-6">
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() => changeOrderState()}>Confirmar</Button>
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() => closeModalNow()}>Cancelar</Button>
                          <Button className="font-medium text-white text-xs bg-green-800 w-52" onClick={() =>  setStep(0)}>Volver</Button>
                        </div>

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
                         <EditDetailOrderData  closeModalNow={closeModalNow} orderStatus={orderData.status} updateChanges={updateList} newOrderDetailArray={orderData.orderDetail} orderId={orderData.id} comeBack={()=> setModifyOrderDetailData(false)}/>
                       : null}
                                      
                </div>           
              </div>
    </div>
  )
}

export default EditOrderData
