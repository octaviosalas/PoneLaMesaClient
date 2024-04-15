import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import axios from "axios";

const CreateNewEmployee = ({type, updateList}) => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [name, setName] = useState("")
  const [dni, setDni] = useState("")
  const [hourAmount, setHourAmount] = useState(0)
  const [numberError, setNumberError] = useState(false)
  const [succesMessage, setSuccesMessage] = useState(false)
  const [missedData, setMissedData] = useState(false)

  const createNew = async () => { 
    if(name.length > 5 && dni.length > 0 && numberError === false) { 
        const newData = ({ 
            name: name,
            dni: dni,
            hourAmount: hourAmount
        })
        try {
            const sendData = await axios.post("http://localhost:4000/employees/create", newData)
            console.log(sendData.data)
            if(sendData.status === 200) { 
                setSuccesMessage(true)
                updateList()
                setTimeout(() => { 
                    setSuccesMessage(false)
                    onClose()
                    setDni("")
                    setName("")
                }, 1500)
            }
         } catch (error) {
            console.log(error)
         }
    } else { 
        setMissedData(true)
        setTimeout(() => { 
            setMissedData(false)
            setDni("")
            setName("")
        }, 2000)
    }  
  }
 


  return (
    <>
   {type !== "table" ?     <div onClick={() => onOpen()} className="w-[400px] h-52 2xl:w-[600px] 2xl:h-80">

        <Card className=" cursor-pointer">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-black uppercase font-bold">Crear Empleado +</p>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src="https://cdn-icons-png.flaticon.com/512/5070/5070296.png"
            />
        </Card>
    </div> : <p className="text-zinc-700 font-medium text-sm cursor-pointer" onClick={() => onOpen()}>Crear empleado +</p>}
     
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Empleado +</ModalHeader>
              <ModalBody>
                <Input type="text" variant="underlined" label="Nombre" id="name" name="name" onChange={(e) => setName(e.target.value)}/>
                <Input type="number" variant="underlined" label="Dni" id="dni" name="dni" className="mt-2"  onChange={(e) => setDni(e.target.value)}/>
                <Input 
                type="number" 
                variant="underlined" 
                label="Valor Hora" 
                id="hourAmount" 
                name="hourAmount" 
                className="mt-2"   
                onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (value > 0 && !isNaN(value))) {
                              setHourAmount(parseInt(e.target.value, 10));
                              setNumberError(false)
                            } else {
                              setNumberError(true)
                            }
                        }} />

                {numberError ? <p className="text-xs font-medium text-zinc-600">El numero debe ser mayor a 0 </p> : null}        

                    <div className="flex gap-4 items-center jsutify-center mt-4 mb-4">
                       <Button className="bg-green-800 text-white font-medium text-sm w-48" onClick={() => createNew()}>Guardar</Button>
                       <Button className="bg-green-800 text-white font-medium text-sm w-48">Cancelar</Button>
                    </div>
                    <div className="flex flex-col items-center jsutify-center">
                        {missedData ? <p className="text-zinc-700 font-medium text-sm mt-4 mb-2">Debes completar todos los campos</p> : null}
                        {succesMessage ? <p className="text-green-800 font-medium text-sm mt-4 mb-2">Empleado almacenado con exito ✔</p> : null}
                    </div>
                   
              </ModalBody>       
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateNewEmployee



