import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";


const ClosuresCards = () => {
  return (
    <div className='flex items-center gap-8'>
         <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <h4 className="text-black font-medium text-2xl">Cierre Filtrado</h4>
            </CardHeader>
          <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRlALvhd4Rgk_jkgJ8LGnfjBkXHyzvoVnAdtB9RSIeRF8aSwBxbzCuBTfT0O9PRNEwr0s&usqp=CAU"
          />
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
               <p className="text-black text-tiny">Reporte Filtrado.</p>
            </div>
            <Button className="text-tiny" color="primary" radius="full" size="sm">
             Abrir
            </Button>
          </CardFooter>
     </Card>

     <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <h4 className="text-black font-medium text-2xl">Cierre Mensual</h4>
            </CardHeader>
          <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src="https://www.gerencie.com/wp-content/uploads/asiente-cierre-contable.png"
          />
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-black text-tiny">Reporte Mensual.</p>
            </div>
            <Button className="text-tiny" color="primary" radius="full" size="sm">
             Abrir
            </Button>
          </CardFooter>
     </Card>
    </div>
  )
}

export default ClosuresCards
