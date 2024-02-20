import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'

const Armed = () => {

  return (
    <div>
        <NavBarComponent/>
        <ProcessTables orderStatus="Armado"/>
    </div>
  )
}

export default Armed