import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem, accordion} from "@nextui-org/react";
import { formatePrice, getDay, getMonth, getYear, getDate } from "../../functions/gralFunctions";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import Dropzone from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { v4 as uuidv4 } from 'uuid';


// asentar gasto de tipo seña 
// crear una nueva seña en el modelo
// ponerle un monto mayor a 0 al valor de la seña orden

const CreateDownPayment = ({orderData, updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const userCtx = useContext(UserContext)
  const [downPaymentAmount, setDownPaymentAmount] = useState("")
  const [day, setDay] = useState(getDay())
  const [month, setMonth] = useState(getMonth())
  const [year, setYear] = useState(getYear())
  const [actualDate, setActualDate] = useState(getDate())
  const [account, setAccount] = useState("")
  const [payImage, setPayImage] = useState("")
  const [showDropZone, setShowDropZone] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [deleteDownPaymentSuccesMessage, setDeleteDownPaymentSuccesMessage] = useState(false)
  const [downPaymentId, setDownPaymentId] = useState("")
  const [errorInQuantity, setErrorInQuantity] = useState(false)
  const [missedData, setMisedData] = useState(false)

  const uniqueId = uuidv4();


  const handleOpen = () => { 
   onOpen()
   console.log(orderData)
   if(orderData.downPaymentData.length > 0) { 
    const downPaymentReference = orderData.downPaymentData.map((d) => d.downPaymentId)[0]
    setDownPaymentId(downPaymentReference)
   }
  }

  const availablesAccounts = [
    {
      label: "Cuenta Nacho",
      value: "Cuenta Nacho"
    },
    {
      label: "Cuenta Felipe",
      value: "Cuenta Felipe"
    },
    {
      label: "Efectivo",
      value: "Efectivo"
    },
  ]

  const handleDropImage = (files) => {
    const uploaders = files.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', `codeinfuse, medium, gist`);
      formData.append('upload_preset', 'App-Cars');
      formData.append('api_key', '687985773113572');
      formData.append('timestamp', Date.now() / 1000 / 0);
     
      return axios
        .post('https://api.cloudinary.com/v1_1/dgheotuij/image/upload', formData, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then((res) => {
          const data = res.data;
          const fileURL = data.secure_url;
          console.log(fileURL);
          setPayImage(fileURL) 
        });
    });
  };

  const createNewDownPayment = async () => { 
    if(account.length > 0 && downPaymentAmount > 0) { 
      console.log("Valor de la seña enmviado",  downPaymentAmount)
      console.log("tipo de dato seña", typeof downPaymentAmount)
      const collecctionData = ({ 
          orderId: orderData.id,
          collectionType:"Seña",
          downPaymentId: uniqueId, 
          client: orderData.client,
          orderDetail: orderData.detail,
          date: actualDate,
          day: day,
          month: month,
          year: year,
          amount: parseInt(downPaymentAmount),
          account: account,
          loadedBy: userCtx.userName,
          voucher: payImage
        })
  
      const downPaymentData = ({ 
          orderId: orderData.id,
          client: orderData.client,
          clientId: orderData.clientId,
          orderDetail: orderData.detail,
          downPaymentId: uniqueId,
          date: actualDate,
          day: day,
          month: month,
          year: year,
          amount: parseInt(downPaymentAmount),
          account: account,
          loadedBy: userCtx.userName,
          voucher: payImage
        })  
  
      try {
          const createPayment = await axios.post(`http://localhost:4000/downPayment/createNewDownPayment`, downPaymentData) 
          console.log(createPayment.data)
          console.log(createPayment.status)
          if(createPayment.status === 200) { 
              const createCollection = await axios.post(`http://localhost:4000/collections/addNewCollection`, collecctionData) 
              console.log(createCollection.data)
              console.log(createCollection.status)
             if(createCollection.status === 200) { 
               setSuccesMessage(true)
               setTimeout(() => { 
                  setSuccesMessage(false)
                  onClose()
                  updateList()
               }, 2000)
             } else { 
              setErrorMessage(true)
             }
          }
      } catch (error) {
          console.log(error)
      }    
    } else { 
      setMisedData(true)
      setTimeout(() => { 
        setMisedData(false)
      }, 1800)
    }
   

  }

  const deleteDownPayment = async () => { 
    const downPaymentReference = downPaymentId
   
    try {
      const deleteDownPaymentData = await axios.delete(`http://localhost:4000/orders/deleteDownPayment/${orderData.id}`, { data: { downPaymentReference } })
      console.log(deleteDownPaymentData.data)
      console.log(deleteDownPaymentData.status)
      if(deleteDownPaymentData.status === 200) { 
        setDeleteDownPaymentSuccesMessage(true)
        setTimeout(() => { 
          setDeleteDownPaymentSuccesMessage(false)
          updateList()
        }, 2100)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <p className="text-green-800 text-xs font-medium cursor-pointer" onClick={handleOpen}>Asentar Seña</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col  text-zinc-60 font-medium">Asentar Seña</ModalHeader>

             {orderData.downPaymentData.length === 0 ?
              <ModalBody className="flex flex-col items-start justify-start">
                 <p className="text-zinc-600 text-sm font-medium"><b>Cliente: </b>{orderData.client}</p>
                 <p className="text-zinc-600 text-sm font-medium"><b>Orden: </b>{orderData.orderNumber}</p>
                 <p className="text-zinc-600 text-sm font-medium"><b>Mes : </b>{orderData.month}</p>
                 <p className="text-zinc-600 text-sm font-medium"><b>Monto total de la orden: </b>{formatePrice(orderData.total)}</p>

                 
                             <Input 
                              type="number" 
                              variant="faded" 
                              placeholder="Ingresa el valor de la seña" 
                              value={downPaymentAmount}   
                              onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || (value > 0 && !isNaN(value))) {
                                setDownPaymentAmount(e.target.value);
                                setErrorInQuantity(false)
                              } else {
                                setErrorInQuantity(true)
                              }
                              }} 
                              startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">$</span>
                              </div>
                              }
                             />

                             {errorInQuantity ? <p className="text-xs text-zinc-700 font-medium">Debes ingresar un numero mayor a 0</p> : null}


                 <Select variant="faded" label="Selecciona la cuenta de Cobro" className="w-full" onChange={(e) => setAccount(e.target.value)} >
                    {availablesAccounts.map((acc) => (
                    <SelectItem key={acc.value} value={acc.value}>
                        {acc.label}
                    </SelectItem>
                    ))}
                 </Select>


                {downPaymentAmount !== "" && account !== ""?
                 <div className="ml-1"> 
                    <p className="text-zinc-600 text-sm font-medium">Seña Ingresada: {formatePrice(downPaymentAmount)}</p>
                    <p className="text-zinc-600 text-sm font-medium">Valor pendiente de cobro: {formatePrice(orderData.total - downPaymentAmount)}</p>
                    {account !== "Efectivo" ? <p className="text-green-800 text-xs underline font-medium" onClick={() => setShowDropZone(prevState => !prevState)}>Adjuntar Comprobante</p> : null}
                 </div> : null}
              </ModalBody> : 

              <ModalBody className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-start justify-start">
                  <p className="font-medium text-sm text-green-800 underline">Esta orden ya fue señada</p>
                  {orderData.downPaymentData.map((down) => ( 
                    <div className="flex flex-col" key={down.amount}>
                        <p className="text-zinc-600 font-medium text-sm mt-2"><b>Fecha: </b>{down.date}</p>
                        <p className="text-zinc-600 font-medium text-sm"><b>Monto Señado: </b> {formatePrice(down.amount)}</p>
                        <p className="text-zinc-600 font-medium text-sm"><b>Forma de Pago: </b> {down.account}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 w-full flex items-center justify-center gap-4">
                   <Button className="bg-green-800 text-white font-medium text-sm" onClick={() => deleteDownPayment()}>Eliminar Seña</Button>
                   <Button className="bg-green-800 text-white font-medium text-sm" onPress={onClose}>Cancelar</Button>
                </div>

                {deleteDownPaymentSuccesMessage ? 
                <div>
                   <p className="font-medium text-green-800 text-sm ">La seña fue eliminada correctamente</p>
                </div> : null}

              </ModalBody>

              }

                {showDropZone ? 
                <div className="flex items-center justify-center">
                   <Dropzone onDrop={handleDropImage}>
                   {({ getRootProps, getInputProps }) => (
                       <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                               <div className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 w-60" style={{ backgroundImage: `url(${payImage})`, backgroundSize: 'cover' }}>
                                 <div className="text-center">
                                   <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                       <label
                                           htmlFor="file-upload"
                                           className="relative cursor-pointer rounded-md bg-white font-semibold text-green-800 focus-within:outline-none  "
                                           >
                                           <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                     </div>
                                 </div>
                             </div>
                          </div> )}
                  </Dropzone>
                  </div> : null
                 }

             {orderData.downPaymentData.length === 0 ?
              <ModalFooter className="flex justify-center items-center mt-2 mb-2">
                    <Button className="bg-green-800 font-medium text-white text-sm" onClick={() => createNewDownPayment()}> Confirmar Seña </Button>
                    <Button className="bg-green-800 font-medium text-white text-sm"  onPress={onClose}>  Cancelar  </Button>
              </ModalFooter> : null}

             {succesMessage?
              <div className="mt-4 mb-4 flex items-center justify-center">
                <p className="font-medium text-green-800 text-sm">La seña fue asentada a la Orden ✔</p>
              </div> : null}

              {missedData?
              <div className="mt-4 mb-4 flex items-center justify-center">
                <p className="font-medium text-green-800 text-sm">Debes seleccionar una cuenta</p>
              </div> : null}

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default CreateDownPayment