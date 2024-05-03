import React, { useEffect, useState } from 'react'
import {getMonthlyOrder, formatePrice} from "../../../functions/gralFunctions"
import { Card, List, ListItem, Title } from '@tremor/react';
import OrdersByClientGraphic from '../ClousuresDetailsModals/OrdersByClientGraphic';

const OrdersListGraphic = ({yearSelected, monthSelected}) => {

    const [allOrders, setAllOrders] = useState([])
    const [withOutOrders, setWithOutOrders] = useState(false)
    const [ordersQuantity, setOrdersQuantity] = useState(0)
    const [totalAmountOrders, setTotalAmountOrders] = useState(0)
    const [ordersPaid, setOrdersPaid] = useState([])
    const [ordersWithOutPaid, setOrdersWithOutPaid] = useState([])
    const [totalAmountOrdersPaid, setTotalAmountOrdersPaid] = useState(0)
    const [totalAmountOrdersWithOutPaid, setTotalAmountOrdersWithOutPaid] = useState(0)

    const getData = async () => { 
      const yearFormated = Number(yearSelected)
      console.log(yearFormated)
        try {
            const orders = await getMonthlyOrder(monthSelected); 
            const ordersData = orders.filter((ord) => ord.year === yearFormated)
            console.log("Todas las ordenes el mes", ordersData)
            setAllOrders(ordersData)
            const getOrdersWithPaid = ordersData.filter((ord) => ord.paid === true)
            console.log("ordenes pagadas", getOrdersWithPaid)
            const getOrdersWithOutPaid = ordersData.filter((ord) => ord.paid === false)
            console.log("ordenes sin pagar", getOrdersWithOutPaid)
            if(ordersData.length === 0) { 
              setWithOutOrders(true)
            }  else { 
              setOrdersQuantity(ordersData.length)
              console.log("cantidad de ordenes", ordersData.length)
              const getTotalAmountOrders = ordersData.reduce((acc, el) => acc + el.total, 0)
              console.log("monto total ordenes", getTotalAmountOrders)
              const getTotalAmountOrdersWithPaid = getOrdersWithPaid.reduce((acc, el) => acc + el.total, 0)
              console.log("monto total ordenes pagadas", getTotalAmountOrders)
              const getTotalAmountOrdersWithOutPaid = getOrdersWithOutPaid.reduce((acc, el) => acc + el.total, 0) 
              console.log("monto total ordenes sin pagar", getTotalAmountOrdersWithOutPaid)           
              setTotalAmountOrders(getTotalAmountOrders)
              setOrdersPaid(getOrdersWithPaid)
              setOrdersWithOutPaid(getOrdersWithOutPaid)
              setTotalAmountOrdersPaid(getTotalAmountOrdersWithPaid)
              setTotalAmountOrdersWithOutPaid(getTotalAmountOrdersWithOutPaid)
            }    

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
      getData()
    }, [])


  return (
    <div className='flex items-center gap-4'>
        <Card className="mx-auto  w-[600px] h-[350px] max-h-[350px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='flex justify-end items-center'>
                <OrdersByClientGraphic ordersData={allOrders}/>
            </div>
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium text-lg">Alquileres Mes</h3>
               <p className='text-md font-medium text-zinc-600'>Total: {formatePrice(totalAmountOrders)}</p>
            </div>
              <List className="mt-2">
                  {allOrders.map((item, index) => (
                      <ListItem key={item._id}>
                        <span>{index + 1}</span>
                        <span>{item.client}</span>
                        <span>{formatePrice(item.total)}</span>
                      </ListItem>
                  ))}
                </List>
        </Card>

        <Card className="mx-auto  w-[600px] h-[350px] max-h-[350px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium text-lg">Alquileres Cobrados</h3>
               <p className='text-md font-medium text-zinc-600'>Total: {formatePrice(totalAmountOrdersPaid)}</p>
            </div>
              <List className="mt-2">
                  {ordersPaid.map((item, index) => (
                      <ListItem key={item._id}>
                        <span>{index + 1}</span>
                        <span>{item.client}</span>
                        <span>{formatePrice(item.total)}</span>
                      </ListItem>
                  ))}
                </List>
        </Card>

        <Card className="mx-auto  w-[600px] h-[350px] max-h-[350px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong text-lg dark:text-dark-tremor-content-strong font-medium">Alquileres Sin Cobrar</h3>
               <p className='text-md font-medium text-zinc-600'>Total: {formatePrice(totalAmountOrdersWithOutPaid)}</p>
            </div>
              <List className="mt-2">
                  {ordersWithOutPaid.map((item, index) => (
                      <ListItem key={item._id}>
                        <span>{index + 1}</span>
                        <span>{item.client}</span>
                        <span>{formatePrice(item.total)}</span>
                      </ListItem>
                  ))}
                </List>
        </Card>
      </div>
  )
}

export default OrdersListGraphic
