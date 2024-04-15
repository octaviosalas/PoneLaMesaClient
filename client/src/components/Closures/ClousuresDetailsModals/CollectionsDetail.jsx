import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { formatePrice } from "../../../functions/gralFunctions";
import ByAccountFilteredCollectionsTable from "./Collections/ByAccountFilteredCollectionsTable";
import ByTypeFilteredCollectionsTable from "./Collections/ByTypeFilteredCollectionsTable";
import AllCollectionsFilteredTable from "./Collections/AllCollectionsFilteredTable";

const CollectionsDetail = ({byAccount, byType, allCollections, first, second}) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [columns, setColumns] = useState([]);
    const [size, setSize] = useState("4xl")
    const [viewAll, setViewAll] = useState(false)
    const [viewByAccounts, setViewByAccounts] = useState(false)
    const [viewByType, setViewByType] = useState(false)

    const viewByTypeCollections = () => { 
        setViewByType(true)
        setViewByAccounts(false)
        setViewAll(false)
    }

    const viewByAccountCollections = () => { 
        setViewByType(false)
        setViewByAccounts(true)
        setViewAll(false)
    }

    const viewAllCollections = () => { 
        setViewByType(false)
        setViewByAccounts(false)
        setViewAll(true)
    }


  return (
    <div>
       <p className="text-sm font-medium text-green-800 cursor-pointer" onClick={onOpen}>Ver Detalle</p>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
                <ModalContent>
                {(onClose) => (
                    <>
                  <ModalHeader className="flex flex-col gap-1">Cobros Filtrados del {first} al {second}</ModalHeader>                                               
                    <ModalBody className="flex items-center justify-center">
                         <div className="w-full bg-green-800 text-white font-medium text-md h-8 flex items-center text-center" onClick={() => viewAllCollections()}>
                             <p className="ml-2">Ver todos los cobros</p>
                         </div>
                         <div className="w-full bg-green-800 text-white font-medium text-md h-8 flex items-center text-center" onClick={() => viewByAccountCollections()}>
                             <p className="ml-2">Ver cobros en Cuentas</p>
                         </div>
                         <div className="w-full bg-green-800 text-white font-medium text-md h-8 flex items-center text-center"  onClick={() => viewByTypeCollections()}>
                             <p className="ml-2">Ver cobros por tipo</p>
                         </div>                      
                    </ModalBody>

                     {viewByAccounts ? 
                         <div className="flex items-center justify-center mt-2 mb-6">
                            <ByAccountFilteredCollectionsTable byAccountCollectionsData={byAccount} first={first} second={second}/>
                         </div> : null}

                       {viewByType ? 
                          <div className="flex items-center justify-center mt-2 mb-6">
                                <ByTypeFilteredCollectionsTable byTypeCollections={byType} first={first} second={second}/>
                          </div> : null}

                        {viewAll ? 
                          <div className="flex items-center justify-center mt-2 mb-6">
                                <AllCollectionsFilteredTable everyCollections={allCollections} first={first} second={second}/>
                          </div> : null}
                   
                    </>
                )}
                </ModalContent>
            </Modal>
    </div>
  )
}

export default CollectionsDetail
