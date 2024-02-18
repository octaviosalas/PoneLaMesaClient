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



export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const {
    articulo,
    precioUnitarioAlquiler,
    precioUnitarioAlquilerBonificados,
    precioUnitarioReposicion
  } = req.body;

  try {
    const updatedProduct = await ProductsClients.updateOne(
      { 
        // Busca el objeto dentro de los arrays utilizando el _id del subdocumento
        $or: [
          { 'platos._id': productId },
          { 'copas._id': productId },
          { 'juegoDeTe._id': productId },
          { 'juegoDeCafe._id': productId },
          { 'varios._id': productId },
          { 'manteleria._id': productId },
          { 'mesasYSillas._id': productId }
        ]
      },
      {
        $set: {
          "platos.$[plato].articulo": articulo,
          "platos.$[plato].precioUnitarioAlquiler": precioUnitarioAlquiler,
          "platos.$[plato].precioUnitarioAlquilerBonificados": precioUnitarioAlquilerBonificados,
          "platos.$[plato].precioUnitarioReposicion": precioUnitarioReposicion,
        }
      },
      {
        arrayFilters: [{ "plato._id": productId }]
      }
    );

    res.json({
      message: "El Articulo fue modificado Correctamente",
      updatedProduct
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};