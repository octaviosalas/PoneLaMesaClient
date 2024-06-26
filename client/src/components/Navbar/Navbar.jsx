import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, Dropdown, DropdownMenu, Avatar, DropdownTrigger, DropdownItem, Button} from "@nextui-org/react";
import {AcmeLogo} from "../../icons/AcmeLogo";
import {SearchIcon} from "../../icons/SearchIcon";
import { useNavigate } from 'react-router-dom'
import { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import logo from "../../images/logo.png"
import { UserContext } from '../../store/userContext'
import CreateNewOrder from "../Orders/CreateNewOrder"


const NavBarComponent = () =>  {

  const userCtx = useContext(UserContext)
  const navigate = useNavigate()

  const logOutSession = () => { 
    userCtx.updateUser("")
    userCtx.updateUserEmail("")
    userCtx.updateUserName("")
    userCtx.updateUserRol("")
    navigate("/")
  }

  const goTo = (ruta) => { 
    navigate(`/${ruta}`)
  }


  

  return (
    <div className="fixed z-50 top-0 left-0 right-0 inset-x-0  text-white h-16 w-full" style={{backgroundColor: "#8FD179"}} >
      <Navbar isBordered>
      <NavbarContent justify="start">
       
        <NavbarContent className="hidden md:flex">
          <div className="flex  gap-6">
          <NavbarItem onClick={() => goTo("Pedidos")} className="text-black font-medium cursor-pointer">
                Pedidos        
          </NavbarItem>
          <NavbarItem>
              <Dropdown>
                      <DropdownTrigger>
                        <p variant="bordered" className="hover:text-green-600 text-black font-medium cursor-pointer hover:font-medium"> Local </p>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem textValue="Create New Order" key="confirmed" onClick={() => goTo("AConfirmar")}>A Confirmar</DropdownItem>
                        <DropdownItem textValue="Create New Order" key="arm" onClick={() => goTo("Armado")}>En Armado</DropdownItem>
                        <DropdownItem textValue="Create New Order" key="returned" onClick={() => goTo("Lavado")}>En lavado</DropdownItem> 
                        <DropdownItem textValue="Create New Order" key="returned" onClick={() => goTo("Deposito")}>En Deposito</DropdownItem> 
                        <DropdownItem textValue="Create New Order" key="rep" onClick={() => goTo("EntregasLocal")}>Entregas</DropdownItem> 
                        <DropdownItem textValue="Create New Order" key="clean"  onClick={() => goTo("Devoluciones")}>Devoluciones</DropdownItem>                      
                        <DropdownItem textValue="Create New Order" key="clean"  onClick={() => goTo("ReposicionesPendientes")}>Reposiciones Pendientes</DropdownItem>     
                      </DropdownMenu>
                </Dropdown>
          </NavbarItem>
                
          <NavbarItem>
                 <Dropdown>
                      <DropdownTrigger>
                          <p variant="bordered" className="hover:text-green-600 text-black font-medium cursor-pointer hover:font-medium"> Articulos </p>
                      </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem key="arm" onClick={() => goTo("articulos")}>Stock</DropdownItem>
                          <DropdownItem key="ar" onClick={() => goTo("subalquileres")}>Sub Alquileres</DropdownItem>                          
                        </DropdownMenu>
                </Dropdown>
          </NavbarItem>
          <NavbarItem>
                 <Dropdown>
                      <DropdownTrigger>
                          <p variant="bordered" className="hover:text-green-600 text-black font-medium cursor-pointer hover:font-medium"> Proveedores </p>
                      </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem key="arm" onClick={() => goTo("proveedores")}>Ver Proveedores</DropdownItem>
                        </DropdownMenu>
                </Dropdown>
          </NavbarItem>
          <NavbarItem  onClick={() => goTo("clientes")}  className="text-black font-medium cursor-pointer">
                Clientes          
          </NavbarItem>      
          <NavbarItem>
          <Dropdown>
                      <DropdownTrigger>
                        <p variant="bordered" className="hover:text-green-600 text-black font-medium cursor-pointer hover:font-medium"> Finanzas </p>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="Cobros" onClick={() => goTo("Cobros")}>Cobros</DropdownItem>
                        <DropdownItem key="Compras" onClick={() => goTo("compras")}>Inversion</DropdownItem>
                        <DropdownItem key="Cierres" onClick={() => goTo("cierres")}>Cierres</DropdownItem>
                        <DropdownItem key="Cierres" onClick={() => goTo("gastos")}>Gastos</DropdownItem>                 
                      </DropdownMenu>
                </Dropdown>
          </NavbarItem>
          <NavbarItem onClick={() => goTo("Empleados")}  className="text-black font-medium cursor-pointer">
              
                Empleados
   
          </NavbarItem>
        
        
          </div>         
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
      
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
          <Avatar
              isBordered
              as="button"
              className="transition-transform"
              size="sm"
              src={logo}
              style={{
                width: '2rem',
                height: '2rem',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${logo})`,

              }}>
            </Avatar>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
          {userCtx.userEmail === null ?
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Sesion Iniciada en:</p>
              <p className="font-semibold">{userCtx.userEmail}</p>
            </DropdownItem>
             : 
            null
            }
            <DropdownItem key="settings" onClick={() => logOutSession()}>Cerrar Sesion</DropdownItem>
           
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
    </div>
  );
}

export default NavBarComponent




/* 
<NavbarContent className="hidden md:flex">
          <div className="flex  gap-6">
          <NavbarItem>
              <Link color="foreground" href="/articulos" className="hover:text-green-600 cursor-pointer hover:font-medium">
                Articulos
              </Link>
          </NavbarItem>
          <NavbarItem>
              <Dropdown>
                      <DropdownTrigger>
                        <p variant="bordered" className="hover:text-green-600 text-black font-medium cursor-pointer hover:font-medium"> Pedidos </p>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem  isReadOnly key="new"><CreateNewOrder/></DropdownItem>
                        <DropdownItem key="arm" onClick={() => goTo("Pedidos")}>Todos los Pedidos</DropdownItem>
                        <DropdownItem key="arm" onClick={() => goTo("Armado")}>En Armado</DropdownItem>
                        <DropdownItem key="rep" onClick={() => goTo("Reparto")}>En Reparto</DropdownItem>
                        <DropdownItem key="rep" onClick={() => goTo("RetiroEnLocal")}>Retiro en Local</DropdownItem>
                        <DropdownItem key="rep" onClick={() => goTo("Entregado")}>Entregados</DropdownItem>
                        <DropdownItem key="returned" onClick={() => goTo("Lavado")}>En lavado</DropdownItem>  
                        <DropdownItem key="clean"  onClick={() => goTo("Devueltos")}>Devueltos</DropdownItem>              
                        <DropdownItem key="edit" onClick={() => goTo("Reposiciones")}>Reposiciones</DropdownItem>     
                      </DropdownMenu>
                </Dropdown>
          </NavbarItem>
          <NavbarItem>
                <Dropdown>
                      <DropdownTrigger>
                          <p variant="bordered" className="hover:text-green-600 text-black font-medium cursor-pointer hover:font-medium"> Logistica </p>
                      </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem key="arm" onClick={() => goTo("Pedidos")}>Entregas</DropdownItem>
                          <DropdownItem key="arm" onClick={() => goTo("Armado")}>Devoluciones</DropdownItem>                          
                        </DropdownMenu>
                </Dropdown>
          </NavbarItem>
          <NavbarItem>
              <Link color="foreground" href="/devoluciones" className="hover:text-green-600 cursor-pointer hover:font-medium">
                Devoluciones
              </Link>
          </NavbarItem>
          <NavbarItem>
              <Link color="foreground" href="/compras" className="hover:text-green-600 cursor-pointer hover:font-medium">
                Compras
              </Link>
          </NavbarItem>
          <NavbarItem>
              <Link color="foreground" href="#" className="hover:text-green-600 cursor-pointer hover:font-medium">
                Cobros
              </Link>
          </NavbarItem>
          <NavbarItem>
          <Dropdown>
                      <DropdownTrigger>
                        <p variant="bordered" className="hover:text-green-600 text-black font-medium cursor-pointer hover:font-medium"> Estadisticas </p>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="Clientes" onClick={() => goTo("Estadisticas/Clientes")}>Clientes</DropdownItem>
                        <DropdownItem key="Articulos" onClick={() => goTo("Estadisticas/Articulos")}>Articulos</DropdownItem>
                        <DropdownItem key="Alquileres" onClick={() => goTo("Estadisticas/Alquileres")}>Alquileres</DropdownItem>
                        <DropdownItem key="Cobros" onClick={() => goTo("Estadisticas/Cobros")}>Cobros</DropdownItem>    
                        <DropdownItem key="Compras" onClick={() => goTo("Estadisticas/Compras")}>Compras</DropdownItem>    
                      </DropdownMenu>
                </Dropdown>
          </NavbarItem>
          <NavbarItem>
              <Link color="foreground" href="clientes" className="hover:text-green-600 cursor-pointer hover:font-medium">
                Clientes
              </Link>
          </NavbarItem>
        
          </div>         
        </NavbarContent>
      </NavbarContent>
*/