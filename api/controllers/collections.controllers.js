import Collections from "../models/collections.js";
import Orders from "../models/orders.js";
import Clients from "../models/clients.js";
import DownPayments from "../models/downPayment.js"

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
      console.error(error);
  }
 };

 export const deleteCollectionReplacement = async (req, res) => { 
  const {collectionId} = req.params;
  console.log(req.params);
  console.log(req.body.paymentReferenceId);
  console.log(req.body.clientName);
 
  try {
     const firstDeleteCollectionReplacement = await Collections.findByIdAndDelete({_id: collectionId});
     const secondUpdateDebtClient = await Clients.find({name: req.body.clientName});
     console.log("Encontre al cliente", secondUpdateDebtClient);
 
     const client = secondUpdateDebtClient[0]; 
 
     await Clients.updateOne(
       { _id: client._id },
       { $set: { "clientDebt.$[debt].paid": false } },
       { arrayFilters: [{ "debt.debtId": req.body.paymentReferenceId }] }
     );
     res.status(200).json({ message: 'Reposicion eliminada'});

  } catch (error) {
     console.log(error);
  }
 };


 export const updateCollectionAmount = async (req, res) => { 
  const {collectionId} = req.params;
  console.log(req.body.amount);

  try {
     const findCollection = await Collections.findByIdAndUpdate(
       {_id: collectionId},
       { $set: { amount: req.body.amount } },
       { new: true } 
     );     
     res.status(200).json({ message: 'Datos del cobro actualizados', findCollection});
  } catch (error) {
     console.error("Error updating collection:", error);
  }
 };

 
 export const updateCollectionDownPaymentAmount = async (req, res) => { 
  const {collectionId} = req.params;
  console.log("collectionId", collectionId);
  console.log("nuevo monto", req.body.amount);
  console.log("orderId", req.body.orderId);
  
  try {
      const [findCollection, findDownPayment] = await Promise.all([
        Collections.findByIdAndUpdate(
          {_id: collectionId},
          { $set: { amount: req.body.amount } },
          { new: true } 
        ),
        DownPayments.findOneAndUpdate(
          {orderId: req.body.orderId},
          { $set: { amount: req.body.amount } },
          { new: true } 
        ),     
      ]);
 
      const findOrder = await Orders.findOneAndUpdate(
        { _id: req.body.orderId },
        { $set: { "downPaymentData.0.amount": req.body.amount } },
        { new: true }
       );
  
      res.status(200).json({ message: 'Datos del cobro actualizados', findCollection, findDownPayment, findOrder });
  } catch (error) {
      console.error("Error updating collection or order:", error);
  }
 };



 export const updateCollectionReplacementAmount = async (req, res) => { 
  const {collectionId} = req.params;
  console.log("collectionId", collectionId);
  console.log("nuevo monto", req.body.amount);
  console.log("orderId", req.body.orderId);
  console.log("client", req.body.clientName);
  console.log("referencia reposicion", req.body.paymentReferenceId);
   
  try {
     const findCollection = await Collections.findByIdAndUpdate(
       {_id: collectionId},
       { $set: { amount: req.body.amount } },
       { new: true } 
     );   
     
     const findClient = await Clients.findOne({name: req.body.clientName});
     
     if (!findClient) {
       return res.status(404).json({ message: 'Client not found' });
     }
 
     const findClientUpdated = await Clients.findOneAndUpdate(
       { _id: findClient._id },
       { $set: { "clientDebt.$[element].amountToPay": req.body.amount } },
       { 
         new: true,
         arrayFilters: [{ "element.debtId": req.body.paymentReferenceId }]
       }
     );
 
     if (!findClientUpdated) {
       return res.status(404).json({ message: 'Client debt not found or updated' });
     }
 
     res.status(200).json({ message: 'Client debt updated successfully', findClientUpdated });
  } catch (error) {
     console.error("Error updating collection or client debt:", error);
     res.status(500).json({ message: 'Internal server error' });
  }
 };