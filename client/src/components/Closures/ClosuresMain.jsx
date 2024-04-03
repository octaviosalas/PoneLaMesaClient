import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";
import NavBarComponent from '../Navbar/Navbar';
import ClousureMonth from './ClosuresCards';



const ClosuresMain = () => {
  return (
    <div className='flex items-center'>
      <NavBarComponent/>
      <ClousureMonth/>
    </div>
  )
}

export default ClosuresMain
