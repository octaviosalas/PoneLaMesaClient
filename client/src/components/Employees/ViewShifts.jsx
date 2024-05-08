import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Input} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import { convertTo12HourFormat } from "../../functions/gralFunctions";
import { useNavigate } from "react-router-dom";

const ViewShifts = () => {
 
  const navigate = useNavigate()

  const goTo = () => { 
    navigate("/Empleados/Turnos")
  }

  return (
    <div onClick={() => goTo()}>
       <Card className="w-72 h-72 2xl:w-96 2xl:h-96 cursor-pointer">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-black uppercase font-bold">Ver Turnos Realizados</p>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src="https://cdn-icons-png.flaticon.com/512/3588/3588248.png"
            />
        </Card>
    </div>
  )
}

export default ViewShifts
