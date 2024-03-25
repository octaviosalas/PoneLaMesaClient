import Purchases from "../models/purchases.js";
import ProductsClients from "../models/productsClients.js";
import { incrementarStock, decrementarStock } from "./orders.controllers.js";



export const savePurchase = async (req, res) => {
    const { purchaseDetail, date, day, month, year, total, creatorPurchase } = req.body;
    console.log(req.body);
  
    try {
      const newPurchaseToBeSaved = new Purchases({
        date,
        day,
        month,
        year,
        total,
        purchaseDetail,
        creatorPurchase,
      });
  
      newPurchaseToBeSaved.save()
        .then((newPurchase) => {
          res.status(200).json({ message: "Compra guardada", newPurchase });
        })
        .catch((err) => {
          console.log(err);
        });
  

      await incrementarStock(purchaseDetail);
    } catch (error) {
      console.log(error);
    }
};

export const getAllPurchases = async (req, res) => { 
  try {
    const purchases = await Purchases.find()
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las compras' });
    console.log(error)
  }
}

export const getPurchaseById = async (req, res) => { 
  const {purchaseId} = req.params
  try {
    const purchase = await Purchases.findById({_id: purchaseId});
    if (!purchase) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener compra' });
  }
}

export const updateCompra = async (req, res) => { 
  const {purchaseId} = req.params
  const {month, year, day} = req.body
  console.log(req.body)

      try {
        Purchases.findByIdAndUpdate({ _id: purchaseId }, { 
          month: month,
          year: year,
          day: day,
        })
        .then((newPurchaseData) => {                                      
          res.status(200).json({ message: 'Compra actualizada', newPurchaseData});
        })
        .catch((err) => { 
        console.log(err)
        })

    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const deletePurchase = async (req, res) => { 
  const { purchaseId } = req.params;

  try {
    const deletedCompra = await Purchases.findByIdAndDelete({_id: purchaseId});

    if (deletedCompra) {
      res.status(200).json({ message: 'Compra eliminada correctamente', deleted: deletedCompra });
    } else {
      res.status(404).json({ message: 'Compra no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}

export const deleteAndReplenishShares = async (req, res) => { 
  const { purchaseId } = req.params;
  try {
    const compra = await Purchases.findById({_id: purchaseId});
    if (!compra) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }
    const productosComprados = compra.purchaseDetail;
    console.log("ACA MIRA:", productosComprados)
    await Promise.all(
      productosComprados.map(async (productoComprado) => {
        const { productId, quantity } = productoComprado;
        const cantidad = parseInt(quantity, 10);
    
        await ProductsClients.findByIdAndUpdate(
          {_id: productId},
          { $inc: { stock: -cantidad } },
          { new: true }
        );
      })
    );

    await Purchases.findByIdAndDelete(purchaseId);

    res.status(200).json({ mensaje: 'Compra eliminada y stock repuesto' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
  }
};


export const updatePurchaseDetail  = async (req, res) => { 
  const { purchaseId } = req.params;
  const { newPurchaseDetailData } = req.body;

  try {
    if (newPurchaseDetailData && newPurchaseDetailData.purchaseDetail ) {
      const updatePurchaseData = await Purchases.findOneAndUpdate(
        { _id: purchaseId },
        {
          $set: {
            purchaseDetail: newPurchaseDetailData.purchaseDetail,
          },
        },
        { new: true }
      );

      res.json({ message: "Se actualizo correctamente el detalle de la Orden", updatePurchaseData });
    } else {
      res.status(400).json({ message: 'El objeto newPurchaseDetailData no tiene la estructura esperada.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

