import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../store/userContext'
import {Input, Button} from "@nextui-org/react";
import Loading from "../Loading/Loading"
import NavBarComponent from "../Navbar/Navbar"
import logo from "../../images/logo.png"

const Login = () => { 

    const navigate = useNavigate()
    const userCtx = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [succesMessagge, setSuccesMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [textMessage, setTextMessage] = useState(false)

    const loginMySession = () => { 
        if(email.length === 0 || password.length === 0) { 
          setErrorMessage(true)
          setTextMessage("Debes completar todos los campos")
          setTimeout(() => { 
            setErrorMessage(false)
            setEmail("")
            setPassword("")
          }, 2500)
        } else  { 
          const userData = ({ 
            email,
            password
          })
          axios.post("http://localhost:4000/users/login", userData)
               .then((res) => { 
                console.log(res.data)
                if(res.data.message === "El email no se encuentra registrado") { 
                  setErrorMessage(true)
                  setTextMessage("El email ingresado no es correcto")
                  setTimeout(() => { 
                    setErrorMessage(false)
                    setEmail("")
                    setPassword("")
                  }, 2500)
                } else if (res.data.message === "La contraseña es incorrecta") { 
                  setErrorMessage(true)
                  setTextMessage("La contraseña es incorrecta")
                  setTimeout(() => { 
                    setErrorMessage(false)
                    setEmail("")
                    setPassword("")
                  }, 2500)
                } else { 
                  setSuccesMessage(true);  
                    userCtx.updateUser(res.data.id);
                    userCtx.updateUserEmail(res.data.email);
                    userCtx.updateUserRol(res.data.rol);
                    userCtx.updateUserName(res.data.name);
                    setTimeout(() => {
                       navigate("/articulos")
                    }, 1800);
                }            
               })
               .catch((err) => { 
                console.log(err)
               })
        }
      } 
 


  return (

    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
      <NavBarComponent />              
         <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">  
                <div className=" flex text-center h-16 w-16 justify-center rounded-full" >
                    <img src={logo} className="h-12 w-12 m-2 rounded-full"/>
                </div>
                <div>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight " style={{color:"#89D56F"}}>INICIAR SESION</h2>
                </div>
         </div>

     <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">    
           <div>        
              <div className="mt-2">                   
                 <Input 
                  value={email}
                  label="Email"
                  variant="bordered" 
                  name="email" type="email"
                  autoComplete="email" 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="block w-full text-center rounded-md border-0  sm:text-sm sm:leading-6" 
                 />
              </div>
           </div>
          <div>
              
          <div className="mt-2">
              <Input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password" 
              name="password" 
              label="Contraseña"
              type="password" 
              autoComplete="current-password"          
              variant="bordered" 
              required 
              className="block w-full text-center rounded-md border-0  sm:text-sm sm:leading-6" 
             
              />
          </div>


              <div className="text-sm flex justify-end">
                <a href="#" className="text-black text-xs hover:text-gray-400 underline mt-2"> ¿Olvido su contraseña? </a>
              </div>

              <div className='mt-6'>                 
                  <Button style={{backgroundColor:"#89D56F"}} className='w-72 text-white font-medium' onClick={() => loginMySession()}>
                    INICIAR SESION
                  </Button> 
              </div>
  
      <div className='mt-6'>
      
           <Button style={{backgroundColor:"#73B65D"}} onClick={() => navigate("/register")}  className="w-72 text-white font-medium">
               REGISTRARME
            </Button> 

            {errorMessage ? <p className='mt-8 w-72 font-bold text-xs' style={{color:"#73B65D"}} >{textMessage}</p> : null}

            {succesMessagge ? 
            <div className='flex items-center justify-center mt-6'>
              <Loading />
            </div> 
            : null}
       
      </div>
      </div>

     


    </div>
    </div>  
    </>
  
  )
}

export default Login