import React, { useEffect, useState } from 'react'
import {getMonthlyOrder, formatePrice, getMonthlyCollections} from "../../../functions/gralFunctions"
import { Card, List, ListItem, Title } from '@tremor/react';

const CollectionsGraphic = ({monthSelected, yearSelected}) => {

    const [totalAmountCollections, setTotalAmountCollections] = useState(0)
    const [withOutCollections, setWithOutCollections] = useState(false)
    const [collectionsAgroupByType, setCollectionsAgroupByType] = useState([])
    const [collectionsAgroupByAccounts, setCollectionsAgroupByAccounts] = useState([])


    const getData = async () => { 
        const yearFormated = Number(yearSelected)

        try {
            const collectionsData = await getMonthlyCollections(monthSelected, yearSelected)
            const getTotalAmount = collectionsData.reduce((acc, el) => acc + el.amount, 0)
            setTotalAmountCollections(formatePrice(getTotalAmount))
            const agroupCollectionsByType = collectionsData.reduce((acc, el) => { 
              const collectionType = el.collectionType
              if(acc[collectionType]) { 
                acc[collectionType].push(el)
              } else { 
                acc[collectionType] = [el]
              }
              return acc
            }, {})
            const transformTypes = Object.entries(agroupCollectionsByType).map(([collectionType, data]) => { 
              return { 
                collectionType: collectionType,
                quantityCollections: data.length,
                totalAmount: data.reduce((acc, el) => acc + el.amount, 0)
              }
            })
              console.log("POR TIPOS", transformTypes)
            const agroupCollectionsByAccount= collectionsData.reduce((acc, el) => { 
              const account = el.account
              if(acc[account]) { 
                acc[account].push(el)
              } else { 
                acc[account] = [el]
              }
              return acc
            }, {})
            const transformTypesAccounts = Object.entries(agroupCollectionsByAccount).map(([account, data]) => { 
              return { 
                account: account,
                totalAmount: data.reduce((acc, el) => acc + el.amount, 0),
                quantityCollections: data.length,
                replacementeCollections: data.filter((d) => d.collectionType === "Reposicion").length,
                ordersCollections: data.filter((d) => d.collectionType === "Alquiler").length,
                downPaymentCollections:  data.filter((d) => d.collectionType === "Seña").length
              }
            })
            console.log("POR CUENTAS", transformTypesAccounts)
            setCollectionsAgroupByAccounts(transformTypesAccounts)
              if(transformTypes.length > 0) { 
                setCollectionsAgroupByType(transformTypes)
                console.log(transformTypes)
                setWithOutCollections(false)
              } else { 
                setWithOutCollections(true)
              }
        } catch (error) {
            
        }
    }

    useEffect(() => { 
        getData()
    }, [])

  return (
    <div className='flex items-center gap-6'>
       <Card className="mx-auto  w-[400px] h-[200px] max-h-[200px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Cobros - Tipo de Cobros</h3>
               <p className='text-sm font-medium text-zinc-600'>Total: {totalAmountCollections}</p>
            </div>
              <List className="mt-2">
                  {collectionsAgroupByType.map((item, index) => (
                      <ListItem key={item.collectionType}>
                        <span>{item.collectionType}</span>
                        <span>{item.quantityCollections}</span>
                        <span>{formatePrice(item.totalAmount)}</span>
                      </ListItem>
                  ))}
                </List>
        </Card>

        <Card className="mx-auto  w-[800px] h-[200px] max-h-[200px] overflow-y-auto rounded-xl shadow-xl shadow-green-100">
            <div className='flex items-center justify-between'>
               <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Cobros - Cuentas</h3>
               <p className='text-sm font-medium text-zinc-600'>Total: {totalAmountCollections}</p>
            </div>

                  <div className='flex justify-center items-center mt-2 gap-24'>  
                      {collectionsAgroupByAccounts.map((item, index) => (                  
                          <div key={item.account} className='flex flex-col items-start justify-start'>
                              <span className="text-md font-medium text-green-800">{item.account}</span>
                              <span className="text-sm text-zinc-600"><span className='font-medium'>Cobros </span>: {item.quantityCollections}</span>
                              <span className="text-sm text-zinc-600"><span className='font-medium'>Señas  </span>: {item.downPaymentCollections}</span>
                              <span className="text-sm text-zinc-600"><span className='font-medium'>Alquileres </span>: {item.ordersCollections}</span>
                              <span className="text-sm text-zinc-600"><span className='font-medium'>Reposiciones </span>: {item.replacementeCollections}</span>
                              <span className="text-sm text-zinc-600"><span className='font-medium'>Total </span>: {formatePrice(item.totalAmount)}</span>
                          </div>                            
                      ))}
                 </div>
        
        </Card>

        

        
    </div>
  )
}

export default CollectionsGraphic
