import React from 'react'
import { Input, Select, SelectItem } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import axios from 'axios'
import { formateInputPrice } from '../../functions/gralFunctions'
import { productCategorys } from '../../functions/gralFunctions'
import PercentageArticlePrice from './PercentageArticlePrice'

const EditArticle = ({articleData, closeModalNow, updateChanges}) => {

    const [newProductName, setNewProductName] = useState(articleData.productName)
    const [newProductClientsValue, setNewProductClientsValue] = useState(articleData.clientsValue)
    const [newProductBonusClientsValue, setNewProductBonusClientsValue] = useState(articleData.bonusClientsValue)
    const [newProductReplacementValue, setNewProductReplacementValue] = useState(articleData.replacementValue)
    const [newProductCategoryValue, setNewProductCategoryValue] = useState(articleData.categoryValue)
    const [newProductStockValue, setNewProductStockValue] = useState(articleData.stock)
    const [succesChangesArticle, setSuccesChangesArticle] = useState(false)

    const changeProductData = () => { 
        const newProductData = ({ 
          articulo: newProductName,
          precioUnitarioAlquiler: newProductClientsValue,
          precioUnitarioAlquilerBonificados: newProductBonusClientsValue,
          precioUnitarioReposicion: newProductReplacementValue,
          categoria: newProductCategoryValue,
          stock: newProductStockValue
        })
        axios.put(`http://localhost:4000/products/changeData/${articleData.id}`, newProductData)
             .then((res) => { 
              console.log(res.data)
              setSuccesChangesArticle(true)
              updateChanges()
              setTimeout(() => { 
                setSuccesChangesArticle(false)
                closeModalNow()
              }, 1500)
             })
             .catch((err) => { 
              console.log(err)
             })
      }

      const updatePrice = (item) => { 
        console.log("Recibi el porcentaje de", item)
        const newClientPrice = newProductClientsValue * (1 + item / 100);
        const newBonusClientPrice = newProductBonusClientsValue * (1 + item / 100);
        const newReplacementPrice = newProductReplacementValue * (1 + item / 100);
        setNewProductClientsValue(newClientPrice);
        setNewProductBonusClientsValue(newBonusClientPrice)
        setNewProductReplacementValue(newReplacementPrice)
        console.log(newClientPrice)
        console.log(newBonusClientPrice)
        console.log(newReplacementPrice)
     }
  return (
    <div>
          <div className="flex flex-col items-center justify-center">
                    <PercentageArticlePrice updatePrice={updatePrice}/>
                    <Input type="text" className="mt-4 w-60" label="Articulo" value={newProductName} onChange={(e) => setNewProductName(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Precio Clientes" value={formateInputPrice(newProductClientsValue)} onChange={(e) => setNewProductClientsValue(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Precio Clientes Bonificados" value={formateInputPrice(newProductBonusClientsValue)} onChange={(e) => setNewProductBonusClientsValue(e.target.value)}/>
                    <Input type="text" className="mt-2 w-60" label="Precio Reposicion" value={formateInputPrice(newProductReplacementValue)} onChange={(e) => setNewProductReplacementValue(e.target.value)}/>
                    <Input type="number" className="mt-2 w-60" label="Stock Actual" value={newProductStockValue} onChange={(e) => setNewProductStockValue(e.target.value)}/>
                    <Select label="Categoria" variant="underlined" className="w-60 mt-2" >
                    {productCategorys.map((prod) => (
                        <SelectItem key={prod.value} value={prod.value} onClick={() => setNewProductCategoryValue(prod.value)}>
                          {prod.value}
                         </SelectItem>
                          ))}
                    </Select>  
                    <div className="flex items-center justify-center gap-4 mt-4 mb-4">
                      <Button className="font-bold text-white bg-green-800 text-sm w-52" onClick={() => changeProductData()}>Confirmar Cambios</Button>
                      <Button className="font-bold text-white bg-green-600 text-sm w-52" onPress={closeModalNow}>Cancelar</Button>
                    </div>
                   {succesChangesArticle ?
                    <div className="flex items-center justify-center mb-2 mt-2">
                        <p className="font-bold text-green-800 text-sm">Cambios almacenados con Exito ✔</p>
                    </div> : null}
                </div>
    </div>
  )
}

export default EditArticle
