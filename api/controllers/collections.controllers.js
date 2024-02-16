import Collections from "../models/collections.js";

export const addNewCollection = async (req, res) => { 
   console.log(req.body)
   try {
    const newCollectionToBeSaved = new Collections(req.body);
    const collectionSaved = await newCollectionToBeSaved.save();
    res.status(201).json(collectionSaved);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cobro' });
    console.log(error)
  }
}