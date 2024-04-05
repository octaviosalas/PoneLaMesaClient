import React from 'react'
import NavBarComponent from '../Navbar/Navbar'
import {Card, CardHeader, CardBody, CardFooter, Image, Button, User} from "@nextui-org/react";
import CreateNewShift from './CreateNewShift';
import ViewEmployees from './ViewEmployees';
import CreateNewEmployee from './CreateNewEmployee';
import { useContext } from 'react';
import { UserContext } from '../../store/userContext';

const EmployeesMain = () => {
  
  function obtenerHoraArgentina() {
    const ahora = new Date();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12;
    minutos = minutos < 10 ? '0' + minutos : minutos;
    return `${horas}:${minutos} ${ampm}`;
   }

   const userCtx = useContext(UserContext)

   console.log(obtenerHoraArgentina())
   
   console.log(obtenerHoraArgentina());
  
  return (
    <div>
      <NavBarComponent/> 
        <div className='flex items-center gap-4'>
          {userCtx.userRol === "Dueño" ?
          <>
            <CreateNewShift/>
            <ViewEmployees/>
            <CreateNewEmployee/>
          </>
          :
          <div className="flex flex-col items-center mt-24">
             <p className='text-green-800 font-medium text-md'>No tenes acceso a esta seccion</p>
          </div>
          }
        </div>
  
    </div>
  )
}

export default EmployeesMain
