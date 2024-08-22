import React from 'react'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'

const Confirmed = () => {

  return (
    <div>
        <NavBarComponent/>
        <ProcessTables orderStatus="Confirmado"/>
    </div>
  )
}

export default Confirmed