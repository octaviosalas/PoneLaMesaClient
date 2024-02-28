import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'

const LocalPickup = () => {

  return (
    <div>
        <NavBarComponent/>
        <ProcessTables orderStatus="Retiro en Local"/>
    </div>
  )
}

export default LocalPickup