import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios"


/* 
import useGetBackendQueries from "../Hooks/useGetBackendQueries";
 const { data, loading } = useGetBackendQueries(`getOtherUsersPublications`);
*/

const GetBackendData = (route, item) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noPublications, setNoPublications] = useState(false)

  useEffect(() => { 
     axios.get(`https://app-citizens.onrender.com/${route}`)
          .then((res) => { 
            if(res.data.length > 0) { 
              setData(res.data)
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

    
  return {data, loading, noPublications}
}

export default GetBackendData;