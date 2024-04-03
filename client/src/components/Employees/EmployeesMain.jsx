import React from 'react'
import NavBarComponent from '../Navbar/Navbar'
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";
import CreateNewShift from './CreateNewShift';
import ViewEmployees from './ViewEmployees';
import CreateNewEmployee from './CreateNewEmployee';
import EmployeesData from './EmployeesData';


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

   console.log(obtenerHoraArgentina())
   
   console.log(obtenerHoraArgentina());
  
  return (
    <div>
      <NavBarComponent/> 
        <div className='flex items-center gap-4'>
           <CreateNewShift/>
           <ViewEmployees/>
           <CreateNewEmployee/>
        </div>
  
    </div>
  )
}

export default EmployeesMain
