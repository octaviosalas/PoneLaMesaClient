import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Input} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import { convertTo12HourFormat } from "../../functions/gralFunctions";

const CreateNewShift = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [startTime, setStartTime] = useState("")
  const [closingHour, setClosingHour] = useState("")
  const [shiftTime, setShitTime] = useState([])
  const [shiftHours, setShiftHours] = useState("")
  const [shiftMinutes, setShiftMinutes] = useState("")
  const [showFirstData, setShowFirstData] = useState(false)
  const [showSecondData, setShowSecondData] = useState(false)

  function calculateDateDifference(startTime, closingHour) {

    var timeStart = new Date("01/01/2007 " + startTime);
    var timeEnd = new Date("01/01/2007 " + closingHour);

    var difference = timeEnd - timeStart;

    var diffInHours = difference / (1000 * 60 * 60);
    var hours = Math.abs(Math.round(diffInHours));

    var diffInMinutes = difference / (1000 * 60);
    var minutes = Math.abs(Math.round(diffInMinutes)) % 60;
    const finalValue = `${hours} horas y ${minutes} minutos`
    setShitTime(finalValue)
    setShiftHours(hours)
    setShiftMinutes(minutes)
    setShowFirstData(true)
    return { hours: hours, minutes: minutes };
  }

  useEffect(() => { 
    if(startTime.length > 0 && closingHour.length > 0) { 
      calculateDateDifference(startTime, closingHour)
    }
  })





  return (
    <>
    <Button onClick={() => onOpen()} className="h-[305px]">
        <Card className="w-full h-full cursor-pointer">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-black uppercase font-bold">Turnos</p>
              <h4 className="text-black font-medium text-large">Iniciar Turno</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src="https://omniawfm.com/blog/images/optimizar-el-calendario-de-turnos-de-trabajo.jpg"
            />
        </Card>
    </Button>
     
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Turno</ModalHeader>
              <ModalBody>
                <Input type="time" variant="underlined" label="Horario de entrada" id="horaEntrada" name="horaEntrada" onChange={(e) => setStartTime(e.target.value)}/>
                <Input type="time" variant="underlined" label="Horario de entrada" id="horaEntrada" name="horaEntrada" className="mt-2" onChange={(e) => setClosingHour(e.target.value)}/>
                

                {showFirstData && !showSecondData ? 
                <div className="mt-2 mb-2 flex flex-col items-center justify-center">
                   <p className="text-sm font-medium text-zinc-700"><b className="font-bold text-green-800">Tiempo del Turno:</b> {shiftHours} horas con {shiftMinutes} minutos</p>
                   <Button className="bg-green-800 text-white font-medium text-sm mt-2 w-full mb-2">Continuar</Button>
                </div> : null}

              {/*  {showSecondData ? 
                <div>
                   <Select>
                     <SelectItem>

                     </SelectItem>
                   </Select>
              </div> : null}*/}

              </ModalBody>

             {/* <ModalFooter className="flex gap-4 items-center justify-center">
                <Button className="bg-green-800 font-medium text-sm w-52 text-white" onPress={onClose}>
                  Crear Turno
                </Button>
                <Button className="bg-green-800 font-medium text-sm w-52 text-white" onPress={onClose}>
                  Cancelar
                </Button>
          </ModalFooter> */}

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateNewShift
