import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '@nextui-org/react'


const DeleteEmployee = ({employeeData, closeModalNow, updateEmployee}) => {

    const [messageSucces, setMessageSucces] = useState(false)


    const deleteEmployee = () => { 
        axios.delete(`http://localhost:4000/employees/deleteEmployee/${employeeData.id}`)
             .then((res) => { 
              console.log(res.data)
              updateEmployee()
              setMessageSucces(true)
              setTimeout(() => { 
                closeModalNow()
                setMessageSucces(false)
              }, 2000)
             })
             .catch((err) => { 
              console.log(err)
             })
      }


  return (
    <div>
       <div className="flex flex-col items-center justify-center">
                  <div>
                     <p className="flex flex-col gap-1 text-zinc-600 font-medium text-md">¿Estas seguro de eliminar a {employeeData.name}?</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm font-medium text-white bg-green-800 w-52" onClick={() => deleteEmployee()}>Eliminar</Button>
                     <Button className="text-sm font-medium text-white bg-green-800 w-52" onPress={closeModalNow}>Cancelar</Button>
                  </div>
                 {messageSucces ?
                  <div className="flex items-center mt-4 mb-2">
                     <p className="text-green-800 text-sm font-medium">Empleado Eliminado Correctamente ✔</p>
                  </div>
                  : null}
               </div>
    </div>
  )
}

export default DeleteEmployee
