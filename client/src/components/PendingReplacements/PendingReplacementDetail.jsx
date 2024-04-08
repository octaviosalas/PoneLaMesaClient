import React, {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { formatePrice } from "../../functions/gralFunctions";
import MarkDebtAsPaid from "../Modals/MarkDebtAsPaid";

const PendingReplacementDetail = ({data, updateList}) => { 

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [size, setSize] = useState("2xl")

  return (
    <>
      <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={onOpen}>Detalle</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reposicion Pendiente de Cobro
                <div>
                    <p className="text-zinc-600 text-sm font-medium">Cliente: {data.clientData.name}</p>
                    <p className="text-zinc-600 text-sm font-medium">Deuda: {formatePrice(data.amountToPay)}</p>
                    <p className="text-zinc-600 text-sm font-medium">Orden Correspondiente: Numero {data.orderCompletedData.map((ord) => ord.orderNumber)[0]} del mes de {data.orderCompletedData.map((ord) => ord.month)[0]} del {data.orderCompletedData.map((ord) => ord.year)[0]}</p>
                </div>
                </ModalHeader>
              <ModalBody>
                  <div className="flex flex-col items-start justify-start">
                    <div className="flex justify-start items-start text-start">
                        <h5 className="font-medium text-sm text-green-800">Articulos a Reponer:</h5>
                    </div>
                    <div>
                       {data.detail.map((d => ( 
                        <div className="flex flex-col items-start justify-start text-start mt-3" key={d.debtId}>
                            <p className="text-sm font-medium text-zinc-600">Articulo: {d.productName}</p>
                            <p className="text-sm font-medium text-zinc-600">Cantidad a Reponer: {d.missing}</p>
                            <p className="text-sm font-medium text-zinc-600">Costo Unitario Reposicion: {formatePrice(d.replacementPrice)}</p>
                        </div>
                       )))}
                    </div>
                  </div>
              </ModalBody>
                <ModalFooter className="flex items-center justify-center gap-6">
                <MarkDebtAsPaid type={"pendingReplacements"} debtId={data.debtId} debtAmount={data.amountToPay} completeDebtData={data} clientData={data.clientData} updateClientData={updateList} closeModal={onClose}/>
                <Button className="bg-green-800 text-white font-medium text-sm w-56" onPress={onClose}>
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

export default PendingReplacementDetail


