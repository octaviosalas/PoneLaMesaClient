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
       <Card className="w-96 h-96 cursor-pointer">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-black uppercase font-bold">Ver Empleados</p>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src="https://img.freepik.com/vector-premium/trabajo-equipo-personajes-negocios-comunicacion-trabajo-equipo-dibujos-animados-empleados-corporativos-personas-oficina-ilustracion-equipo-negocios_176516-369.jpg"
            />
        </Card>
    </div>
  )
}

export default ViewEmployees
