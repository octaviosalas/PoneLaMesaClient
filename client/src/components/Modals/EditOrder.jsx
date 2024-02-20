import React, { useState, useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { getProductsClients } from "../../functions/gralFunctions";

const EditOrder = ({type, statusOrder, updateList, orderData, articleData, updateChanges}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState("Selecciona un Estado ↓")
  const [successMessage, setSuccesMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [newOrderDeliveryDate, setNewOrderDeliveryDate] = useState(type === "orders" ? orderData.dateOfDelivery : "")
  const [newOrderReturnDate, setNewOrderReturnDate] = useState(type === "orders" ? orderData.returnDate : "")
  const [newOrderClient, setNewOrderClient] = useState(type === "orders" ? orderData.client : "")
  const [newOrderDetail, setNewOrderDetail] = useState(type === "orders" ? orderData.orderDetail : "")
  const [newProductName, setNewProductName] = useState(type === "product" ? articleData.productName : "")
  const [newProductClientsValue, setNewProductClientsValue] = useState(type === "product" ? articleData.clientsValue : "")
  const [newProductBonusClientsValue, setNewProductBonusClientsValue] = useState(type === "product" ? articleData.bonusClientsValue : "")
  const [newProductReplacementValue, setNewProductReplacementValue] = useState(type === "product" ? articleData.replacementValue : "")
  const [succesChangesArticle, setSuccesChangesArticle] = useState(false)



  const closeModal = () => { 
    onClose()
    setStep(0)
  }

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
              onClose()
              setStep(0)
              setStatus("Selecciona un Estado ↓")
            }, 2500)
           })
           .catch((err) => { 
            console.log(err)
           })
    }
  }

  const comeBackToFirstStep = () => { 
    setStep(0)
  }

  const changeProductData = () => { 
    const newProductData = ({ 
      articulo: newProductName,
      precioUnitarioAlquiler: newProductClientsValue,
      precioUnitarioAlquilerBonificados: newProductBonusClientsValue,
      precioUnitarioReposicion: newProductReplacementValue
    })
    axios.put(`http://localhost:4000/products/changeData/${articleData.id}`, newProductData)
         .then((res) => { 
          console.log(res.data)
          setSuccesChangesArticle(true)
          updateChanges()
          setTimeout(() => { 
            setSuccesChangesArticle(false)
            onClose()
          }, 1500)
         })
         .catch((err) => { 
          console.log(err)
         })
  }


  return (
    <>
      <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Editar</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "orders" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Pedido </p>
                  {statusOrder}
                  {step === 0 ? 
                    <div>
                      <p className="text-xs font-medium mt-2">Pedido numero: {orderData.order}</p>
                      <p className="text-xs font-medium ">Mes: {orderData.month}</p>
                      <p className="text-xs font-medium ">Cliente: {orderData.client}</p>
                    </div>
                  : null}
                  
                </ModalHeader>
                <ModalBody>
                  {step === 0 ?
                  <div className="flex gap-4 items-center justify-center">
                      <Button className="font-bold text-white text-xs bg-green-600 w-52"  onClick={() => setStep(2)}>Modificar Valores</Button>
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
                            <SelectItem key={"Reparto"} value={"Reparto"} onClick={() => setStatus("Entregado")} >Entregado</SelectItem>    
                            <SelectItem key={"Devolucion"} value={"Devolucion"} onClick={() => setStatus("Devuelto")} >Devolucion</SelectItem>   
                            <SelectItem key={"Lavado"} value={"Lavado"} onClick={() => setStatus("Lavado")} >Lavado</SelectItem>     
                            <SelectItem key={"Repuesto"} value={"Repuesto"} onClick={() => setStatus("Repuesto")}>Repuesto</SelectItem>                                          
                      </Select>                    
                      </div>
                      <div className="flex gap-6 items-center mt-6">
                        <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => changeOrderState()}>Confirmar</Button>
                        <Button className="font-bold text-white text-xs bg-green-600 w-40" onClick={() => closeModal()}>Cancelar</Button>
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
                    : null}

                    {step === 2 ? 
                      <div className="flex flex-col items-center justify-center">
                        <Input type="text" variant="faded" label="Fecha de Entrega" value={newOrderDeliveryDate} className="w-56" onChange={(e) => setNewOrderDeliveryDate(e.target.value)}/>
                        <Input type="text" variant="faded" label="Fecha de Devolucion" value={newOrderReturnDate} className="w-56 mt-2" onChange={(e) => setNewOrderReturnDate(e.target.value)}/>
                        <Input type="text" variant="faded" label="Cliente" value={newOrderClient} className="w-56 mt-2"  onChange={(e) => setNewOrderClient(e.target.value)}/>
                        <div className="flex flex-col justify-start items-start  border"> 
                          {newOrderDetail.map((ord) => ( 
                            <div className="flex flex-col items-center mt-2 ">
                              <div className="flex items-center gap-2">
                                <p>{ord.productName}</p> 
                                <p>{ord.quantity}</p> 
                                <p>{ord.choosenProductTotalPrice}</p>
                              </div> 
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 mb-4 flex items-center gap-6">
                           <Button className="font-bold text-white text-xs bg-green-600 w-40">Cancelar</Button>
                           <Button className="font-bold text-white text-xs bg-green-600 w-40">Editar</Button>
                        </div>
                      </div>
                    : null}
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='max-w-max min-w-96 bg-white text-black'>
         {type === "product" ? 
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-zinc-600  text-md">
                  <p className="font-bold text-md">Editar Producto </p>                 
                </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center">
                    <Input type="text" className="mt-2 w-60" label="Articulo" value={newProductName} onChange={(e) => setNewProductName(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Precio Clientes" value={newProductClientsValue} onChange={(e) => setNewProductClientsValue(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Precio Clientes Bonificados" value={newProductBonusClientsValue} onChange={(e) => setNewProductBonusClientsValue(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Precio Reposicion" value={newProductReplacementValue} onChange={(e) => setNewProductReplacementValue(e.target.value)}/>
                    <div className="flex items-center justify-center gap-4 mt-4 mb-4">
                      <Button className="font-bold text-white bg-green-800 text-sm w-52" onClick={() => changeProductData()}>Confirmar Cambios</Button>
                      <Button className="font-bold text-white bg-green-600 text-sm w-52" onPress={onClose}>Cancelar</Button>
                    </div>
                   {succesChangesArticle ?
                    <div className="flex items-center justify-center mb-2 mt-2">
                        <p className="font-bold text-green-800 text-sm">Cambios almacenados con Exito ✔</p>
                    </div> : null}
                </ModalBody>
              
              </>
            )}
          </ModalContent>
          :
          null
          }
      </Modal>
    </>
  );
}

export default EditOrder