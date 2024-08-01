import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import axios from 'axios';
import { useState } from 'react';
import Loading from '../Loading/Loading';

const CancelPendingReplacement = ({data, updateList}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const [load, setLoad] = useState(false)


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




  return (
    <>
    <p className='text-green-800 font-medium text-sm cursor-pointer' onClick={handleOpen}>Cancelar</p>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                <Button className='bg-green-800 text-white font-medium text-sm' onClick={() => deleteReplacement()}>Confirmar</Button>
                <Button className='bg-green-800 text-white font-medium text-sm'>Cancelar</Button>
              </div>           
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
