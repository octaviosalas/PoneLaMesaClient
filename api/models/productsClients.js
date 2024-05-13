import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
      articulo: { 
       type: String,
      },
      precioUnitarioAlquiler: { 
        type: Number
      },
      precioUnitarioReposicion: { 
        type: Number
      },
      precioUnitarioBonificados: { 
        type: Number,
      },
      stock: { 
        type: Number
      },
      estimatedWashTime: { 
        type: Number
      },
      Categoria: { 
        type: String
      }
  });
  
  const ProductsClients = mongoose.model("ProductsClients", productsSchema);
  
  export default ProductsClients;

