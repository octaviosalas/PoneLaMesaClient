import React, {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import { months, everyYears } from "../../functions/gralFunctions";
import {Select, SelectItem} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ClousureMonth = () =>  {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [years, setYears] = useState(everyYears)
  const [everyMonths, setEveryMonths] = useState(months)
  const [yearSelected, setYearSelected] = useState("");
  const [monthSelected, setMonthSelected] = useState("")
  const navigate = useNavigate()

  const goToSeeTheClousure =  (year, month) => { 
    console.log(year)
    console.log(month)
    navigate(`/Cierre/${year}/${month}`)
  }
  
  return (
    <>
           <Card className="w-auto h-full cursor-pointer">
              <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-black uppercase font-bold">Cierre Mes</p>
              </CardHeader>
              <Image
              onClick={onOpen}
                removeWrapper
                alt="Card background"
                className="z-0 w-[400px] h-[400px] object-cover"
                src="https://www.gerencie.com/wp-content/uploads/asiente-cierre-contable.png"
              />
            </Card>
          
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Cierre</ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
              <Select variant={"faded"} label="Selecciona un año" className="max-w-xs" value={yearSelected}>          
                                            {years.map((year) => (
                                            <SelectItem key={year.value} value={year.label} textValue={year.value} onClick={() => setYearSelected(year.value)}>
                                                {year.label}
                                            </SelectItem>
                                            ))}
                                    </Select>
              <Select variant={"faded"} label="Selecciona un mes" className="max-w-xs mt-3" value={monthSelected}>          
                                {everyMonths.map((month) => (
                                <SelectItem key={month.label} value={month.value} onClick={() => setMonthSelected(month.value)}>
                                {month.label}
                                </SelectItem>))}
              </Select>
              </ModalBody>
              <ModalFooter className="flex gap-4 items-center justify-center">
                <Button className="bg-green-800 text-white font-medium text-sm w-72" onClick={() => goToSeeTheClousure(yearSelected, monthSelected)}>
                  Ver Cierre
                </Button>
                <Button className="bg-green-800 text-white font-medium text-sm w-72" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ClousureMonth