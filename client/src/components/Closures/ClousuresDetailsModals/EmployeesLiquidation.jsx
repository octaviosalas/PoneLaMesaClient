import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { formatePrice } from "../../../functions/gralFunctions";


const EmployeesLiquidation = ({empployeesData, first, second}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [columns, setColumns] = useState([]);
  const [size, setSize] = useState("4xl")

  
  useEffect(() => {
    if (empployeesData &&  Array.isArray(empployeesData) && empployeesData.length > 0) {
      const firstDetail = empployeesData[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== 'employeeId');
  
      const columnLabelsMap = {
        employeeName: 'Empleado',
        quantityShifts: 'Turnos',
        totalAmountToPaid: 'Total Gastado',
        totalHours: 'Horas Trabajadas',
      };
  
      const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
      }));
  
      setColumns(tableColumns);
    }
  }, [empployeesData]);

 
  

  return (
    <>
      <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={onOpen}>Ver Detalle</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
             <ModalHeader className="flex flex-col gap-1">Empleados desde el {first} al {second}</ModalHeader> 
              <ModalBody className="flex items-center justify-center">
                  <Table aria-label="Example table with dynamic content" className="w-[600px] 2xl:w-[750px] flex items-center justify-center mt-2 max-h-[400px] overflow-y-auto">
                                  <TableHeader columns={columns}>
                                    {(column) => (
                                      <TableColumn key={column.key} className="text-xs gap-6">
                                        {column.label}
                                      </TableColumn>
                                    )}
                                  </TableHeader>
                                  <TableBody items={empployeesData}>
                                  {(item) => (
                                    <TableRow key={item.employeeId}>
                                      {columns.map(column => (
                                      <TableCell key={column.key} className='text-left'>
                                      {column.cellRenderer ? (
                                        column.cellRenderer({ row: { original: item } })
                                      ) : (
                                        column.key === "totalAmountToPaid" || column.key === "value" ? (
                                          formatePrice(item[column.key])
                                        ) : (
                                          item[column.key]
                                        )
                                      )}
                                    </TableCell>
                                      ))}
                                    </TableRow>
                                  )}
                          </TableBody>
                    </Table>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button className="text-white font-medium bg-green-800 w-72" onPress={onClose}>
                  Cerrar
                </Button>
                
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default EmployeesLiquidation

