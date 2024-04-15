import React, { createContext, useState, useEffect } from 'react';

const ClosureFiltersContext = createContext({
    allExpenses: [],
    updateAllExpenses: () => {},
    purchases: [],
    updatePurchases: () => {},
    sublets: [],
    updateSublets: () => {},
    fixedExpenses: [],
    updateFixedExpenses: () => {},
    paidsOrder: [],
    updatePaidsOrder: () => {},
    noPaidsOrder: [],
    updateNoPaidsOrder: () => {},
    allOrders: [],
    updateAllOrders: () => {},
    shiftsData: [],
    updateShiftsData: () => {},
   });

 const ClosureFiltersProvider = ({ children }) => {
    
    const [allExpenses, setAllExpenses] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [sublets, setSublets] = useState([]);
    const [fixedExpenses, setFixedExpenses] = useState([]);
    const [paidsOrder, setPaidsOrder] = useState([]);
    const [noPaidsOrder, setNoPaidsOrder] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [shiftsData, setShiftsData] = useState([]);
   
    const [userId, setUserId] = useState(() => {          
        const storedUserId = sessionStorage.getItem('userId');
         return storedUserId !== null ? storedUserId : null;    
       });
    
    
      const [userName, setUserName] = useState(() => { 
        const storedUserName= sessionStorage.getItem("userName")
        return storedUserName!== null ? storedUserName: null;
      })
    
    
      const [userEmail, setUserEmail] = useState(() => { 
        const storedUserEmail = sessionStorage.getItem("userEmail")
        return storedUserEmail !== null ? storedUserEmail : null
      })
    
      const [userRol, setUserRol] = useState(() => { 
        const storedUserRol = sessionStorage.getItem("userRol")
        return storedUserRol !== null ? storedUserRol : null
      })
    
    
      const updateUser = (id) => {                   
          setUserId(id)
          sessionStorage.setItem('userId', id);     
      };
    
      const updateUserName = (name) => { 
        setUserName(name)
        sessionStorage.setItem("userName", name)
      }
    
    
      const updateUserEmail = (x) => { 
        setUserEmail(x)
        sessionStorage.setItem("userEmail", x)
      }
    
      const updateUserRol = (x) => { 
        setUserRol(x)
        sessionStorage.setItem("userRol", x)
      }
    
   
    return (
       <ClosureFiltersContext.Provider value={{
         allExpenses,
         updateAllExpenses: setAllExpenses,
         purchases,
         updatePurchases: setPurchases,
         sublets,
         updateSublets: setSublets,
         fixedExpenses,
         updateFixedExpenses: setFixedExpenses,
         paidsOrder,
         updatePaidsOrder: setPaidsOrder,
         noPaidsOrder,
         updateNoPaidsOrder: setNoPaidsOrder,
         allOrders,
         updateAllOrders: setAllOrders,
         shiftsData,
         updateShiftsData: setShiftsData,
       }}>
         {children}
       </ClosureFiltersContext.Provider>
    );
   };

export { ClosureFiltersContext, ClosureFiltersProvider };
