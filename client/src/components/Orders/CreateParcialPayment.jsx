
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../store/userContext";
import { useContext } from "react";

const CreateParcialPayment = ({orderData, closeBothModal, updateList}) => {

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [amount, setAmount] = useState(0)
  const [account, setAccount] = useState("")
  const [dateSelected, setDateSelected] = useState('');
  const [daySelected, setDaySelected] = useState('');
  const [monthSelected, setMonthSelected] = useState('');
  const [yearSelected, setYearSelected] = useState('');
  const [succes, setSucces] = useState(false);
  const userCtx = useContext(UserContext);

  const handleOpen = () => { 
    onOpen()
    console.log("ACA", orderData)
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

  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const handleChange = (e) => {
    const selectedDate = e.target.value;
    setDateSelected(selectedDate);

    const [year, month, day] = selectedDate.split('-');
    setDaySelected(parseInt(day, 10));
    setMonthSelected(monthNames[parseInt(month, 10) - 1]);
    setYearSelected(parseInt(year, 10));
  };

   useEffect(() => { 
        console.log("dia", daySelected)
        console.log("mes", monthSelected)
        console.log("año", yearSelected)
        console.log("fecha", dateSelected)
   }, [dateSelected, daySelected, monthSelected, yearSelected])



  const createNewParcialPayment = async () => { 
    const paymentData = ({ 
         amount: amount,
         account: account,
         day: daySelected,
         month: monthSelected,
         year: yearSelected,
         date: dateSelected,
         orderId: orderData.id,
         collectionType: "Pago Parcial",
         client: orderData.client,
         orderDetail: orderData.detail,
         loadedBy: userCtx.userName,
         voucher: null,
       })
    try {
        const {data, status} = await axios.post(`http://localhost:4000/orders/createParcialPayment/${orderData.id}`, paymentData)
        if(status === 200) { 
            console.log(data)
            setSucces(true)
            onClose()
            closeBothModal()
            updateList("everyOrders")
        }
    } catch (error) {
        console.log(error)
    }
  }

 


  

  return (
    <>
      <p className="bg-blue-500 text-white mt-4 font-medium text-sm cursor-pointer p-3 rounded-lg" onClick={handleOpen}>Crear pago Parcial</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Asentar pago Parcial a la orden</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                <div className="w-full">
                   <Input type="date" variant="faded" label="Fecha" className="w-full" onChange={handleChange}/>
                   <Input className="w-full mt-2" variant="bordered" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                </div>              
                 <div className="w-full">
                        <Select variant="faded" label="Selecciona la cuenta destino" className="w-full mt-2">
                            {availablesAccounts.map((acc) => (
                                <SelectItem key={acc.label} value={acc.value} onClick={() => setAccount(acc.value)}>
                                    {acc.label}
                                </SelectItem>
                            ))}
                        </Select>
                 </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-4">
                    <Button className="bg-green-800 font-meidum text-white" onClick={() => createNewParcialPayment()}>
                    Confirmar
                    </Button>
                    <Button className="bg-gray-200 font-meidum text-white" onPress={onClose}>
                    Cancelar
                    </Button>
              </ModalFooter>
              {succes ?
               <div className="flex items-center justify-center mt-4 mb-4">
                  <p>Pago añadido correctaMENTE</p>
              </div> : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateParcialPayment