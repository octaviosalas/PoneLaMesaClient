import React from 'react'
import NavBarComponent from "../components/Navbar/Navbar"
import ClientsTable from '../components/Clientes/ClientsTable'

const Clients = () => {
  return (
    <div>
      <NavBarComponent/>
      <ClientsTable/>
    </div>
  )
}

export default Clients
