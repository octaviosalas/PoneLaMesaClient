import ProductsBonusClients from "../models/productsBonusClients.js";
import ProductsClients from "../models/productsClients.js"



export const productsClientsData = async (req, res) => { 
   try {
     const getData = await ProductsClients.find()
     res.status(200).json(getData)
   } catch (error) {
     res.statis(500).json({error: "Error al obtener productos"})
   }
}

export const productsBonusClientsData = async (req, res) => { 
    try {
        const getData = await ProductsBonusClients.find()
        res.status(200).json(getData)
      } catch (error) {
        res.statis(500).json({error: "Error al obtener productos"})
      }
}