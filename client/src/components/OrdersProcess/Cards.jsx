import React from 'react'
import {Card, CardBody} from "@nextui-org/react";


const Cards = ({data}) => {
  return (
    <div>
        <Card>
           {data.map((d) => ( 
            <CardBody>
                <div className='flex flex-col items-center'>
                    <p>El pedido numero {d.orderNumber} esta en {d.orderStatus}</p>
                </div>
            </CardBody>
           )) 
         }
    </Card>
    </div>
  )
}

export default Cards
