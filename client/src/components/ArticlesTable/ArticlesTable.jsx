import React from 'react'
import {Table,TableHeader,TableColumn,TableBody,TableRow,TableCell, Button, Input} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { useRef } from "react";
import { getProductsClients, getProductsBonusClients } from '../../functions/gralFunctions';
import { formatePrice } from '../../functions/gralFunctions';
import DeleteOrder from '../Modals/DeleteOrder';
import EditModal from '../Modals/EditModal';
import Loading from "../Loading/Loading"
import HistoricArticles from './HistoricArticles';
import IncreasePriceWithPercentage from '../Modals/IncreasePriceWithPercentage';
import CreateNewArticle from './CreateNewArticle';
import getBackendData from '../../Hooks/GetBackendData';
import CreateSublet from './CreateSublet';

const ArticlesTable = ({}) => {

    const tableRef = useRef(null);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
    const [inputValue, setInputValue] = useState("")
    const { queryData } = getBackendData(`products/productsClients`);
    const [waitingData, setWaitingData] = useState(false)


    const getProductsDataAndCreateTable =  () => { 
      axios.get("http://localhost:4000/products/productsClients")
           .then((res) => { 
            const allProducts = res.data
            console.log(allProducts.filter((prod) => prod.articulo === "Plato playo"))
            console.log(allProducts)
            setData(allProducts)
            if(allProducts.length !== 0) { 
              console.log(data)
              const propiedades = Object.keys(res.data[0]).filter(propiedad =>  propiedad !== '_id' &&  propiedad !== '__v');
              const columnObjects = propiedades.map(propiedad => ({
                  key: propiedad,
                  label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                  allowsSorting: true
            }));
    
            const modifiedColumnObjects = columnObjects.map(column => {
              if (column.key === 'precioUnitarioAlquiler') {
                  return { ...column, label: 'Precio Alquiler' };
              } else if (column.key === 'precioUnitarioReposicion') {
                  return { ...column, label: 'Precio Reposición' };
              } else if (column.key === 'precioUnitarioBonificados') {
                return { ...column, label: 'Precio Bonificados' };
            }   
              else if (column.key === 'precioUnitarioAlquilerBonificados') {
                return { ...column, label: 'Precio Bonificados' };
            } else {
                  return column;
              }
            });
    
           
            modifiedColumnObjects.push({
                key: 'Editar',
                label: 'Editar',
                cellRenderer: (cell) => { 
    
                    const filaActual = cell.row;
                    const id = filaActual.original._id;
                    const articleName = filaActual.original.articulo;
                    const clientsValue = filaActual.original.precioUnitarioAlquiler;
                    const bonusClientsValue = filaActual.original.precioUnitarioBonificados;
                    const replacementValue = filaActual.original.precioUnitarioReposicion;    
                    const item = {
                    id: id,
                    productName: articleName,
                    clientsValue: clientsValue,
                    bonusClientsValue: bonusClientsValue,
                    replacementValue: replacementValue                
                    };
                    return (
                      <EditModal type="product" articleData={item} updateChanges={getProductsDataAndCreateTable}/>
                    );
                },
            })      
            
            modifiedColumnObjects.push({
              key: 'Eliminar',
              label: 'Eliminar',
              cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const id = filaActual.original._id;
                const item = {
                id: id
                };
                return (
                   <DeleteOrder type="product" updateListArticles={getProductsDataAndCreateTable} productData={item}/>
                  );
            },
           }) 
    
           modifiedColumnObjects.push({
            key: 'Historico',
            label: 'Historico',
            cellRenderer: (cell) => { 
              const filaActual = cell.row;
              const id = filaActual.original._id;
              const articleName = filaActual.original.articulo;
              const item = {
              id: id,
              articleName: articleName
              };
              return (
                <HistoricArticles articleData={item}/>
                );
          },
         })  
            setColumns(modifiedColumnObjects);
            console.log(modifiedColumnObjects)
            if (tableRef.current) {
                tableRef.current.updateColumns(modifiedColumnObjects);
            }          
             } else { 
              console.log("vacio")
             }
           })
           .catch((err) => { 
            console.log(err)
           })
    }

    useEffect(() => { 
      getProductsDataAndCreateTable()
    }, [])

    const filteredData = data.filter((item) => {
      return Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(inputValue.toLowerCase())
      );
    });


    return (
      <div className='flex flex-col items-center justify-center'>
         {columns.length !== 0 && data.length !== 0?  
       <>
        <div className='flex flex-col items-center justify-start w-full rounded-t-lg rounded-b-none ' >
            <div className='h-12 items-center justify-between w-full flex bg-green-200  gap-10 rounded-t-lg rounded-b-none'>
              <div className='flex gap-5 items-center '>
                   <p className='font-medium text-black    text-md cursor-pointer ml-4' > Articulos Clientes </p>
              </div>
              <div className='flex gap-6 mr-2'>
                <CreateNewArticle updateList={getProductsDataAndCreateTable}/>
                <IncreasePriceWithPercentage  updateList={getProductsDataAndCreateTable}/>
                <CreateSublet articles={data}/>
              </div>
              
            </div>
            <div className='w-full flex jusitfy-start text-center mt-4 '>
              <input className="w-[50%] border border-gray-200  focus:border-gray-300 focus:ring-0 h-10 rounded-xl" 
                placeholder="Buscador"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue} />        
            </div>
        </div>
         <Table 
        columnAutoWidth={true} 
        columnSpacing={10}  
        aria-label="Selection behavior table example with dynamic content"   
        selectionBehavior={selectionBehavior} 
        className="w-full mt-2 lg:w-[800px] xl:w-[1200px] 2xl:w-[1300px] max-h-[350px] 2xl:max-h-[600px] h-auto text-center shadow-2xl shadow-top shadow-left-right overflow-y-auto"
        >
        <TableHeader columns={columns} >
                  {(column) => (
                      <TableColumn
                      key={column.key}
                      className="text-left"             
                      >
                      {column.label}
                      </TableColumn>
                  )}
         </TableHeader>
         <TableBody items={filteredData}>
                  {(item) => (
             <TableRow key={item._id}>
                      {columns.map((column) => (
                 <TableCell key={column.key} className="text-start items-start">
                 {column.cellRenderer ? (
                     column.cellRenderer({ row: { original: item } })
                   ) : (
                     (column.key === "precioUnitarioAlquiler" || 
                      column.key === "precioUnitarioReposicioon" || column.key === "precioUnitarioBonificados" ||  column.key === "precioUnitarioAlquilerBonificados" ) ? (
                         formatePrice(item[column.key])
                     ) : (
                       item[column.key]
                     )
                   )}
                 </TableCell>
                ))}
           </TableRow>
              )}
        </TableBody>
         </Table> 
       </>
        
     : 
        <div className='flex h-scren items-center justify-center mt-44'>
           <Loading/>
        </div> 
      }
      </div>
    )
    }

export default ArticlesTable



/* 
const getProductsDataAndCreateTable =  () => { 
        axios.get("http://localhost:4000/products/productsClients")
             .then((res) => { 
              const allProducts = res.data
              console.log(allProducts.filter((prod) => prod.articulo === "Plato playo"))
              console.log(allProducts)
              setData(allProducts)
              if(allProducts.length !== 0) { 
                console.log(data)
                const propiedades = Object.keys(res.data[0]).filter(propiedad =>  propiedad !== '_id' &&  propiedad !== '__v');
                const columnObjects = propiedades.map(propiedad => ({
                    key: propiedad,
                    label: propiedad.charAt(0).toUpperCase() + propiedad.slice(1),
                    allowsSorting: true
              }));
      
              const modifiedColumnObjects = columnObjects.map(column => {
                if (column.key === 'precioUnitarioAlquiler') {
                    return { ...column, label: 'Precio Alquiler' };
                } else if (column.key === 'precioUnitarioReposicion') {
                    return { ...column, label: 'Precio Reposición' };
                } else if (column.key === 'precioUnitarioBonificados') {
                  return { ...column, label: 'Precio Bonificados' };
              }   
                else if (column.key === 'precioUnitarioAlquilerBonificados') {
                  return { ...column, label: 'Precio Bonificados' };
              } else {
                    return column;
                }
              });
      
             
              modifiedColumnObjects.push({
                  key: 'Editar',
                  label: 'Editar',
                  cellRenderer: (cell) => { 
      
                      const filaActual = cell.row;
                      const id = filaActual.original._id;
                      const articleName = filaActual.original.articulo;
                      const clientsValue = filaActual.original.precioUnitarioAlquiler;
                      const bonusClientsValue = filaActual.original.precioUnitarioBonificados;
                      const replacementValue = filaActual.original.precioUnitarioReposicion;    
                      const item = {
                      id: id,
                      productName: articleName,
                      clientsValue: clientsValue,
                      bonusClientsValue: bonusClientsValue,
                      replacementValue: replacementValue                
                      };
                      return (
                        <EditModal type="product" articleData={item} updateChanges={getProductsDataAndCreateTable}/>
                      );
                  },
              })      
              
              modifiedColumnObjects.push({
                key: 'Eliminar',
                label: 'Eliminar',
                cellRenderer: (cell) => { 
                  const filaActual = cell.row;
                  const id = filaActual.original._id;
                  const item = {
                  id: id
                  };
                  return (
                     <DeleteOrder type="product" updateListArticles={getProductsDataAndCreateTable} productData={item}/>
                    );
              },
             }) 
      
             modifiedColumnObjects.push({
              key: 'Historico',
              label: 'Historico',
              cellRenderer: (cell) => { 
                const filaActual = cell.row;
                const id = filaActual.original._id;
                const articleName = filaActual.original.articulo;
                const item = {
                id: id,
                articleName: articleName
                };
                return (
                  <HistoricArticles articleData={item}/>
                  );
            },
           })  
              setColumns(modifiedColumnObjects);
              console.log(modifiedColumnObjects)
              if (tableRef.current) {
                  tableRef.current.updateColumns(modifiedColumnObjects);
              }          
               } else { 
                console.log("vacio")
               }
             })
             .catch((err) => { 
              console.log(err)
             })
      }

      useEffect(() => { 
        getProductsDataAndCreateTable()
      }, [])

      const filteredData = data.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(inputValue.toLowerCase())
        );
      });
*/