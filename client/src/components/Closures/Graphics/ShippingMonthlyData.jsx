import React, { useEffect, useState } from 'react'
import {getMonthlyOrder, formatePrice, getMonthlyCollections} from "../../../functions/gralFunctions"
import { Card, List, ListItem, Title } from '@tremor/react';


const ShippingMonthlyData = ({monthSelected, yearSelected, totalAmountCollections}) => {

    const [ordersWithShipping, setOrdersWithShipping] = useState([])
    const [everyOrdersWithShippingPaid, setEveryOrdersWithShippingPaid] = useState([])
    const [totalAmountFacturedInShipping, setTotalAmountFacturedInShipping] = useState(0)
    const [percentage, setPercentage] = useState(0)

    const getShippingData = async () => { 
        console.log("PROPPPPPPPPPPPPPPPPPPP", totalAmountCollections)
        const yearFormated = Number(yearSelected)
        try {
            const totalAmountCollectionPropData = await totalAmountCollections
            const collectionsData = await getMonthlyOrder(monthSelected)
            const data = collectionsData
            const filterOrders = data.filter((data) => data.year === yearFormated).filter((ord) => ord.hasOwnProperty("shippingCost"));
            const everyOrdersWithShippngValue = filterOrders
            const ordersWithShippingPaid = filterOrders.filter((ord) => ord.paid === true)
            setTotalAmountFacturedInShipping(ordersWithShippingPaid.reduce((acc, el) => acc + el.shippingCost, 0))
            setOrdersWithShipping(everyOrdersWithShippngValue)
            setEveryOrdersWithShippingPaid(ordersWithShippingPaid)
            console.log("Ordenes con shipping", everyOrdersWithShippngValue)
            console.log("Ordenes con shipping cobrado", ordersWithShippingPaid)
            setPercentage((ordersWithShippingPaid.reduce((acc, el) => acc + el.shippingCost, 0) / totalAmountCollectionPropData) * 100)

            console.log("CALCULO PORCENTAJE", (ordersWithShippingPaid.reduce((acc, el) => acc + el.shippingCost, 0) / totalAmountCollections) * 100)
            console.log("CALCULO PORCENTAJE VAR", ordersWithShippingPaid.reduce((acc, el) => acc + el.shippingCost, 0))
            console.log("CALCULO PORCENTAJE prop", totalAmountCollectionPropData)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
        getShippingData()
    }, [])

  return (
    <div>
         <Card className="mx-auto  w-[400px] h-[200px] max-h-[200px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Envios - Estadisticas</h3>
               <p className='text-sm font-medium text-zinc-600'>Total: {totalAmountCollections}</p>
            </div>
              <List className="mt-2">
                      <ListItem >
                        <span>Monto total cobrado en envios: {formatePrice(totalAmountFacturedInShipping)}</span>
                        <span>Cantidad de Alquileres con envio incluido: {ordersWithShipping.length}</span>
                        <span>Porcentaje de facturación representada por envíos: {percentage}%</span>
                      </ListItem>
                </List>
        </Card>
    </div>
  )
}

export default ShippingMonthlyData
