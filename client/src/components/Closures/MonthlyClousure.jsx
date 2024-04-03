import React, {useState, useEffect} from 'react'
import {everyMonthsOfTheYear, everyYears, getMonth, getEveryPurchases } from '../../functions/gralFunctions';
import { useParams } from 'react-router-dom';
import NavBarComponent from '../Navbar/Navbar';

const MonthlyClousure = () => {
 
    const [everyMonths, setEveryMonths] = useState(everyMonthsOfTheYear)
    const [allPurchases, setAllPurchases] = useState([])
    const [withOutPurchases, setWithOutPurchases] = useState(false)
    const [actualMonth, setActualMonth] = useState(getMonth())
    const { year, month } = useParams();


    useEffect(() => {
      const yearFormated = Number(year)
      console.log(typeof yearFormated)
      console.log(yearFormated)
        const fetchData = async () => {
          try {
            const purchasesData = await getEveryPurchases();
            console.log(purchasesData)
            const filterDataByMonth = purchasesData.filter((purch) => purch.month === month && purch.year === yearFormated)
            setAllPurchases(filterDataByMonth)     
            console.log("compras del mes", filterDataByMonth)       
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };
        fetchData();
      }, []); 

    return (
    <div>
      <NavBarComponent/>
          {year}
          {month}
          {typeof year}
          {typeof month}
    </div>
  )
}

export default MonthlyClousure
