import React from 'react'
import NavBarComponent from '../components/Navbar/Navbar'
import SubletsTable from '../components/Sublets/SubletsTable'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Sublets = () => {

    const [subletsData, setSubletsData] = useState([])

    const getSublets = async () => { 
        try {
            const response = await axios.get("http://localhost:4000/sublets")
            const data = response.data
            setSubletsData(data)
            console.log("Subalquileres:", data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
        getSublets()
    }, [])


  return (
    <div>
      <NavBarComponent/>
      <SubletsTable sublets={subletsData} update={getSublets}/>
    </div>
  )
}

export default Sublets
