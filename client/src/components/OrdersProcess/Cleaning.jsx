import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'
import CleaningDetailList from './CleaningDetailList'

const Cleaning = () => {

    const [productsQuantityToWash, setProductsQuantityToWash] = useState([])

    

    const unifiedArticlesByQuantity = async () => { 
      try {
        const getOrders = await  axios.get("http://localhost:4000/orders")
        const rersponse = getOrders.data
        if(rersponse.length > 0) { 
          const filteredOrders = rersponse.filter((d) => d.orderStatus  === "Lavado")
          const getOrdersDetail = filteredOrders.map((ord) => ord.orderDetail).flat()
          const agroupArticlesByName = getOrdersDetail.reduce((acc, el) => { 
            const articleName = el.productName
            if(acc[articleName]) { 
              acc[articleName].push({quantity: el.quantity, productId: el.productId});
            } else { 
              acc[articleName] = [{quantity: el.quantity, productId: el.productId}];
            }
          return acc
          }, {})
          const transformDataInArray = Object.entries(agroupArticlesByName).map(([productName, items]) => {
            const quantityToWash = items.reduce((acc, item) => acc + item.quantity, 0);
            const productId = items[0].productId;
            return {
               productName: productName,
               quantityToWash: quantityToWash,
               productId: productId
            };
           });
          console.log(transformDataInArray)
          setProductsQuantityToWash(transformDataInArray)
        } else { 
          console.log("No hay ordenes")
        }
      } catch (error) {
        console.log(error)

      }
    }


    useEffect(() => { 
        unifiedArticlesByQuantity()
    }, [])

  return (
    <div>
         <NavBarComponent/>
         <CleaningDetailList washData={productsQuantityToWash}/>
    </div>
  )
}

export default Cleaning