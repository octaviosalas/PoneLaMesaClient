import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavBarComponent from '../Navbar/Navbar'
import ProcessTables from './ProcessTables'

const ToBeConfirmed = () => {

  return (
    <div>
        <NavBarComponent/>
        <ProcessTables orderStatus="A Confirmar"/>
    </div>
  )
}

export default ToBeConfirmed