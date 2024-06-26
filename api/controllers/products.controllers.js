import ProductsBonusClients from "../models/productsBonusClients.js";
import ProductsClients from "../models/productsClients.js"
import { incrementarStock, decrementarStock } from "./orders.controllers.js";


export const productsClientsData = async (req, res) => { 
   try {
     const getData = await ProductsClients.find()
     res.status(200).json(getData)
   } catch (error) {
     res.status(500).json({error: "Error al obtener productos"})
   }
}



export const productsBonusClientsData = async (req, res) => { 
    try {
        const getData = await ProductsBonusClients.find()
        res.status(200).json(getData)
      } catch (error) {
        res.status(500).json({error: "Error al obtener productos"})
      }
}


export const getProductById = async (req, res) => { 
  const {productId} = req.params
  console.log("ID RECIBIDO", productId)
  try {
    const getData = await ProductsClients.findById({_id: productId})
    if (getData) {
      res.status(200).json(getData);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(getData)
  } catch (error) {
    
  }
}

export const createProduct = async (req, res) => { 
   console.log(req.body)

  try {
    const newArticleToBeSaved = await ProductsClients.create(req.body)
    if (newArticleToBeSaved) {
      res.status(200).json(newArticleToBeSaved);
    } else {
      res.status(404).json({ message: 'Producto no almacenado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const {articulo, precioUnitarioAlquiler, precioUnitarioAlquilerBonificados, precioUnitarioReposicion, categoria, stock} = req.body 
  console.log(req.body)

  try {
          ProductsClients.findByIdAndUpdate({ _id: productId }, { 
          articulo: articulo,
          precioUnitarioAlquiler: precioUnitarioAlquiler,
          precioUnitarioBonificados: precioUnitarioAlquilerBonificados,
          precioUnitarioReposicion: precioUnitarioReposicion,
          Categoria: categoria,
          stock: stock
          })
          .then((newProduct) => {                                      
          res.json({message:"Producto actualizado", newProduct})
          })
          .catch((err) => { 
          console.log(err)
          })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await ProductsClients.findByIdAndDelete({_id :productId});

    if (deletedProduct) {
      res.status(200).json({ message: 'Producto eliminado correctamente', deleted: deletedProduct });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};



export const priceIncrease = async (req, res) => { 

   console.log(req.body)

  try {
    const { percentage } = req.body;

    if (!percentage || isNaN(percentage)) {
      return res.status(400).json({ error: 'Porcentaje no válido' });
    }

    const products = await ProductsClients.find();

    for (const product of products) {
      product.precioUnitarioAlquiler *= 1 + percentage / 100;
      product.precioUnitarioBonificados *= 1 + percentage / 100;
      product.precioUnitarioReposicion *= 1 + percentage / 100;
      await product.save();
    }

    res.json({ success: true, message: `Se aplicó un ${percentage}% de aumento a los precios.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


export const returnQuantityToStock = async (req, res) => { 
  const {productId} = req.params
  await incrementarStock(req.body.productData);
}


export const addEstimatedWashTimeToAllProducts = async (req, res) => { 

  try {
     const result = await ProductsClients.updateMany(
       {}, // Criterio que coincide con todos los documentos
       { $set: { estimatedWashTime: 0.52 } } // Actualiza la propiedad estimatedWashTime a 0.52
     );
     console.log(result); // Muestra el resultado de la operación
  } catch (error) {
     console.error(error); // Maneja cualquier error que pueda ocurrir
  }
 }

/*

 export const addCategory = async (req, res) => {
  try {
    // Actualiza todos los documentos en la colección ProductsClients
    await ProductsClients.updateMany({}, { $set: { Categoria: "local" } });

    // Envía una respuesta indicando éxito
    res.status(200).json({ message: "Categoría agregada exitosamente a todos los productos." });
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la operación
    console.error(error);
    res.status(500).json({ message: "Error al agregar la categoría.", error: error.message });
  }
};*/