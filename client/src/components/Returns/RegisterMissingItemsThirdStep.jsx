import React, { useEffect, useState } from 'react'
import {Select, SelectItem, Button} from "@nextui-org/react";
import axios from "axios"
import { formatePrice, getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import Dropzone from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { v4 as uuidv4 } from 'uuid';

const RegisterMissingItemsThirdStep = ({orderData, missingArticlesDetail, valueToPay, client, clientId, comeBack, closeModalNow }) => {

    const [orderId, setOrderId] = useState("")
    const [succesMessage, setSuccesMessage] = useState(false)
    const [succesMessageWithPaidReplacement, setSuccesMessageWithPaidReplacement] = useState(false)
    const [addAccount, setAddAccount] = useState(false)
    const [missedAccount, setMissedAccount] = useState(false)
    const [account, setAccount] = useState("")
    const [actualDate, setActualDate] = useState(getDate())
    const [day, setDay] = useState(getDay())
    const [month, setMonth] = useState(getMonth())
    const [year, setYear] = useState(getYear())
    const userCtx = useContext(UserContext)
    const [payImage, setPayImage] = useState("")
    const uniqueId = uuidv4();

    useEffect(() => { 
        console.log(uniqueId)
    }, [])


    useEffect(() => { 
        setOrderId(orderData.map((ord) => ord._id)[0])
    }, [])

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

    const sendMissedArticlesWithOutPaid = async () => { 
        try {
                const data = missingArticlesDetail.map((art) => { 
                    return { 
                        productName: art.productName,
                        productId: art.productId,
                        missedQuantity: art.missing,
                        valueToPay: art.replacementPrice * art.missing
                    }
               })
                const missedProductsData = ({ 
                    productMissed: data,
                    amount: valueToPay,
                    paid: false
                })

                const sendArticlesMissed = await axios.post(`http://localhost:4000/orders/addMissedArticles/${orderId}`, {missedProductsData}) 
                const response = sendArticlesMissed.data
                console.log(response)

                const debtData = ({ 
                    orderCompletedData: orderData,
                    productsMissed: missingArticlesDetail,
                    amountToPay: valueToPay,
                    paid: false,
                    debtId: uniqueId
                })

                if(sendArticlesMissed.status === 200) { 
                    const sendClientDebt = await axios.post(`http://localhost:4000/clients/createClientDebt/${clientId}`, {debtData}) 
                    const response = sendClientDebt.data
                    console.log(response)

                    if(sendClientDebt.status === 200) { 
                        const newStatus = "Devuelto";
                        const statusUpdateResponse = await axios.put(`http://localhost:4000/orders/changeOrderState/${orderId}`, { newStatus });
                        console.log(statusUpdateResponse.data);

                        if(statusUpdateResponse.status === 200) { 
                            setSuccesMessage(true)
                            setTimeout(() => { 
                                comeBack()
                                closeModalNow()
                            }, 2700)
                        }
                    }

                }
                } catch (error) {
                    console.log(error)
                }
    }

    const sendMissedArticlesWithPaid = async () => { 
        try {
            const data = missingArticlesDetail.map((art) => { 
                return { 
                    productName: art.productName,
                    productId: art.productId,
                    missedQuantity: art.missing,
                    valueToPay: art.replacementPrice * art.missing
                }
           })
            const missedProductsData = ({ 
                productMissed: data,
                amount: valueToPay,
                paid: true
            })

            const sendArticlesMissed = await axios.post(`http://localhost:4000/orders/addMissedArticles/${orderId}`, {missedProductsData}) 
            const response = sendArticlesMissed.data
            console.log(response)
            
            if(sendArticlesMissed.status === 200) { 
                const newStatus = "Devuelto";
                const statusUpdateResponse = await axios.put(`http://localhost:4000/orders/changeOrderState/${orderId}`, { newStatus });
                console.log(statusUpdateResponse.data);
                
                if(statusUpdateResponse.status === 200) { 
                    if(account.length !== 0 && payImage.length > 0) { 
                        const collecctionData = ({ 
                            orderId: orderId,
                            collectionType: "replacement",
                            client: client,
                            orderDetail: orderData.map((ord) => ord.orderDetail[0]),
                            date: actualDate,
                            day: day,
                            month: month,
                            year: year,
                            amount: valueToPay,
                            account: account,
                            loadedBy: userCtx.userName,
                            voucher: payImage
                          })
                        const createNewCollection = axios.post("http://localhost:4000/collections/addNewCollection", collecctionData)
                        console.log(createNewCollection.data)
                        setSuccesMessageWithPaidReplacement(true)
                        setTimeout(() => { 
                            setSuccesMessageWithPaidReplacement(false)
                            comeBack()
                        }, 2000)
                    } else { 
                        console.log("no cumplen ambas")
                        setMissedAccount(true)
                        setTimeout(() => { 
                            setMissedAccount(false)
                            setAccount("")
                        })
                    }           
                }
            }
            
        } catch (error) {
            
        }
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
    <div className='flex flex-col items-center justify-center'>
         <h5 className='font-medium text-zinc-600 text-md'>¿El cliente ya abono los faltantes?</h5>
        <div className='flex flex-col items-start text-start justify-start'>
            <p className='font-medium mt-2 text-green-800 text-xs'>* Si confirmas el cobro, los faltantes quedaran abonados.</p>
            <p className='font-medium mt-2 text-green-800 text-xs'>* Si confirmas sin el cobro, los faltantes quedaran a deuda del cliente.</p>
            <p className='font-medium mt-2 text-green-800 text-xs'>* La deuda a pagar del cliente {client} sera de {formatePrice(valueToPay)}</p>
        </div>
        {succesMessage === false ? 
            <div className='flex mt-6 gap-4'>
            {addAccount  ? null :
              <div className='flex gap-4'>
                 <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={() => setAddAccount(true)}>Confirmar Cobro</Button>
                 <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={() => sendMissedArticlesWithOutPaid()}>Confirmar Sin Cobro </Button>
                </div>
             }
            </div> : 
            <div className='flex flex-col items-center justify-center mt-6'>
                <p className='font-medium text-sm text-green-800'>Los Articulos a Reponer fueron adjuntados al pedido ✔</p>
                <p className='font-medium text-sm text-green-800 mt-2'>El cliente adjunto una Deuda ✔</p>
            </div>
            }    

            {addAccount ? 
            <>
             <div className="mt-4 mb-6f flex flex-col items-center justify-center">
                <Select variant="faded" label="Selecciona la cuenta de Cobro" className="w-72" onChange={(e) => setAccount(e.target.value)}>
                    {availablesAccounts.map((acc) => (
                    <SelectItem key={acc.value} value={acc.value}>
                        {acc.label}
                    </SelectItem>
                    ))}
               </Select>
               <Button className='bg-green-800 text-white font-medium text-sm mt-3 mb-2 w-52' onClick={() => setAddAccount(false)}>Cancelar</Button>
           </div>

              {account.length > 0 ?
                    <div className='w-full'>
                        <Dropzone onDrop={handleDropImage}>
                          {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps({ className: 'dropzone' })} >
                                   <input {...getInputProps()} />
                                      <div className="mt-4 w-full flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" style={{ backgroundImage: `url(${payImage})`, backgroundSize: 'cover' }}>
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
                         <div className='flex gap-4 items-center mt-4 mb-2 '>
                            <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={() => sendMissedArticlesWithPaid()}>Confirmar</Button>
                            <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={() => setAddAccount(false)}>Cancelar </Button>
                         </div>
                         {missedAccount ? <p className='text-sm text-green-800 font-medium mt-4 mb-2'>Faltan Datos para terminar la Operacion</p> : null}
                         {succesMessageWithPaidReplacement ? 
                                <div className='flex flex-col items-center justify-center mt-6'>
                                    <p className='font-medium text-sm text-green-800'>Los Articulos a Reponer fueron marcados como Abonados ✔</p>
                                </div>
                         :
                         null}
                    </div> 
                    :
                    null}
           </>
            : null}
    </div>
  )
}

export default RegisterMissingItemsThirdStep