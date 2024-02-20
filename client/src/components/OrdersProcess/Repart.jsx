import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'

const Repart = () => {

  return (
    <div>
         <NavBarComponent/>
         <ProcessTables type="Reparto"/>
    </div>
  )
}

export default Repart