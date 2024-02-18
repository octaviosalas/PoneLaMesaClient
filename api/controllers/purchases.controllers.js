import Purchases from "../models/purchases.js";
import ProductsClients from "../models/productsClients.js";


export const updateStock = async (purchaseDetail, model, operation) => {
    for (const productoCompra of purchaseDetail) {
      const { productId, quantity } = productoCompra;
      console.log("Me llego:", productId, quantity);
      const updateValue = operation === 'increase' ? parseInt(quantity) : -parseInt(quantity);
      
      // Busca el producto dentro de los arrays de productos del modelo
      const product = await model.findOne({
        $or: [
          { 'platos._id': productId },
          { 'copas._id': productId },
          { 'juegoDeTe._id': productId },
          { 'juegoDeCafe._id': productId },
          { 'varios._id': productId },
          { 'manteleria._id': productId },
          { 'mesasYSillas._id': productId }
        ]
      });
  
      if (product) {
        console.log("encontre a product", product);
        console.log(typeof product)
        let fieldName = '';
        if (product.platos.find(p => p._id == productId)) {
          fieldName = 'platos';
        } else if (product.copas.find(p => p._id == productId)) {
          fieldName = 'copas';
        } else if (product.juegoDeTe.find(p => p._id == productId)) {
          fieldName = 'juegoDeTe';
        } else if (product.juegoDeCafe.find(p => p._id == productId)) {
          fieldName = 'juegoDeCafe';
        } else if (product.varios.find(p => p._id == productId)) {
          fieldName = 'varios';
        } else if (product.manteleria.find(p => p._id == productId)) {
          fieldName = 'manteleria';
        } else if (product.mesasYSillas.find(p => p._id == productId)) {
          fieldName = 'mesasYSillas';
        }
     
        // Actualiza el stock del producto encontrado
        if (fieldName) {
          console.log(fieldName);
          console.log(quantity)
          console.log(productId)
          await model.updateOne(
            { _id: product._id },
            { $inc: { [fieldName + '.$[elem].stock']: updateValue } },
            { arrayFilters: [{ 'elem._id': productId }] }
          );
        } else {  
          console.log("no encuentro a FIELDDDDDDDDDDDD");
        }
      }
    }
  };

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
          res.json({ message: "Compra guardada", newPurchase });
        })
        .catch((err) => {
          console.log(err);
        });
  

      await updateStock(purchaseDetail, ProductsClients, 'increase');
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
    
}

export const updateCompra = async (req, res) => { 
  
}

export const deletePurchase = async (req, res) => { 
    
}

export const deleteAndReplenishShares = async (req, res) => { 
    
}