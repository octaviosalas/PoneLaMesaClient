import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Input, Textarea} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import { convertTo12HourFormat } from "../../functions/gralFunctions";
import { everyEmployees, getDate, getDay, getYear, getMonth, everyActivities, obtenerHoraActualArgentina, shiftsSchedules } from "../../functions/gralFunctions";
import axios from "axios";


const CreateNewShift = () => {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [startTime, setStartTime] = useState("")
  const [closingHour, setClosingHour] = useState("")
  const [shiftTime, setShitTime] = useState([])
  const [realActualTime, setRealActualTime] = useState(obtenerHoraActualArgentina())
  const [shiftHours, setShiftHours] = useState("")
  const [shiftMinutes, setShiftMinutes] = useState("")
  const [showFirstData, setShowFirstData] = useState(false)
  const [showSecondData, setShowSecondData] = useState(false)
  const [employees, setEmployees] = useState([])
  const [employeeName, setEmployeeName] = useState("")
  const [employeeHourAmount, setEmployeeHourAmount] = useState(0)
  const [employeeId, setEmployeeId] = useState("")
  const [activities, setActivities] = useState([])
  const [observations, setObservations] = useState("")
  const [actualDay, setActualDay] = useState(getDay())
  const [actualMonth, setActualMonth] = useState(getMonth())
  const [actualYear, setActualYear] = useState(getYear())
  const [actualDate, setActualDate] = useState(getDate())
  const [activitiesAvailables, setActivitiesAvailables] = useState(everyActivities)
  const [succesMessage, setSuccesMessage] = useState(false)
  const [missedData, setMissedData] = useState(false)
  const [newNameActivitie, setNewNameActivitie] = useState(false)
  const [shiftChoosen, setShiftChoosen] = useState("")

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await everyEmployees();
          setEmployees(data);
          console.log(data)
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };   
      fetchData();
      console.log(realActualTime)
    }, []);

   

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

    const continueToNext = () => { 
      setShowFirstData(false)
      setShowSecondData(true)
    }

    const employeerData = async (id, name) => { 
      console.log(id)
      console.log(name)
      setEmployeeId(id)
      setEmployeeName(name)
      if(id.length > 0) { 
        console.log("si")
        try {
          const getAmountHourEmployee = await axios.get(`http://localhost:4000/employees/getOneEmployee/${id}`)
          const response = getAmountHourEmployee.data
          console.log(response) 
          setEmployeeHourAmount(response.hourAmount)
        } catch (error) {
          console.log(error)
        }
      }
    }

   
    const handleRemoveProduct = (productIdToDelete) => {
        setActivities((prevProducts) =>
        prevProducts.filter((prod) => prod !== productIdToDelete)
      );
    };

    const addNewActivitie = (item) => { 
      console.log(item);
      if(item.length > 0 && !activities.includes(item)) { 
         setActivities([...activities, item]);
         setNewNameActivitie("");
      }
     }
    const createShift = async () => { 
      if(employeeName.length > 0 && employeeId.length > 0 && startTime.length > 0 && shiftChoosen.length > 0 && closingHour.length > 0 && activities.length > 0 && employeeHourAmount !== 0) { 
        try {
          const shiftData = ({   
              employeeName: employeeName,
              employeeId: employeeId,
              realStartTime: realActualTime,
              hourAmountPaid: employeeHourAmount,
              day: actualDay,
              month: actualMonth,
              year: actualYear,
              date: actualDate,
              closingHour: closingHour,
              startTime: startTime,
              observations: observations,
              activities: activities,
              hours: shiftHours,
              minutes: shiftMinutes,
              totalAmountPaidShift: shiftHours * employeeHourAmount,
              shift: shiftChoosen
          })
            const createNewShift = await axios.post("http://localhost:4000/employees/createShift", shiftData)
            const response = createNewShift.data
               console.log("senddata.data", response)
                 console.log("status sendata", createNewShift.status)
                    if(createNewShift.status === 200) { 
                        setSuccesMessage(true)
                          setTimeout(() => { 
                          setSuccesMessage(false)
                          setEmployeeName("")
                          setEmployeeId("")
                          setStartTime("")
                          setShiftChoosen("")
                          setClosingHour("")
                          setActivities([])
                          setEmployeeHourAmount(0)
                          onClose()
                          setShowSecondData(false)
                          setShowFirstData(false)
                        }, 2000)
                  } 
        } catch (error) {
          console.log(error)
        }
      }  else { 
        setMissedData(true)
        setTimeout(() => { 
          setMissedData(false)
        }, 1500)
      } 
    }

   const cancelShift = () => { 
    onClose()
    setActivities([])
   }




  return (
    <>
    <div onClick={() => onOpen()} className="h-96 w-96 ">
        <Card className=" cursor-pointer">
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
    </div>
     
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Turno</ModalHeader>
              <ModalBody>
                <Input type="time" variant="underlined" label="Horario de entrada" id="horaEntrada" name="horaEntrada" onChange={(e) => setStartTime(e.target.value)}/>
                <Input type="time" variant="underlined" label="Horario de salida" id="horaSalida" name="horaSalida" className="mt-2" onChange={(e) => setClosingHour(e.target.value)}/>
                

                {showFirstData && !showSecondData ? 
                <div className="mt-2 mb-2 flex flex-col items-center justify-center">
                   <p className="text-sm font-medium text-zinc-700"><b className="font-bold text-green-800">Tiempo del Turno:</b> {shiftHours} horas con {shiftMinutes} minutos</p>
                   <Button className="bg-green-800 text-white font-medium text-sm mt-2 w-full mb-2" onClick={() => continueToNext()}>Continuar</Button>
                </div> : null}

                {showSecondData ? 
                <>
                    <div>
                      <Select variant="faded" label="Selecciona el Turno" className="max-w-full mt-2 border border-none" value={shiftChoosen}>          
                          {shiftsSchedules.map((shift) => (
                          <SelectItem key={shift.value} value={shift.label} textValue={shift.value} onClick={() => setShiftChoosen(shift.value)}>
                            {shift.label}
                          </SelectItem>
                              ))}
                      </Select>
                    </div>
                    <div>
                      <Select aria-label="Descripción del campo de selección" label="Nombre Empleado" value={employeeName}>
                        {employees.map((em) => (
                          <SelectItem key={em._id} value={em.name} onClick={(e) => employeerData(em._id, em.name)}>
                            {em.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div> 
                    <div>
                      <div className="flex justify-center items-center gap-2">
                     
                      <Select variant={"faded"} label="Elegi una actividad" className="max-w-full mt-3">          
                                {activitiesAvailables.map((act) => (
                                <SelectItem key={act.label} value={act.label}  onClick={() => addNewActivitie(act.label)}>
                                {act.label}
                                </SelectItem>))}
                        </Select>               
                      </div>

                      {activities.length > 0 ? 
                        <div className="flex flex-col items-start justify-start text-start mt-2">
                            {activities.map((act) => ( 
                              <div className="flex  items-center justify-between w-full mt-1">
 
                                   <div className="flex text-start items-start justify-start">
                                      <p className="text-xs text-zinc-600 font-medium">{act}</p>
                                   </div>
                                   <div className="flex text-end items-end justify-end">
                                      <p className="text-xs text-zinc-600 font-medium"  onClick={() => handleRemoveProduct(act)}>x</p>
                                   </div>
                              
           
                                               
                              </div>
                            ))}
                        </div> : null}
                 
                    </div>
                      <Textarea
                        isRequired
                        label="Observaciones"
                        labelPlacement="outside"
                        placeholder="Puedes dejar una observacion"
                        className="max-w-xs mt-2"
                        variant="bordered"
                        onChange={(e) => setObservations(e.target.value)}
                      />


                    <ModalFooter className="flex gap-4 items-center justify-center">
                        <Button className="bg-green-800 font-medium text-sm w-52 text-white" onPress={createShift}>
                          Crear Turno
                        </Button>
                        <Button className="bg-green-800 font-medium text-sm w-52 text-white" onPress={cancelShift}>
                          Cancelar
                        </Button>
                    </ModalFooter>

                    {succesMessage ? 
                      <div className="flex items-center justify-center mt-4 mb-2">
                          <p className="text-green-800 font-medium text-sm">El turno se creo correctamente ✔</p>
                      </div> : null}

                      {missedData ? 
                      <div className="flex items-center justify-center mt-4 mb-2">
                          <p className="text-green-800 font-medium text-sm">Debes completar todos los campos</p>
                      </div> : null}

                </>
                : null}

              </ModalBody>

        

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateNewShift
