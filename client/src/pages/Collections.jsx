import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import NavBarComponent from "../components/Navbar/Navbar"
import CollectionsTable from '../components/Collections/CollectionsTable'

const Collections = () => {

    const [collectionsData, setCollectionsData] = useState([])

    const getCollections = async () => { 
        try {
            const response = await axios.get("http://localhost:4000/collections")
            const data = response.data
            setCollectionsData(data)
            console.log("Cobros:", data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
        getCollections()
    }, [])

  return (
    <div>
        <NavBarComponent/>
        <CollectionsTable collections={collectionsData}/>
    </div>
  )
}

export default Collections
