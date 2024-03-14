import React, { useEffect, useState } from 'react'
import { formatePrice } from '../../functions/gralFunctions'
import { Button } from '@nextui-org/react'
import Loading from '../Loading/Loading'
import RegisterMissingItemsThirdStep from './RegisterMissingItemsThirdStep'

const RegisterMissingItemsSecondStep = ({dataUpdated, orderData, comeBack}) => {

    const [articlesWithMissedQuantity, setArticlesWithMissedQuantity] = useState([])
    const [client, setClient] = useState("")
    const [clientId, setClientId] = useState("")
    const [totalToPay, setTotalToPay] = useState("")
    const [load, setLoad] = useState(true)
    const [lastStep, setLastStep] = useState(false)

    const getValues = async () => { 
        console.log(dataUpdated)
        console.log(orderData)
        const articlesWithMissing = dataUpdated.filter(obj => 'missing' in obj);
        const getClient = orderData.map((ord) => ord.client)[0];
        const getClientId = orderData.map((ord) => ord.clientId)[0];
        const getTotalToPay = articlesWithMissing.reduce((acc, el) => acc + el.replacementPrice * el.missing, 0);
        setArticlesWithMissedQuantity(articlesWithMissing)
        setClient(getClient)
        setTotalToPay(getTotalToPay)
        setClientId(getClientId)
        console.log(getTotalToPay)
        console.log(articlesWithMissing)
        if(getTotalToPay > 0) { 
           setLoad(false)
        }
       }
       
       useEffect(() => { 
           getValues()
       }, [])

    return (
        <>
      {lastStep === false  ?
           <div className='flex flex-col items-center text-center justify-center w-full'>
                {load ? (
                    <Loading/>
                ) : (
                    <div>
                    <div className='w-full'>
                        <h5 className='text-md font-bold text-green-800'>Articulos Faltantes</h5>
                        {articlesWithMissedQuantity.map((art) => ( 
                        <div className='flex items-start justify-start-start gap-4' key={art.productName}>
                            <p className='font-medium'><b>Articulo: </b>{art.productName}</p>
                            <p className='font-medium'><b>Cantidad faltante: </b>{art.missing}</p>
                        </div>
                        ))}
                    </div>
                    <div className='mt-6 flex flex-col items-center justify-center'>
                        <h5 className='text-md font-bold text-green-800'>Total a pagar por <b>{client}</b> para Reposicion:</h5>
                        <p className='mt-2 font-bold text-md'>{formatePrice(totalToPay)}</p>
                    </div> 
                    <div className='mt-6 flex items-center justify-center gap-4'>
                        <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={()=> setLastStep(true)}>Confirmar Faltantes</Button>
                        <Button className='bg-green-800 text-white font-medium text-sm w-44' onClick={()=> comeBack(false)}>Cancelar</Button>
                    </div> 
                    </div>
               )}
            </div> :
            <div>
                <RegisterMissingItemsThirdStep orderData={orderData} missingArticlesDetail={articlesWithMissedQuantity} valueToPay={totalToPay} client={client} clientId={clientId} comeBack={comeBack}/>
            </div>
            }
        </>
      
       )
}

export default RegisterMissingItemsSecondStep
