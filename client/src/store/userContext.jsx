import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext({ 
    userId: null,             
    updateUser: () => {},
    userName: null,
    updateUserName: () => {},
    userEmail: null,
    updateUserEmail: () => {},   
    userRol: null,
    updateUserRol: () => {}          
});


const UserProvider = ({ children }) => {                   

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



useEffect(() => {
    const handleStorageChange = (event) => {    
      if (event.key === 'userId') {            
        setUserId(event.newValue);
      } else if (event.key === 'userName') {            
        setUserName(event.newValue);
      } else if (event.key === "userEmail") { 
        setUserEmail(event.newValue)
      } else if (event.key === "userRol") { 
        setUserRol(event.newValue)
      }
    };
    window.addEventListener('storage', handleStorageChange); 
    return () => {
      window.removeEventListener('storage', handleStorageChange); 
    };
  }, []);

  return (
    <UserContext.Provider 
        value={{
          userId,
          updateUser, 
          userName, 
          updateUserName, 
          userEmail, 
          updateUserEmail, 
          userRol, 
          updateUserRol
        }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
