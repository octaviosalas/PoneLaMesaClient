import Purchases from "../models/purchases.js";
import ProductsClients from "../models/productsClients.js";
import { incrementarStock, decrementarStock } from "./orders.controllers.js";
import Expenses from "../models/expenses.js";



export const savePurchase = async (req, res) => {

    const { purchase, expense } = req.body; 

    try {
      
      const newPurchaseToBeSaved = new Purchases({
        date: purchase.date,
        day: purchase.day,
        month: purchase.month,
        year: purchase.year,
        total: purchase.total,
        purchaseDetail: purchase.purchaseDetail,
        creatorPurchase: purchase.creatorPurchase,
    });

    await newPurchaseToBeSaved.save();
    console.log("_ID DE LA COMPRA CREADA", newPurchaseToBeSaved._id)
    console.log("ID DE LA COMPRA CREADA", newPurchaseToBeSaved.id)

    const newExpenseToBeSaved = new Expenses({
        loadedByName: expense.loadedByName,
        loadedById: expense.loadedById,
        typeOfExpense: expense.typeOfExpense,
        amount: expense.amount,
        date: expense.date,
        day: expense.day,
        month: expense.month,
        year: expense.year,
        expenseDetail: expense.expenseDetail,
        providerName: expense.providerName,
        providerId: expense.providerId,
        purchaseReferenceId: newPurchaseToBeSaved._id 
    });

    await newExpenseToBeSaved.save();
    await incrementarStock(purchase.purchaseDetail); 

    res.status(200).json({message: "Almacenado"})

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


export const getPurchasesByMonth = async (req, res) => { 
  const {month} = req.params
  console.log(month)

  try {
     const thisMonthPurchases = await Purchases.find({month: month})
     res.status(200).json(thisMonthPurchases);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las compras del mes' });
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
    const deletedExpense = await Expenses.findByIdAndDelete({purchaseReferenceId: purchaseId})

    if (deletedCompra && deletedExpense) {
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
    await Expenses.findOneAndDelete({ purchaseReferenceId: purchaseId });
   

    res.status(200).json({ mensaje: 'Compra eliminada y stock repuesto' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
  }
};


export const updatePurchaseDetail = async (req, res) => { 
  const { purchaseId } = req.params;
  const { newPurchaseDetailData } = req.body;
  console.log("CUERPO COMPLETO", req.body)
  console.log("PARA DESCONTAR STOCK", req.body.toDiscountStock)
  console.log("PARA AUMENTAR STOCK", req.body.toIncrementStock)
  console.log("nuevo monto total", req.body.newTotalAmount)
  console.log("EL ARRAY NUEVO ENTERO", req.body.completeNewDetail)
  console.log("EL ID QUE LLEGA POR PARAMS", purchaseId)
 
  try {
     if (req.body && req.body.completeNewDetail) {
       const updatePurchaseData = await Purchases.findOneAndUpdate(
         { _id: purchaseId },
         {
           $set: {
             purchaseDetail: req.body.completeNewDetail,
             total: req.body.newTotalAmount
           },
         },
         { new: true }
       );
 
       if(req.body.toDiscountStock.length > 0) { 
         await decrementarStock(req.body.toDiscountStock);
       }
 
       if(req.body.toIncrementStock.length > 0) { 
         await incrementarStock(req.body.toIncrementStock);
       }
 

       res.status(200).json({ message: "Se actualizo correctamente el detalle de la Orden", updatePurchaseData });
     } else {
       res.status(400).json({ message: 'El objeto newPurchaseDetailData no tiene la estructura esperada.' });
     }
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Error interno del servidor' });
  }
}



/* 

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

*/