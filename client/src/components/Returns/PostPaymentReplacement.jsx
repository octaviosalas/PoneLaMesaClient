import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice, getDate, getDay, getMonth, getYear} from "../../functions/gralFunctions";
import {Select, SelectItem} from "@nextui-org/react";
import { useContext } from "react";
import { UserContext } from "../../store/userContext";
import Dropzone from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/solid'
import axios from "axios";


const PostPaymentReplacement = ({comeBack, orderId, clientName, clientId, orderDetail, debtAmount, debtId}) => {

    const [payImage, setPayImage] = useState("")
    const userCtx = useContext(UserContext)
    const [account, setAccount] = useState("")
    const [actualDate, setActualDate] = useState(getDate())
    const [actualDay, setActualDay] = useState(getDay())
    const [actualMonth, setActualMonth] = useState(getMonth())
    const [actualYear, setActualYear] = useState(getYear())


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

      const updateDebtToPaid = async () => { 
        try {
           const collecctionData = ({ 
               orderId: orderId,
               collectionType:"replacement",
               paymentReferenceId: debtId,
               client: clientName,
               orderDetail: orderDetail,
               date: actualDate,
               day: actualDay,
               month: actualMonth,
               year: actualYear,
               amount: debtAmount,
               account: account,
               loadedBy: userCtx.userName,
               voucher: payImage
             })

           const addNewCollection = await axios.post("http://localhost:4000/collections/addNewCollection/", collecctionData)
           console.log(addNewCollection.data);

           if (addNewCollection.status === 200) { 
            const data = ({ 
                debtId: debtId,
                orderId: orderId,
                newStatus: true
            })
            const updateDebtState = await axios.put(`http://localhost:4000/clients/updateDebtStatus/${clientId}`, {data})
            console.log(updateDebtState.data);
            
            if(updateDebtState.status === 200) { 
                const missedArticlesData = ({ 
                    missedArticlesReference: debtId,
                    newStatus: true
                })
                const updateMissedProductsOrdersLikePaid = await axios.put(`http://localhost:4000/orders/updateMissedArticlesLikePaid/${orderId}`, {missedArticlesData})
                console.log(updateMissedProductsOrdersLikePaid.data)

                if(updateMissedProductsOrdersLikePaid.status === 200) { 
                    console.log("Salio todo bien")
                }
            }
           }
        } catch (error) {
           
        }
     }

    return (
    <div>
                      <div className="flex flex-col items-center justify-center mt-4">
                        <Select variant="faded" label="Selecciona la cuenta de Cobro" className="max-w-xs" onChange={(e) => setAccount(e.target.value)}>
                                {availablesAccounts.map((acc) => (
                                  <SelectItem key={acc.value} value={acc.value}>
                                      {acc.label}
                                  </SelectItem>
                                ))}
                          </Select>
                      </div>

                      
                  {account.length > 0 && account !== "Efectivo"?
                  <>
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
                    <div className="mt-4 mb-4 flex items-center justify-center gap-4">
                         <Button className="bg-green-800 text-white font-medium text-sm" onClick={() => updateDebtToPaid()}>Confirmar</Button>
                         <Button className="bg-green-800 text-white font-medium text-sm" onClick={() => comeBack()}>Cancelar</Button>
                    </div>
                    </>
                    : ( 
                        account.length > 0 && account === "Efectivo" ? ( 
                           <div className="mt-4 mb-4 flex items-center justify-center gap-4">
                             <Button className="bg-green-800 text-white font-medium text-sm">Confirmar</Button>
                             <Button className="bg-green-800 text-white font-medium text-sm" onClick={() => comeBack()}>Cancelar</Button>
                           </div>
                        ) : null
                    )
                    }
    </div>
  )
}

export default PostPaymentReplacement
