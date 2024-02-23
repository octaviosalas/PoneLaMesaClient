import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import SecondStepCreateOrder from './SecondStepCreateOrder';

const FirstStepCreateOrder = ({changeState}) => {

    const [missedData, setMissedData] = useState(false)
    const [orderNumber, setOrderNumber] = useState("")
    const [orderStatus, setOrderStatus] = useState("Armado")
    const [placeOfDelivery, setPlaceOfDelivery] = useState("")
    const [dateOfDelivery, setDateOfDelivery] = useState("")
    const [returnPlace, setReturnPlace] = useState("")
    const [returnDate, setReturnDate] = useState("")
    const [allProducts, setAllProducts] = useState("")
    const [allClients, setAllClients] = useState("")
    const [filteredNames, setFilteredNames] = useState("")
    const [choosenClientName, setChoosenClientName] = useState("")
    const [choosenClientId, setChoosenClientId] = useState("")
    const [filteredClientsNames, setFilteredClientsNames] = useState([])
    const [typeOfClient, setTypeOfClient] = useState("")
    const [goToSecondStep, setGoToSecondStep] = useState(false)


    const typeOfClients = [
        {
          label: "No Bonificado",
          value: "No Bonificado"
        },
        {
          label: "Bonificado",
          value: "Bonificado"
        },
      ]

    

      const handleInputClientsChange = (e) => { 
        setChoosenClientName(e);
        if(e.length === 0) { 
          setFilteredClientsNames([])
          setChoosenClientName("")
          setChoosenClientId("")
        } else { 
          const useInputToFindTheClient = allClients.filter((cc) => cc.name.toLowerCase().includes(e))
          setFilteredClientsNames(useInputToFindTheClient)
          console.log(useInputToFindTheClient)
        }
       }

       const chooseClient = (name, id) => { 
         console.log("recibi", id, name)
         setChoosenClientId(id)
         setChoosenClientName(name)
         setFilteredClientsNames([])
       }

       const getClientsData = () => { 
        axios.get("http://localhost:4000/clients")
             .then((res) => { 
                console.log(res.data)
                setAllClients(res.data);
             })
             .catch((err) => { 
               console.log(err)
             })
       }
   
        const executeFunctionDependsTypeOfClient = () => { 
          console.log(choosenClientName)
          console.log(choosenClientId)
            if(orderNumber.length === 0  || choosenClientName.length === 0 || typeOfClient.length === 0 || placeOfDelivery.length === 0 || dateOfDelivery.length === 0 || returnDate.length === 0) { 
              setMissedData(true)
              setTimeout(() => { 
                setMissedData(false)
              }, 2000)
            } else { 
              changeState(true, false)     
              setGoToSecondStep(true)
            }
        }

        useEffect(() => { 
            getClientsData()
        }, [])


  return (

    <>
     {!goToSecondStep ? <div className="flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center justify-center"> 
                                <Input type="number" variant="underlined" value={orderNumber} label="Numero de Orden" className="mt-2 w-64 2xl:w-72" onChange={(e) => setOrderNumber(e.target.value)}/>
                                <Input type="text" variant="underlined" value={choosenClientName} label="Cliente" className="mt-2 w-64 2xl:w-72" onChange={(e) => handleInputClientsChange(e.target.value)}/>
                                <div className="">
                                    {
                                    filteredClientsNames !== "" ? 
                                        <div className='absolute  rounded-xl z-10  shadow-xl bg-white  mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                                            {filteredClientsNames.map((cc) => (
                                                <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500 ml-2" key={cc._id} 
                                                    onClick={() => chooseClient(cc.name, cc._id)}>
                                                    {cc.name}
                                                </p>
                                            ))}
                                        </div>
                                    : null
                                    }
                                </div>  


                                <Select  css={{
                $$inputBorderRadius: '0', // Elimina los bordes redondeados
                $$inputBorder: 'none', // Elimina el borde
            }}  variant="underlined"  label="Tipo de Cliente" className="max-w-xs border border-none mt-2" onChange={(e) => setTypeOfClient(e.target.value)}>
                                {typeOfClients.map((client) => (
                                    <SelectItem key={client.value} value={client.value}>
                                    {client.label}
                                    </SelectItem>
                                ))}
                            </Select>


                                <Input type="text" variant="underlined" value={placeOfDelivery} label="Lugar Entrega" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setPlaceOfDelivery(e.target.value)}/>
                                <Input type="text" variant="underlined" value={returnPlace} label="Lugar Devolucion" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setReturnPlace(e.target.value)}/>
                                <Input type="date" variant="underlined"  classNames={{
                label: "-mt-5"
            }} value={dateOfDelivery} label="Fecha Entrega" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setDateOfDelivery(e.target.value)}/>
                                <Input  type="date" variant="underlined"  classNames={{
                label: "-mt-5"
            }} placeholder="" value={returnDate} label="Fecha Devolucion" className="mt-2 w-64 2xl:w-72"  onChange={(e) => setReturnDate(e.target.value)}/>

                            </div> 
                            <div className="flex flex-col items-center justify-center mt-6">
                                <Button color="success" className="font-medium text-white" onClick={() => executeFunctionDependsTypeOfClient()}>Armar Pedido</Button>
                                {missedData ? <p className="mt-4 text-sm font-medium text-blacl">Debes completar todos los campos</p> : null}
                            </div>
      </div> : <SecondStepCreateOrder typeOfClient={typeOfClient}/>}
    </>
              
  )
}

export default FirstStepCreateOrder
    