import React, { useEffect, useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import axios from 'axios'
import { everyClients } from "../../../functions/gralFunctions";



const EditClientOrderData = ({comeBack, clientName, clientId, orderId, updateClientData, closeModal}) => {
  
    const [newOrderClient, setNewOrderClient] = useState(clientName)
    const [succesMessage, setSuccesMessage] = useState(false)
    const [allClients, setAllClients] = useState([])
    const [choosenClientName, setChoosenClientName] = useState([])
    const [newOrderClientId, setNewOrderClientId] = useState([])
    const [nameClientDoesNotExist, setNameClientDoesNotExist] = useState(false)
    const [filteredClientsNames, setFilteredClientsNames] = useState([])
    const [errorInClientName, setErrorInClientName] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await everyClients();
            setAllClients(data);
          } catch (error) {
            console.error("Error fetching clients:", error);
          }
        };   
        fetchData();
     }, []);

    const chooseClient = async (name, id) => { 
        console.log("recibi", id, name)
        setNewOrderClientId(id)
        setNewOrderClient(name)
        setFilteredClientsNames([])       
    }

    const handleInputClientsChange = (e) => { 
        setNewOrderClient(e);
        if(e.length === 0) { 
          setFilteredClientsNames([])
          setChoosenClientName("")
          setNewOrderClientId("")
        } else { 
          const useInputToFindTheClient = allClients.filter((cc) => cc.name.toLowerCase().includes(e))
          if(useInputToFindTheClient.length > 0 ) { 
            setFilteredClientsNames(useInputToFindTheClient)
            console.log(useInputToFindTheClient)
            setNameClientDoesNotExist(false)
          } else { 
            console.log("Agrega al cliente")
            setNameClientDoesNotExist(true)
            setFilteredClientsNames([])
          }
          
        }
    }

     const changeOrderData = async () => { 
        if(nameClientDoesNotExist === false) { 
            const newOrderData = ({ 
                newOrderClient: newOrderClient,    
                newOrderClientId: newOrderClientId   
              })            
              try {
                 const changeClient = await axios.put(`http://localhost:4000/orders/updateOrderData/${orderId}`, newOrderData)
                 console.log(changeClient.data)
                 if(changeClient.status === 200) { 
                  setSuccesMessage(true)
                  updateClientData()
                  setTimeout(() => { 
                      closeModal()
                      setSuccesMessage(false)
                      setModifyData(false)
                      comeBack()
                    }, 1500)
                 }
             } catch (error) {
                console.log(error)
             }
        } else { 
            setErrorInClientName(true)
            setTimeout(() => { 
                setErrorInClientName(false)
            })
        }  
    }

  return (
    <div className="flex flex-col items-center justify-center">                  
            <Input type="text" variant="underlined" label="Cliente" value={newOrderClient} className="w-56 mt-2" onChange={(e) => handleInputClientsChange(e.target.value)}/>             
              <div className="">
                    { filteredClientsNames !== "" ? 
                        <div className='absolute  rounded-xl z-10  shadow-xl bg-white  mt-1 w-32 lg:w-56 items-start justify-start overflow-y-auto max-h-[100px]' style={{ backdropFilter: 'brightness(100%)' }}>
                            {filteredClientsNames.map((cc) => (
                                <p className="text-black text-md font-medium mt-1 cursor-pointer hover:text-zinc-500 ml-2" key={cc._id} 
                                onClick={() => chooseClient(cc.name, cc._id, cc.home)}>
                             {cc.name}
                          </p>
                        ))}
                       </div>
                    : null
                    }
              </div>  
              {nameClientDoesNotExist ? <p className='text-xs text-zinc-600 font-medium'>El cliente no existe, debes crearlo</p> : null}                                 
        <div className="mt-4 mb-8 flex items-center gap-6">
            <Button className="font-medium text-white text-sm bg-green-800 w-72" onClick={() => changeOrderData()}>Confirmar</Button>     
            <Button className="font-medium text-white text-sm bg-green-800 w-72" onClick={() => comeBack(false)}>Cancelar</Button>   
         </div>
         {succesMessage ? (
                <div className="mt-4 mb-4 flex items-center">
                   <p className="font-medium text-green-500 text-sm">Datos de Orden editados con Éxito ✔</p>
                </div>
          ) : null}
          {errorInClientName ? <p className='text-zinc-600 font-medium text-sm'>Estas ingresando un cliente Inexistente. Debes crearlo</p> : null}
    </div>
  )
}

export default EditClientOrderData
