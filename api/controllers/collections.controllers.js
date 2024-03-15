import Collections from "../models/collections.js";

export const addNewCollection = async (req, res) => { 
   console.log(req.body)
   try {
    const newCollectionToBeSaved = new Collections(req.body);
    const collectionSaved = await newCollectionToBeSaved.save();
    res.status(200).json(collectionSaved);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cobro' });
    console.log(error)
  }
}

export const getAllCollections = async (req, res) => { 
  try {
    const allCollections = await Collections.find()
    res.status(200).json(allCollections);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cobro' });
    console.log(error)
  }
}

export const getCollectionByOrderId = async (req, res) => { 
  const {orderId} = req.params
  console.log(req.params)
  try {
    const collectionSearched = await Collections.findOne({orderId: orderId})
    if (!collectionSearched) {
      return res.status(404).json({ error: 'No se encontró el cobro de la orden.' });
    }
    res.status(200).json(collectionSearched);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cobro' });
    console.log(error)
  }
}