//sub alquileres realizados
//gastos 
//pedidos
/*
import React, {useState, useEffect} from 'react'
import { formatePrice, getMonth, getYear, getEveryPurchases, everyMonthsOfTheYear, everyYears } from '../../../functions/gralFunctions';

const MonthlyClousure = () => {
 
    const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
    const [allPurchases, setAllPurchases] = useState([])
    const [withOutPurchases, setWithOutPurchases] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const purchasesData = await getEveryPurchases();
            console.log(purchasesData)
              if(purchasesData.length !== 0) { 
                setAllPurchases(purchasesData);
                setWithOutPurchases(false)
              } else { 
                setWithOutPurchases(true)
              }
        
            
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };
        fetchData();
      }, []); 

    return (
    <div>
          
    </div>
  )
}

export default MonthlyClousure*/
