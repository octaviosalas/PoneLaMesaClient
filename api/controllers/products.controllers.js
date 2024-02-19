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
  const {articulo, precioUnitarioAlquiler, precioUnitarioAlquilerBonificados, precioUnitarioReposicion} = req.body


  try {
          ProductsClients.findByIdAndUpdate({ _id: productId }, { 
          articulo: articulo,
          precioUnitarioAlquiler: precioUnitarioAlquiler,
          precioUnitarioAlquilerBonificados: precioUnitarioAlquilerBonificados,
          precioUnitarioReposicion: precioUnitarioReposicion,
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



