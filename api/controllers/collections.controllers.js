import Collections from "../models/collections.js";
import Orders from "../models/orders.js";

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


export const deleteCollection = async (req, res) => { 
  const {collectionId} = req.params;
  console.log(req.body.orderId);
  console.log(collectionId);
  
  try {
      const firstDeleteCollection = await Collections.findByIdAndDelete(collectionId);
      const updateOrderPaidStatus = await Orders.findByIdAndUpdate(req.body.orderId, { 
        paid: false
      });
      res.status(200).json({ message: 'Cobro y Estados actualizados'});
  } catch (error) {
      // Manejar el error
      console.error(error);
  }
 };

