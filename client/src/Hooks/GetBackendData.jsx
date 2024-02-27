import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios"


/* 
import useGetBackendQueries from "../Hooks/useGetBackendQueries";
 const { queryData, loading } = useGetBackendQueries(`getOtherUsersPublications`);
*/

const getBackendData = (route, item) => {

  const [queryData, setQueryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noPublications, setNoPublications] = useState(false)

  useEffect(() => { 
     axios.get(`http://localhost:4000/${route}`)
          .then((res) => { 
            if(res.data.length > 0) { 
              setQueryData(res.data)
              setTimeout(() => { 
                  setLoading(false) 
              }, 1500)          
            } else { 
              setNoPublications(true)
            }
           
          })
          .catch((err) => { 
            if(err)  { 
              console.log(err)      
            }
           
          })
  }, [route])

    
  return {queryData, loading, noPublications}
}

export default getBackendData;