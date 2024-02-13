import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Input, Button, Select, SelectItem} from "@nextui-org/react";
//import Loading from './Loading'
import NavBarComponent from "../Navbar/Navbar"
import logo from "../../images/logo.png"


const rols = [
    {
        id: 1,
        rolName: "Empleado"
    },
    {
        id: 2,
        rolName: "Encargado"
    },
    {
        id: 3,
        rolName: "Dueño"
    },
]

const Register = () => {



    const [name, setName] = useState("")
    const [rol, setRol] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [showSuccesMessage, setShowSuccesMessage] = useState(false)
    const [showUserExist, setShowUserExist] = useState(false)
    const [showLoad, setShowLoad] = useState(false)

    const navigate = useNavigate()

    const registerNewUser = () => { 
        if(name.length !== 0 && email.length !== 0 && rol.length !== 0 && password.length !== 0) { 
            const newUser = ( { 
                name: name,
                email: email,
                rol: rol,
                password: password
              })
              axios.post("http://localhost:4000/users/createAccount", newUser)
                   .then((res) => { 
                      console.log(res.data)
                      if(res.data.message === "The email exist in our DataBase. Please, select other") { 
                        setShowUserExist(true)
                        setTimeout(() => { 
                            setShowUserExist(false)
                            setEmail("")
                            setName("")
                            setPassword("")
                            setRol("")
                        }, 1700)
                      } else { 
                        setShowSuccesMessage(true)
                        setTimeout(() => { 
                            navigate("/")
                        }, 1700)
                      }              
                   })
                   .catch((err) => { 
                      console.log(err)
                   })
        } else { 
            setShowErrorMessage(true)
            setTimeout(() => { 
                setShowErrorMessage(false)
                setEmail("")
                setName("")
                setPassword("")
                setRol("")
            }, 1700)
        }
      }

      const cancelAllData = () => { 
        setEmail("")
        setRol("")
        setPassword("")
        setName("")
      }

      useEffect(() => { 
       console.log(rol)
      }, [rol])


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
    <NavBarComponent />              
      <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">  
              <div className=" flex text-center h-16 w-16 justify-center rounded-full" >
                <img src={logo} className="h-12 w-12 m-2 rounded-full"/>
              </div>
              <div>
              {showErrorMessage ? 
                     <p className="mt-10 text-center text-md font-bold leading-9 tracking-tight " 
                        style={{color:"#89D56F"}}> 
                        Debes completar todos los datos
                     </p> 
                     :
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight " 
                     style={{color:"#89D56F"}}>
                         CREAR CUENTA
                    </h2> 
                }
              </div>
      </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">    
       <div>
           <div className="mt-2">                   
                 <Input  label="Nombre" variant="bordered" 
                  name="email" type="text"
                  autoComplete="Nombre" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="block w-full text-center rounded-md border-0  sm:text-sm sm:leading-6" 
                 />
              </div>
              <div className="mt-2">                   
                 <Input  label="Email" variant="bordered" 
                  name="email" type="email"
                  autoComplete="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="block w-full text-center rounded-md border-0  sm:text-sm sm:leading-6" 
                 />
              </div>
              <div className="mt-2">                   
              <Select
                    variant={"bordered"}
                    label="Rol"
                    onChange={(e) => setRol(e.target.value)}
                    value={rol}
                    placeholder="Selecciona un Rol"
                    className="max-w-xs"
                >
            {rols.map((rol) => (
              <SelectItem key={rol.rolName} value={rol.rolName}>
                {rol.rolName}
              </SelectItem>
            ))}
          </Select>
              </div>
          </div>

          <div>
              
          <div className="mt-2">
              <Input 
              onChange={(e) => setPassword(e.target.value)}
              id="password" 
              name="password" 
              label="Contraseña"
              type="password" 
              autoComplete="current-password"            
              variant="bordered" 
              required 
              value={password}
              className="block w-full text-center rounded-md border-0  sm:text-sm sm:leading-6" 
             
              />
          </div>

    
          
          <>
          {showSuccesMessage ? (
                <p className="mt-10 w-72 text-center text-md font-bold leading-9 tracking-tight" style={{ color: "#89D56F" }}>
                    La cuenta fue creada con éxito
                </p>
                ) : showUserExist ? (
                 <p className="mt-10 w-72 text-center text-md font-bold leading-9 tracking-tight" style={{ color: "#89D56F" }}>
                    El usuario ya existe
                </p>
                ) : showErrorMessage ? ( 
                    <p className="mt-10 w-72 text-center text-md font-bold leading-9 tracking-tight" style={{ color: "#89D56F" }}>
                      Debes completar todos los campos
                    </p>
                ) : (
                <>
                    <div className="mt-6">
                    <Button style={{ backgroundColor: "#89D56F" }} className="w-72 text-white font-medium" onClick={() => registerNewUser()}>
                        GUARDAR CUENTA
                    </Button>
                    </div>

                    <div className="mt-6">
                    <Button style={{ backgroundColor: "#73B65D" }} onClick={() => cancelAllData()} className="w-72 text-white font-medium">
                        CANCELAR
                    </Button>
                    </div>
                </>
                )}
          </>
         

      </div>

     


    </div>
    </div>  

  )
}

export default Register
