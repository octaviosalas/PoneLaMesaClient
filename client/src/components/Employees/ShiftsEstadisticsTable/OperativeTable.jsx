import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import {Card} from "@tremor/react"



const OperativeTable = ({operativeData}) => {

  const createOperativeTable = (operativeData) => { 
    console.log("OPERATIVE DATA TABLA", operativeData)
     const properties = Object.keys(operativeData[0]);
     console.log("Propiedad", properties)
     if(operativeData.length > 0 ) { 
      const firstDetail = operativeData[0];
      const properties = Object.keys(firstDetail);
      const filteredProperties = properties.filter(property => property !== 'id' && property !== 'tiempoIdeal' && property !== 'porcentajeDelArticuloLavadoEnBaseAlTotal');
    
      const columnLabelsMap = {
        turno: 'Turno',
        cantidadTotalLavada: 'Articulos Lavados',
        horasTotalDelTurno: 'Tiempo Realizado',
        tiempoIdealTotal: 'Tiempo ideal',
      };
    
      const tableColumns = filteredProperties.map(property => ({
        key: property,
        label: columnLabelsMap[property] ? columnLabelsMap[property] : property.charAt(0).toUpperCase() + property.slice(1),
      }));
    
      setOperativeColumns(tableColumns);
      console.log(tableColumns);
      setShowOperativeTable(true)  
     } else { 
      console.log("First table length 0!")
     }
  }


  return (
    <div>
      
    </div>
  )
}

export default OperativeTable
