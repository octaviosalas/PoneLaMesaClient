import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '@nextui-org/react'
import {useNavigate} from "react-router-dom"


const DeleteExpense = ({expenseData, closeModalNow, updateExpenseList}) => {

    const navigate = useNavigate()
    const [succesDeleted, setSuccesDeleted] = useState(false)

    const deleteFixedExpense = async () => { 
      try {
         const deleteExpense = await axios.delete(`http://localhost:4000/expenses/${expenseData.id}`)
         if(deleteExpense.status === 200) { 
          console.log("succes")
          setSuccesDeleted(true)
          updateExpenseList()
          setTimeout(() => { 
            closeModalNow()
            console.log("succes settimeouit")
            setSuccesDeleted(false)
          }, 1800)
         }
      } catch (error) {
        console.log(error)
      }
    }
     
  



  return (
    <div>
           <div className="flex flex-col items-center justify-center">
                  <div className='flex flex-col items-center justify-center'>
                    {expenseData.typeOfExpense === "Compra" ?
                     <p className="flex flex-col mt-2 font-medium text-black  text-md">Dirigite hacia el modulo de inversiones, para podes eliminarla</p> 
                     : null}  

                   {expenseData.typeOfExpense === "Sub Alquiler" ?
                     <p className="flex flex-col mt-2 font-medium text-black  text-md">Dirigite hacia el modulo de Sub Alquileres, para poder eliminarla</p> 
                     : null}  

                      {expenseData.typeOfExpense === "Gasto Fijo" ?
                        <div className='flex flex-col items-center justify-center'>
                           <p className="flex flex-col mt-2 font-medium text-black  text-md">¿Estas seguro de eliminar el Gasto?</p> 
                           <div className='mt-4 mb-2 flex items-center gap-4'>
                              <Button className='bg-green-800 text-white font-medium w-52' onClick={() => deleteFixedExpense()}>Eliminar</Button>
                              <Button className='bg-green-800 text-white font-medium w-52'>Cancelar</Button>
                           </div>
                        </div>
                     : null}  
                  </div>

                  {expenseData.typeOfExpense === "Compra" ? 
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm w-52 font-medium text-white bg-green-800" onClick={() => navigate("/compras")}> Ir a Inversiones </Button> 
                     <Button className="text-sm w-52 font-medium text-white bg-green-800"  onPress={closeModalNow}> Cancelar </Button>
                  </div>  
                  : null}

           {expenseData.typeOfExpense === "Sub Alquiler" ? 
                  <div className="flex items-center gap-6 mt-4 mb-4">
                     <Button className="text-sm w-52 font-medium text-white bg-green-800" onClick={() => navigate("/subalquileres")}> Ir a Sub Alquileres </Button> 
                     <Button className="text-sm w-52 font-medium text-white bg-green-800"  onPress={closeModalNow}> Cancelar </Button>
                  </div>  
                  : null}


                  {succesDeleted ? <p className='font-medium text-sm text-green-800 mt-4 mb-2'>Gasto eliminado correctamente</p> : null}
                 
               </div>
    </div>
  )
}

export default DeleteExpense
