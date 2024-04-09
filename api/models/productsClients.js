import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
      articulo: { 
       type: String,
      },
      precioUnitarioAlquiler: { 
        type: Number
      },
      precioUnitarioReposicion: { 
        type: mongoose.Schema.Types.Mixed
      },
      precioUnitarioBonificados: { 
        type: Number,
      },
      stock: { 
        type: Number
      },
      estimatedWashTime: { 
        type: Number
      }
  });
  
  const ProductsClients = mongoose.model("ProductsClients", productsSchema);
  
  export default ProductsClients;

