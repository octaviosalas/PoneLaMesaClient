import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";


const LiteralTable = ({columns, list}) => {

    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    console.log(columns)
   
    return (
      <div> 

          <Table 
          columnAutoWidth={true} 
          columnSpacing={10}  
          aria-label="Selection behavior table example with dynamic content"   
          selectionMode="multiple" 
          selectionBehavior={selectionBehavior} 
          className="w-full lg:w-[800px] xl:w-[1200px] 2xl:w-[1400px] h-auto text-center shadow-left-right"
          >
          <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                        key={column.key}
                        className="text-center"
                     
                        >
                        {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
       </Table> 
      </div>
    )
}

export default LiteralTable
