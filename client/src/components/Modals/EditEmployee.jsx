import React, {useState, useEffect} from 'react'
import { Input, Button, Select, SelectItem } from '@nextui-org/react'
import axios from "axios"


const EditEmployee = ({data, update, closeModalNow}) => {

    const [newEmployeeName, setNewEmployeeName] = useState(data.name)
    const [newEmployeeDni, setNewEmployeeDni] = useState(data.dni)
    const [newEmployeeHourAmount, setNewEmployeeHourAmount] = useState(data.hourAmount)
    const [succesChanges, setSuccesChanges] = useState(false)
    const [numberError, setNumberError] = useState(false)

    const changeEmployeeData = async  () => { 
        if(numberError !== true) { 
            const newData = ({ 
                name: newEmployeeName,
                dni: newEmployeeDni,
                hourAmount: newEmployeeHourAmount,
            })
            try {
                const changeData = await axios.put(`http://localhost:4000/employees/changeData/${data.id}`, newData)
                console.log(changeData.data)
                if(changeData.status === 200) { 
                    setSuccesChanges(true)
                    update()
                    setTimeout(() => { 
                        setSuccesChanges(false)
                        closeModalNow()
                    }, 2000)
                }
            } catch (error) {
                
            }
        }
      
       
    }

  return (
    <div>
            <div className="flex flex-col items-center justify-center">
              <Input type="text"   variant="underlined" className="mt-2 w-60" label="Cliente" value={newEmployeeName} onChange={(e) => setNewEmployeeName(e.target.value)}/>
              <Input type="text"   variant="underlined" className="mt-2 w-60" label="Telefono" value={newEmployeeDni} onChange={(e) => setNewEmployeeDni(e.target.value)}/>
              <Input 
                type="number" 
                variant="underlined" 
                value={newEmployeeHourAmount}
                label="Valor Hora" 
                id="hourAmount" 
                name="hourAmount" 
                className="mt-2 w-60"   
                onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (value > 0 && !isNaN(value))) {
                              setNewEmployeeHourAmount(parseInt(e.target.value, 10));
                              setNumberError(false)
                            } else {
                              setNumberError(true)
                            }
                        }} />
                        
              {numberError ? <p className="text-xs font-medium text-zinc-600">El numero debe ser mayor a 0 </p> : null}        

              <div className="flex items-center justify-center gap-4 mt-4 mb-4">
                <Button className="font-bold text-white bg-green-800 text-sm w-52" onClick={() => changeEmployeeData()}>Confirmar Cambios</Button>
                <Button className="font-bold text-white bg-green-600 text-sm w-52" onPress={closeModalNow}>Cancelar</Button>
              </div>
             {succesChanges ?
              <div className="flex items-center justify-center mb-2 mt-2">
                  <p className="font-bold text-green-800 text-sm">Cambios almacenados con Exito ✔</p>
              </div> : null}
          </div>
    </div>
  )
}

export default EditEmployee
