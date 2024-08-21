import  { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";

const ShowParcialPayment = ({orderData}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [totalParcialAmount, setTotalParcialAmount] = useState(0)

    const handleOpen = () => { 
        console.log(orderData)
        onOpen()
        const getTotal = orderData.parcialPayment.reduce((acc, el) => acc + el.amount, 0)
        setTotalParcialAmount(getTotal)
    }

    

    

  return (
    <>
     <div>
        <p className="text-white bg-orange-500 font-medium text-md mt-2 cursor-pointer" onClick={handleOpen}>
         {orderData.parcialPayment.length > 1 ? 
          `Este pedido tiene ${orderData.parcialPayment.length} pagos parciales` : `Este pedido tiene ${orderData.parcialPayment.length} pago parcial`
         } 
        </p>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Informacion de pagos Parciales</ModalHeader>
              <ModalBody>
                  <div className="overflow-y-auto max-h-[250px] ">
                      {orderData.parcialPayment.map((ord) => ( 
                          <div key={ord.id}> 
                                <div className="flex flex-col items-start justify-starty mt-2 shadow-lg py-3 px-3">
                                    <p className="font-medium text-zinc-600"><b className="font-medium text-green-800"> Cuenta:</b> {ord.account}</p>
                                    <p className="font-medium text-zinc-600"><b className="font-medium text-green-800"> Monto:</b> {formatePrice(ord.amount)}</p>
                                    <p className="font-medium text-zinc-600"><b className="font-medium text-green-800"> Fecha del cobro:</b> {ord.date}</p>
                                </div>
                           </div>
                      ))}
                    
                  </div>
                    <div>
                        <p className="bg-red-600 text-white font-medium">El monto restante es: {formatePrice(orderData.total - totalParcialAmount)}</p>
                    </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                    <Button className="font-medium text-white w-48 bg-green-800" onPress={onClose}>
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

export default ShowParcialPayment


/* 
import { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

const ShowParcialPayment = ({orderData}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [totalParcialAmount, setTotalParcialAmount] = useState(0)
    const [columns, setColumns] = useState([]);

    const handleOpen = () => { 
        console.log(orderData)
        onOpen()
        const getTotal = orderData.parcialPayment.reduce((acc, el) => acc + el.amount, 0)
        setTotalParcialAmount(getTotal)
        createTableForPartialPayments()
    }

    const createTableForPartialPayments = (orderData) => {
        console.log("PARCIAL PAYMENTS", orderData.parcialPayment);
      
        if (orderData && orderData.parcialPayment && Array.isArray(orderData.parcialPayment) && orderData.parcialPayment.length > 0) {
          const firstPayment = orderData.parcialPayment[0];
          const properties = Object.keys(firstPayment);
      
          // Definir las propiedades que queremos mostrar en la tabla
          const columnLabelsMap = {
            amount: 'Monto',
            account: 'Cuenta',
            day: 'Día',
            month: 'Mes',
            year: 'Año',
            date: 'Fecha'
          };
      
          const tableColumns = properties.map(property => ({
            key: property,
            label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
          }));
      
          setColumns(tableColumns);
        }
      

  return (
    <>
      <p className="text-white bg-orange-500 font-medium text-md mt-2 cursor-pointer" onClick={handleOpen}>
         Este pedido tiene {orderData.parcialPayment.length} pago parcial
      </p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Informacion de pagos Parciales</ModalHeader>
              <ModalBody>
                  <div>
                      {orderData.parcialPayment.map((ord) => ( 
                        <> 
                           <div className="flex flex-col items-start justify-starty">
                               <p className="font-medium text-zinc-600"><b className="font-medium text-green-800"> Cuenta:</b>{ord.account}</p>
                               <p className="font-medium text-zinc-600"><b className="font-medium text-green-800"> Monto:</b> {formatePrice(ord.amount)}</p>
                               <p className="font-medium text-zinc-600"><b className="font-medium text-green-800"> Fecha del cobro:</b>  {ord.date}</p>
                           </div>
                            <div>
                                <p className="bg-red-600 text-white">El monto restante es: {formatePrice(orderData.total - totalParcialAmount)}</p>
                            </div>
                           </>
                      ))}

<Table aria-label="Tabla de pagos parciales" className="w-full shadow-xl flex items-center justify-center mt-2 max-h-[200px] 2xl:max-h-[350px] overflow-y-auto">
  <TableHeader columns={columns} className="">
    {(column) => (
      <TableColumn key={column.key} className="text-xs gap-6">
        {column.label}
      </TableColumn>
    )}
  </TableHeader>
  <TableBody items={orderData.parcialPayment}>
    {(item) => (
      <TableRow key={item.date}>
        {columns.map(column => (
          <TableCell key={column.key} className="text-start items-start">
            {column.cellRenderer ? (
              column.cellRenderer({ row: { original: item } })
            ) : (
              column.key === "amount" ? (
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
                  </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                    <Button className="font-medium text-white w-48 bg-green-800" onPress={onClose}>
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
}

export default ShowParcialPayment


*/