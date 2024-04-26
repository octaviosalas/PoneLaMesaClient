import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice, getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import Dropzone from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/solid'

const PostPayment = ({usedIn, valueToPay, orderData, changeOrderPaid, updateList, withDownPayment}) => {

  const userCtx = useContext(UserContext)
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [account, setAccount] = useState("")
  const [actualDate, setActualDate] = useState(getDate())
  const [day, setDay] = useState(getDay())
  const [month, setMonth] = useState(getMonth())
  const [year, setYear] = useState(getYear())
  const [missedData, setMissedData] = useState(false)
  const [succesChangeState, setSuccesChangeState] = useState(false)
  const [succesCollectionSaved, setSuccesCollectionSaved] = useState(false)
  const [succesOperation, setSuccesOperation] = useState(false)
  const [payImage, setPayImage] = useState("")
  const [orderIdItem, setOrderIdItem] = useState("")
  const [orderClientItem, setOrderClientItem] = useState("")
  const [orderDetailItem, setOrderDetailItem] = useState([])
  const [orderTotalItem, setOrderTotalItem] = useState("")
  const [remainingAmount, setRemainingAmount] = useState("")
  const [withOutLogin, setWithOutLogin] = useState(false)

  const handleOpen = () => { 
    onOpen()
    if(usedIn === "CreateNewReturn") { 
      console.log("en used id:, el valor de orderData", orderData)
      console.log("en used id:, el valor de withDownPayment", withDownPayment)
      console.log("en used id:, el valor de valueToPay", valueToPay)
      const match = valueToPay.match(/[0-9.]+/);
      const valueToPayNumber = match ? parseFloat(match[0].replace(/\./, '')) : NaN;
      console.log(valueToPayNumber); 
      setRemainingAmount(valueToPayNumber)
      getOrderIdToPostPayment()
      console.log("EL TIPO DE VALUE TO PAY RECIBIDA", typeof valueToPay)
      console.log("VALUE TO PAY RECIBIDA:", valueToPay[0])
     }

  }

  const getOrderIdToPostPayment = () => { 
    const id = orderData.map((o) => o._id)[0]
    const client = orderData.map((o) => o.client)[0]
    const detail = orderData.map((o) => o.orderDetail)[0]
    const total = orderData.map((o) => o.total)[0]
    setOrderIdItem(id)
    setOrderClientItem(client)
    setOrderDetailItem(detail)
    setOrderTotalItem(total)
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

  const addNewCollection = async () => { 
   
    if(account.length !== 0 && userCtx.userId !== null) { 
      const collecctionData = ({ 
        orderId: orderData.id,
        collectionType:"Alquiler",
        client: orderData.client,
        orderDetail: orderData.detail,
        date: actualDate,
        day: day,
        month: month,
        year: year,
        amount: orderData.downPaymentData.length === 0 ? orderData.total : orderData.total - orderData.downPaymentData.map((down) => down.amount)[0],
        account: account,
        loadedBy: userCtx.userName,
        voucher: payImage
      })
   
      console.log(collecctionData.amount)
     try {
        const updateOrderLikePaid = await axios.put(`http://localhost:4000/orders/addPaid/${orderData.id}`)
        console.log(updateOrderLikePaid.data);

        if (updateOrderLikePaid.status === 200) { 
          const addNewCollection = await axios.post("http://localhost:4000/collections/addNewCollection", collecctionData)   
          console.log(addNewCollection.data)
 
           if(addNewCollection.status === 200) { 
             setSuccesCollectionSaved(true)
             setSuccesOperation(true)
             updateList()
             setTimeout(() => { 
              if(usedIn === "CreateNewReturn") { 
                changeOrderPaid(true)
              } 
             onClose()
             setAccount("")
             setSuccesOperation(false)
           }, 1500)
         }
       } 
       } catch (error) {
         console.log(error)
       }
    } else if (userCtx.userId === null) { 
      console.log("aca")
      setWithOutLogin(true)
      setTimeout(() => { 
        setWithOutLogin(false)
      }, 2000)
    } else { 
      setMissedData(true)
        setTimeout(() => { 
          setMissedData(false)
        }, 1500)
    }
    
    
      
  }

  const addNewCollectionUsedInCreateNewReturn = async () => { 
    const collecctionData = ({ 
      orderId: orderIdItem,
      collectionType:"Alquiler",
      client: orderClientItem,
      orderDetail: orderDetailItem,
      date: actualDate,
      day: day,
      month: month,
      year: year,
      amount: withDownPayment ? remainingAmount : orderTotalItem,
      account: account,
      loadedBy: userCtx.userName,
      voucher: payImage
    })
    if(account.length !== 0 && userCtx.userId.length > 0) { 
      try {
        const updateOrderLikePaid = await axios.put(`http://localhost:4000/orders/addPaid/${orderIdItem}`)
        console.log(updateOrderLikePaid.data);

        if (updateOrderLikePaid.status === 200) { 
         const addNewCollection = await axios.post("http://localhost:4000/collections/addNewCollection", collecctionData)   
         console.log(addNewCollection.data)

          if(addNewCollection.status === 200) { 
            setSuccesCollectionSaved(true)
            setSuccesOperation(true)
            setTimeout(() => { 
            changeOrderPaid(true)
            onClose()
            setAccount("")
          }, 1500)
        }
      } 
      } catch (error) {
        console.log(err)
      }
  } else if (account === "Efectivo" && userCtx.userId.length > 0) { 
    try {
      const updateOrderLikePaid = await axios.put(`http://localhost:4000/orders/addPaid/${orderIdItem}`)
      console.log(updateOrderLikePaid.data);

      if (updateOrderLikePaid.status === 200) { 
       const addNewCollection = await axios.post("http://localhost:4000/collections/addNewCollection", collecctionData)   
       console.log(addNewCollection.data)

        if(addNewCollection.status === 200) { 
          setSuccesCollectionSaved(true)
          setSuccesOperation(true)
          setTimeout(() => { 
          changeOrderPaid(true)
          onClose()
          setAccount("")
        }, 1500)
      }
    } 
    } catch (error) {
      console.log(error)
    }
  } else if (userCtx.userId.length === 0) { 
     setWithOutLogin(true)
     setTimeout(() => { 
      setWithOutLogin(false)
    }, 2000)
  }  else { 
    setMissedData(true)
    setTimeout(() => { 
      setMissedData(false)
    }, 1500)
  }
  }
  
  const handleClose = () => { 
    onClose()
    setAccount("")
   }

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

  return (
    <>
      {usedIn === "CreateNewReturn" ? 
        <Button onPress={handleOpen}  className="text-white bg-green-800 font-medium text-sm mt-2">Asentar Cobro de {valueToPay}</Button>
        :
        <p onClick={onOpen} className="text-green-700 font-medium text-xs cursor-pointer">Asentar</p>}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                 <ModalHeader className="flex flex-col gap-1 text-zinc-600 font-bold text-md">
                    <div>
                        <p className="text-zinc-600 font-bold text-md"> Asentar cobro del Pedido</p>
                    </div>
                  {usedIn !== "CreateNewReturn" ?
                     <div className="flex flex-col text-start justify-start  mt-2">
                        <p className="text-sm font-medium text-black">Cliente: {orderData.client}</p>
                        <p className="text-sm font-medium text-black">Cargado el {orderData.day} de {orderData.month} de {orderData.year}</p>
                        {orderData.downPaymentData.length > 0 ? <p className="text-sm font-medium text-green-800">Esta orden tiene una seña abonada</p> : null}
                        {orderData.downPaymentData.length === 0 ? 
                         <p className="text-sm font-medium text-black">Monto a cobrar: {formatePrice(orderData.total)}</p> 
                         : 
                         <p className="text-sm font-medium text-black">Monto pendiente de cobro: {formatePrice(orderData.total - orderData.downPaymentData.map((down) => down.amount)[0])}</p>
                         }
                       
                      </div>
                     : 
                     <div className="flex flex-col text-start justify-start  mt-2">
                        <p className="text-sm font-medium text-black">Cliente: {orderData.map((ord) => ord.client)}</p>
                        <p className="text-sm font-medium text-black">Monto a cobrar: {valueToPay}</p>
                     </div>
                    }

                    {usedIn !== "CreateNewReturn" && orderData.paid === true ? (
                      <div className="mt-4 flex items-center justify-center">
                        <p className="text-md text-green-800 font-medium">Esta orden ya fue cobrada</p>
                      </div>
                    ) : (
                      usedIn === "CreateNewReturn" ? 
                      <div className="flex flex-col items-center justify-center mt-4">
                        <Select variant="faded" label="Selecciona la cuenta de Cobro" className="max-w-xs" onChange={(e) => setAccount(e.target.value)}>
                                {availablesAccounts.map((acc) => (
                                  <SelectItem key={acc.value} value={acc.value}>
                                      {acc.label}
                                  </SelectItem>
                                ))}
                          </Select>
                      </div>
                      : usedIn !== "CreateNewReturn" && orderData.paid === false ? ( 
                        <div className="flex flex-col items-center justify-center mt-4">
                            <Select variant="faded" label="Selecciona la cuenta de Cobro" className="max-w-xs" onChange={(e) => setAccount(e.target.value)}>
                                {availablesAccounts.map((acc) => (
                                  <SelectItem key={acc.value} value={acc.value}>
                                    {acc.label}
                                  </SelectItem>
                                ))}
                            </Select>
                        </div>
                        
                      ) : null
                    )}

                  {account.length > 0 && account !== "Efectivo"?
                    <div>
                        <Dropzone onDrop={handleDropImage}>
                          {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps({ className: 'dropzone' })}>
                                   <input {...getInputProps()} />
                                      <div className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" style={{ backgroundImage: `url(${payImage})`, backgroundSize: 'cover' }}>
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
                    </div> 
                    :
                    null}

                 </ModalHeader>
              <ModalBody>
               
                
              </ModalBody>
                <ModalFooter className="flex items-center justify-center">
                      {succesOperation ? 
                          <p className="text-green-700 font-medium text-sm">
                            Cobro almacenado con exito ✔
                          </p>
                      :
                      <div className="flex gap-6 items-center justify-center">
                         {usedIn !== "CreateNewReturn" && orderData.paid === true ? null :
                          <Button  className="font-bold text-white text-sm bg-green-600 w-32"  onPress={usedIn === "CreateNewReturn" ? addNewCollectionUsedInCreateNewReturn : addNewCollection}>
                            Asentar Pago
                          </Button>
                          }
                          <Button  className="font-bold text-white text-sm bg-green-600 w-32" onPress={handleClose}>
                            Cancelar
                          </Button>
                      </div>
                    }
                </ModalFooter>

                    {missedData ?
                      <div className="flex items-center justify-center mt-4 mb-4">
                        <p className="font-medium text-green-800 text-sm">Faltan Datos para Agendar el cobro</p>
                      </div>
                      :
                      null}

                      {withOutLogin ?
                      <div className="flex items-center justify-center mt-4 mb-4">
                        <p className="font-medium text-green-800 text-sm">Debes iniciar Sesion para registrar un cobro</p>
                      </div>
                      :
                      null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default PostPayment