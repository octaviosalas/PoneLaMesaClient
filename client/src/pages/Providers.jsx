import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import NavBarComponent from "../components/Navbar/Navbar"
import ProviderTable from '../components/Providers/ProviderTable'


const Providers = () => {

    const [providersData, setProvidersData] = useState([])

    const getProvidersData = async () => { 
        try {
            const response = await axios.get("http://localhost:4000/providers")
            const data = response.data
            setProvidersData(data)
            console.log("Proveedores:", data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
        getProvidersData()
    }, [])

  return (
    <div>
        <NavBarComponent/>
        <ProviderTable updateProvidersList={getProvidersData} providers={providersData}/>
    </div>
  )
}

export default Providers
