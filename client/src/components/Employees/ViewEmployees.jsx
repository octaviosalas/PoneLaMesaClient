import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Input} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import { convertTo12HourFormat } from "../../functions/gralFunctions";
import { useNavigate } from "react-router-dom";

const ViewEmployees = () => {
 
  const navigate = useNavigate()

  const goTo = () => { 
    navigate("/Empleados/ListadoDeEmpleados")
  }

  return (
    <div onClick={() => goTo()}>
          <Card className="w-[400px] h-52 2xl:w-[600px] 2xl:h-80 cursor-pointer">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-black uppercase font-bold">Ver Empleados</p>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover object-center"
              src="https://static.vecteezy.com/system/resources/previews/005/950/858/non_2x/employee-management-icon-editable-vector.jpg"
            />
        </Card>
    </div>
  )
}

export default ViewEmployees
