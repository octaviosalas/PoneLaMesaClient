import React, { useEffect } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import axios from 'axios';
import { useState } from 'react';
import Loading from '../Loading/Loading';

const CancelPendingReplacement = ({data, updateList}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const [load, setLoad] = useState(false)
    const [cancelParcial, setCancelParcial] = useState(false)
    const [originalDetail, setOriginalDetail] = useState(data.detail)
    const [size, setSize] = useState("xl")
    const [quantities, setQuantities] = useState(originalDetail.map(or => ({
      productId: or.productId,
      productName: or.productName,
      missing: or.missing, 
      remaining: or.missing, 
      quantity: 0 
    })));


    const handleOpen = () => { 
        console.log(data)
        onOpen()
    }

    const deleteReplacement = async () => { 
        setLoad(true)
        const productsToUpdateStock = ({ 
          products: data.detail
        })
        try {
            const response = await axios.post(`http://localhost:4000/clients/cancelDebt/${data.clientData.id}/${data.debtId}`, productsToUpdateStock)
            console.log(response.data)
            if(response.status === 200) { 
              updateList()
              onClose()
              setLoad(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeValues = (productId, value) => {
      const newQuantities = quantities.map(item =>
        item.productId === productId
          ? {
              ...item,
              remaining: item.missing - value, 
              quantity: Number(value) 
            }
          : item
      );
      setQuantities(newQuantities); 
    
      const updatedOriginalDetail = originalDetail
        .map(item =>
          item.productId === productId
            ? {
                ...item,
                missing: item.missing - Number(value), 
              }
            : item
        )
        .filter(item => item.missing > 0);
       setOriginalDetail(updatedOriginalDetail); 
    };

    useEffect(() => { 
     console.log("stock", quantities)
    }, [quantities])

    
    useEffect(() => { 
      console.log("originalDetail", originalDetail)
     }, [originalDetail])

    const applyParcialCancelation = async () => { 
       const dataToSend = ({ 
         debtDataUpdated: originalDetail,
         dataToUpdateStock: quantities
       })
       console.log(dataToSend)
      /* try {
        const response = await axios.post(`http://localhost:4000/clients/cancelPartialDebt/${data.clientData.id}/${data.debtId}`, dataToSend)
        console.log(response.data)
        if(response.status === 200) { 
          updateList()
          onClose()
          setLoad(false)
        }
       } catch (error) {
        console.log(error)
       } */
    }






  return (
    <>
    <p className='text-green-800 font-medium text-sm cursor-pointer' onClick={handleOpen}>Cancelar</p>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Cancelar Reposicion</ModalHeader>
            <ModalBody className='flex flex-col items-center justify-center'>
              <div className='flex flex-col items-center justify-center'> 
                 <p className='text-black text-sm font-medium'>¿Estas seguro de cancelar la reposicion?</p>
                 <p className='text-black text-sm font-medium'>La deuda del cliente sera eliminada</p>
              </div>

              <div className='flex gap-6 items-center justify-center mt-4 mb-2'>
                <Button className='bg-green-800 text-white font-medium text-sm' onClick={() => deleteReplacement()}>Cancelar total</Button>
                <Button className='bg-green-800 text-white font-medium text-sm' onClick={() => setCancelParcial(prevState => !prevState)}>Cancelar parcialmente</Button>
                <Button className='bg-green-800 text-white font-medium text-sm'>Salir</Button>
              </div>  

              {cancelParcial ? 
              <div className='flex flex-col items-center justify-center w-full'>
                 {originalDetail.map((or) => ( 
                  <div className='flex items-center gap-6' key={or.productId}>
                        <p className='font-medium'>{or.productName}</p>
                        <Input variant="underlined" className='w-2/4' placeholder="-" onChange={(e) => handleChangeValues(or.productId, e.target.value)}/>
                  </div>
                 ))}
                 <div className='mt-4'>
                   <Button onClick={() => applyParcialCancelation()}>Confirmar</Button>
                 </div>
              </div> : null}

            </ModalBody>
            {load ?
              <div className='mt-4 flex justify-center items-center'>
                 <Loading/>
              </div> :  null}
          </>
        )}
      </ModalContent>
    </Modal>
  </>
  )
}

export default CancelPendingReplacement
