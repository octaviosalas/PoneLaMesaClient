import Sublets from "../models/sublets.js";
import { incrementarStock, decrementarStock } from "./orders.controllers.js";

export const createSublet = async (req, res) => { 
    console.log(req.body)
   try {
    const newSubletToBeSaved = new Sublets(req.body)
    const newSaved = await newSubletToBeSaved.save()
    await incrementarStock(req.body.productsDetail);
    res.status(200).json(newSaved)
   } catch (error) {
    res.status(500).json({ error: 'Error al crear subAlquiler' });
    console.log(error)
   }
}

export const getEverySublets = async (req, res) => { 
    try {
        const allSublets = await Sublets.find()
        res.status(200).json(allSublets);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los subAlquileres' });
        console.log(error)
      }
}

export const getSubletById = async (req, res) => { 
    try {
        const subletSearched = await Sublets.findById(req.params.id);
        if (!subletSearched) {
          return res.status(404).json({ message: 'SubAlquiler no encontrado' });
        }
        res.status(200).json(subletSearched);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el SubAlquiler' });
      }
}

export const updateSubletData = async (req, res) => { 
  
}

export const updateSubletState = async (req, res) => { 
  const { subletId } = req.params;
  console.log(subletId)
  try {
    const subletUpdated = await Sublets.findByIdAndUpdate(
      { _id: subletId },
      { used: true },
      { new: true } 
  );
   if (!subletUpdated) {
    return res.status(404).json({ error: "No se encontró el Sub Alquiler" });
   }
   res.status(200).json(subletUpdated);  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error interno del servidor" });   
  }
}


export const deleteSublet = async (req, res) => { 
    const {subletId} = req.params
    console.log(req.body.subletProductsDetail)
    try {
      const deletedSublet = await Sublets.findByIdAndDelete({_id: subletId});
      if (deletedSublet) {
        await decrementarStock(req.body.subletProductsDetail); 
        res.status(200).json({ message: 'SubAlquiler eliminado correctamente', deleted: deletedSublet });
      } else {
        res.status(404).json({ message: 'SubAlquiler no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el SubAlquiler' });
    }
}