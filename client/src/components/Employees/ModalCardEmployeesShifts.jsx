import React, {useState} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

const ModalCardEmployeesShifts = ({data}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [columns, setColumns] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");


    const handleOpen = () => { 
        console.log(data)
        onOpen()
        createTable(data)
    }

    const createTable = (data) => { 
       const employees = data.map((data) => data.empleados).flat()
       console.log(employees)
       const properties = Object.keys(employees[0]);
       console.log("Propiedad", properties)
       if(employees.length > 0 ) { 
        console.log(employees)
        const firstDetail = employees[0];
        const properties = Object.keys(firstDetail);
        const filteredProperties = properties.filter(property => property !== 'amountHour' && property !== 'totalAmount' );
      
        const columnLabelsMap = {
          name: 'Nombre',
          workedHours: 'Horas Trabajadas',
         
        };
      
        const tableColumns = filteredProperties.map(property => ({
          key: property,
          label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
        }));
   
        setColumns(tableColumns);
        setShowTable(true)  
       } else { 
        console.log("First table length 0!")
       }
        
    }



  return (
    <div>
        <p className='text-xs text-green-800 font-medium cursor-pointer' onClick={handleOpen}>Ver Empleados</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Empleados turno {data.map((d) => d.turno)[0]}</ModalHeader>
              <ModalBody>
                  <Table                          
                        columnAutoWidth={true} 
                        columnSpacing={10}  
                        aria-label="Selection behavior table example with dynamic content"   
                        selectionBehavior={selectionBehavior} 
                        className="w-full flex items-center justify-center shadow-2xl overflow-y-auto xl:max-h-[350px] 2xl:max-h-[450px]  border rounded-xl">
                            <TableHeader columns={columns}>
                      {(column) => (
                      <TableColumn key={column.key} className="text-xs gap-6">
                        {column.label}
                      </TableColumn>
                          )}
                      </TableHeader>
                        <TableBody items={data.map((data) => data.empleados).flat()}>
                                      {(item) => (
                        <TableRow key={item.name}>
                            {columns.map(column => (
                            <TableCell key={column.key}  className='text-left' >
                                {column.cellRenderer ? (
                                column.cellRenderer({ row: { original: item } })
                                ) : (
                                (column.key === "costoLavadoArticulo") ? (
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
              <ModalFooter className='flex items-center justify-enter mt-2'>
                <Button className='bg-green-800 text-white font-medium cursor-pointer w-96' onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ModalCardEmployeesShifts
