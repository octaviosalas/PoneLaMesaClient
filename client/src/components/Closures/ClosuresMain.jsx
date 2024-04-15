import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";
import NavBarComponent from '../Navbar/Navbar';
import ClousureMonth from './ClosuresCards';
import ChooseDateClousures from './ChooseDateClousure';



const ClosuresMain = () => {
  return (
    <div className='flex items-center'>
      <NavBarComponent/> 
      <div className='flex items-center gap-6'>
        <ClousureMonth/>
        <ChooseDateClousures/>
      </div>
    </div>
  )
}

export default ClosuresMain
